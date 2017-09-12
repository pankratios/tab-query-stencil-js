import { Component, Listen, Prop, State } from '@stencil/core';
import { Observable } from 'rxjs/Observable';
import { Subscription  } from 'rxjs/Subscription';
/* import 'rxjs/add/operator/take';*/

import { activate, create, getAll, queryHistory } from './utils/tab-manager';
import { Tab } from './utils/tab';
import { nextIndex, prevIndex, daysInMilliseconds } from './utils/math';
import { KEY_MAP } from './utils/key-map';

const findSuggestPattern = /https?\:\/{2}(?:\w{2,3}\.)?([^\/|$]+)/i;

const searchHistory = (term: string, sinceDays?: number, maxItems?: number): Observable<Tab[]> => {
  const startTime = Date.now() - daysInMilliseconds(sinceDays);

  return queryHistory(term, startTime, maxItems);
};

const searchTabs = (term: string, tabs: Tab[]): Tab[] => {
  const pattern = new RegExp(term, 'i');

  return tabs.filter(tab => pattern.test(tab.title) || pattern.test(tab.url));
}

const findSuggest = (term: string, suggests: Tab[]): { url: string, term: string } | undefined => {
  const suggest = suggests.find((suggest) => {
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

@Component({
  tag: 'tq-tabs'
})
export class Tabs {
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
    getAll()
      .take(1)
      .subscribe(tabs => this.tabs = this.items = tabs);
  }

  render(): JSX.Element {
    const suggest = this.suggest ? this.suggest.term : '';

    return ([
      <tq-list items={ this.items } suggest={ suggest } selectedIndex={ this.selectedIndex }></tq-list>,
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
      this.execKeyAction(action);
    }
  }

  search(term: string): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }

    this.updateList(term, term.length ? searchTabs(term, this.tabs) : this.tabs);

    if (!this.items.length) {
      this.subs = searchHistory(term, this.historySinceDays, this.maxHistoryItmes)
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

  execKeyAction(action: string): void {
    switch(action) {
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
        this.selectedIndex = prevIndex(this.selectedIndex, this.items.length - 1);
        break;
      case 'NEXT':
        this.selectedIndex = nextIndex(this.selectedIndex, this.items.length - 1);
        break;
      default:
        throw `Action ${action} not supported`;
    }
  }
}
