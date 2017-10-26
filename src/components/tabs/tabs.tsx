import { Component, Listen, Prop, State } from '@stencil/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { take } from 'rxjs/operators';

import { activate, create, getAll, queryHistory } from './utils/tab-manager';
import { Tab } from './utils/tab';
import { nextIndex, prevIndex, daysInMilliseconds } from './utils/math';
import { KEY_MAP } from './utils/key-map';

@Component({
  tag: 'tq-tabs',
  styleUrl: 'tabs.scss'
})
export class Tabs {
  @Prop({ context: 'isServer' }) private isServer: boolean;
  @Prop() maxHistoryItmes: number = 5;
  @Prop() minInputLength: number = 2;
  @Prop() historySinceDays: number = 3;

  @State() selectedIndex: number = 0;
  @State() items: Tab[] = [];
  @State() suggest: { term: string, url: string };

  tabs: Tab[] = [];
  subs: Subscription;

  get selected(): Tab {
    return this.items[this.selectedIndex];
  }

  componentDidLoad(): void {
    if (!this.isServer) {
      getAll()
        .pipe(
          take(1)
        )
        .subscribe(tabs => this.tabs = this.items = tabs);
    }
  }

  render(): JSX.Element {
    return ([
      <tq-search suggest={this.suggest ? this.suggest.term : ''}></tq-search>,
      <tq-list items={this.items} selectedIndex={this.selectedIndex}></tq-list>,
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

  search(term: string): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }

    this.selectedIndex = 0;
    this.updateList(term, term.length ? searchTabs(term, this.tabs) : this.tabs);

    if (!this.items.length) {
      this.subs = searchHistory(term, this.historySinceDays, this.maxHistoryItmes)
        .pipe(
          take(1)
         )
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

    this.selectedIndex = index;
  }

  execAction(actionName: string): void {
    switch (actionName) {
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
  const suggest = suggests.find(suggest => {
    const urlMatch = suggest.url.match(findSuggestPattern);
    const suggestTerm = urlMatch[1];
    const index = suggestTerm.indexOf(term);

    return index === 0;
  })

  if (suggest) {
    const urlMatch = suggest.url.match(findSuggestPattern);
    const url = urlMatch[0];
    const suggestTerm = urlMatch[1];

    return { url, term: suggestTerm };
  }

  return undefined;
};
