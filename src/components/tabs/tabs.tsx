import { Component, Listen, State } from '@stencil/core';

import { activate, create, getAll, queryHistory } from './utils/tab-manager';
import { Tab } from './utils/tab';
import { nextIndex, prevIndex } from './utils/math';
import { KEY_MAP } from './utils/key-map';

@Component({
  tag: 'tq-tabs'
})
export class Tabs {
  @State() selectedIndex = 0;
  @State() items: Tab[] = [];
  @State() suggest: { term: string, url: string };

  tabs: Tab[] = [];
  maxHistoryItmes = 5;
  minInputLength = 2;
  sinceDays = 3;

  get selected(): Tab {
    return this.items[this.selectedIndex];
  }

  componentDidLoad(): void {
    getAll()
      .then(tabs => this.tabs = this.items = tabs);
  }

  render(): JSX.Element {
    const suggest = this.suggest ? this.suggest.term : '';

    return ([
      <tq-list items={ this.items } suggest={ suggest } selectedIndex={ this.selectedIndex }></tq-list>,
    ]);
  }

  @Listen('onSearch')
  onSearch(ev: CustomEvent): void {
    const term = ev.detail;
    const searchPattern = new RegExp(ev.detail, 'i');

    this.items = searchPattern ? this.tabs.filter((tab) => searchPattern.test(tab.title)) : this.tabs;

    if (!this.items.length) {
      this.updateSuggest(term);
    } else {
      this.suggest = undefined;
    }
  }

  @Listen('window:keydown')
  onSelect(ev: KeyboardEvent): void {
    let key = ev.key.toUpperCase();

    if (ev.metaKey) {
      key = `M${key}`;
    }

    this.execKeyAction(KEY_MAP[key]);
  }

  updateSuggest(term: string): void {
    if (term.length < this.minInputLength) return;

    const startTime = Date.now() - 86400000 * this.sinceDays;

    queryHistory(term, startTime, this.maxHistoryItmes)
      .then(suggests => {
        let suggest;

        if (suggests.length) {
          this.items = suggests;
          suggest = this.findSuggest(term, suggests[0])
        }

        this.suggest = suggest;
      })
  }

  findSuggest(term: string, suggest: Tab): any {
    const urlMatch = suggest.url.match(/https?\:\/{2}([^\/|$]+)/);
    const fullUrl = urlMatch[0];
    const suggestTerm = urlMatch[1];
    const index = suggestTerm.indexOf(term);

    return index !== -1 && { url: fullUrl, term: suggestTerm.substring(index) };
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
        /* default:
         *   throw `Action ${action} not supported`;*/
    }
  }
}
