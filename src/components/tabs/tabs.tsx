import { Component, Element, Listen, Prop, State } from '@stencil/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { KEY_MAP } from './utils/key-map';
import { daysInMilliseconds, nextIndex, prevIndex } from './utils/math';
import { Tab } from './utils/tab';
import { activate, create, getAll, queryHistory } from './utils/tab-manager';

@Component({
  tag: 'tq-tabs'
})
export class Tabs {
  @Prop({ context: 'isServer' }) private isServer: boolean;
  @Prop() maxHistoryItmes: number = 5;
  @Prop() minInputLength: number = 2;
  @Prop() historySinceDays: number = 3;

  @State() selectedIndex: number = 0;
  @State() items: Tab[] = [];
  @State() suggest: { term: string, url: string };

  @Element() listEl: HTMLElement;

  tabs: Tab[] = [];
  search$: Subject<void> = new Subject();
  subs: Subscription;

  get selected(): Tab {
    return this.items[this.selectedIndex];
  }

  componentDidLoad(): void {
    if (!this.isServer) {
      getAll().pipe(
        take(1))
              .subscribe(tabs => this.tabs = this.items = tabs);
    }
  }

  render(): JSX.Element {
    return ([
      <tq-search suggest={ this.suggest ? this.suggest.term : '' }></tq-search>,
      <tq-list items={ this.items } selectedIndex={ this.selectedIndex }></tq-list>,
    ]);
  }

  @Listen('onSearch')
  onSearch(ev: CustomEvent): void {
    this.search(ev.detail);
  }

  @Listen('window:keydown')
  onSelect(ev: KeyboardEvent): void {
    let key = ev.key.toUpperCase();

    if (ev.metaKey) {
      key = `M${key}`;
    }

    const action = KEY_MAP[key];
    if (action) {
      this.execAction(action);
    }
  }

  /* search(term: string): void {
   *   this.search$.next();


   *   this.search$.
   *   switchMapTo(this.search$)
   *   .pipe(

   *   );
   * } */

  search(term: string): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }

    this.selectedIndex = 0;
    this.updateList(term, term.length ? searchTabs(term, this.tabs) : this.tabs);

    if (!this.items.length) {
      this.subs = searchHistory(term, this.historySinceDays, this.maxHistoryItmes)
        .pipe(take(1))
        .subscribe(suggests => this.updateList(term, suggests));
    }
  }

  updateList(term: string, tabs: Tab[]): void {
    this.items = tabs;

    if (!this.items.length || term.length < this.minInputLength) {
      this.suggest = undefined;
    } else {
      this.suggest = findSuggest(term, this.items);
    }
  }

  changeSelectedIndex(next = true): void {
    const maxIndex = this.items.length - 1;
    const index = next ? nextIndex(this.selectedIndex, maxIndex, true) : prevIndex(this.selectedIndex, maxIndex, true);

    // seems to be faster than querySelector(`.tq-list__item:nth-child(${index + 1})`);
    const selectedEl = this.listEl.querySelectorAll('.tq-list__item')[index];

    selectedEl.scrollIntoView({ behavior: 'instant', block: 'nearest' });
    this.selectedIndex = index;
  }

  execAction(actionName: string): void {
    switch(actionName) {
      case 'CLOSE':
        window.close();
        break;
      case 'ACTIVATE':
        console.info('find a better way to do this');
        if (this.selected.favIconUrl) {
          activate(this.selected.id);
        } else {
          create(this.selected.url);
        }
        break;
      case 'COMPLETE':
        if (this.suggest) {
          create(this.suggest.url);
        }
      case 'PREV':
        this.changeSelectedIndex(false);
        break;
      case 'NEXT':
        this.changeSelectedIndex(true);
        break;
      default:
        throw `Action ${actionName} not supported`;
    }
  }
}


const findSuggestPattern = /https?\:\/{2}(?:\w{2,3}\.)?([^\/|$]+)/i;

const searchHistory = (term: string, sinceDays?: number, maxItems?: number): Observable<Tab[]> => {
  const startTime = Date.now() - daysInMilliseconds(sinceDays);

  return queryHistory(term, startTime, maxItems);
};

const searchTabs = (term: string, tabs: Tab[]): Tab[] => {
  const pattern = new RegExp(term, 'i');

  return tabs.filter(tab => pattern.test(tab.title) || pattern.test(tab.url));
};

const findSuggest = (term: string, suggests: Tab[]): { url: string, term: string } | undefined => {
  return suggests.reduce<{ url: string, term: string } | undefined>((res, suggest) => {
    if (res) {
      return res;
    }

    const urlMatch = suggest.url.match(findSuggestPattern);
    const suggestTerm = urlMatch[1];

    if (suggestTerm.indexOf(term) !== 0) {
      return res;
    }

    return { url: urlMatch[0], term: suggestTerm };
  }, undefined);
};
