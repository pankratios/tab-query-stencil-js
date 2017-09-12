import { Component, Listen, Prop, State } from '@stencil/core';

import { activate, create, getAll, queryHistory } from './utils/tab-manager';
import { Tab } from './utils/tab';
import { nextIndex, prevIndex, daysInMilliseconds } from './utils/math';
import { KEY_MAP } from './utils/key-map';

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
    this.search(ev.detail);
  }

  @Listen('window:keydown')
  onSelect(ev: KeyboardEvent): void {
    let key = ev.key.toUpperCase();

    if (ev.metaKey) {
      key = `M${key}`;
    }

    this.execKeyAction(KEY_MAP[key]);
  }

  search(term: string): void {
    const searchPattern = new RegExp(term, 'i');

    this.items = searchPattern ? this.tabs.filter((tab) => searchPattern.test(tab.title) || searchPattern.test(tab.url)) : this.tabs;

    if (!this.items.length) {
      this.updateSuggest(term);
    } else {
      this.suggest = undefined;
    }
  }

  updateSuggest(term: string): void {
    if (term.length < this.minInputLength) {
      this.suggest = undefined;
    } else {
      const startTime = Date.now() - daysInMilliseconds(this.historySinceDays);

      queryHistory(term, startTime, this.maxHistoryItmes)
        .then(suggests => {
          // if there are items in the list (the input has changed) since this promise was called it needs to be canceled (what we can do)
          if (!this.items.length) {
            let suggest;

            if (suggests.length) {
              suggest = this.findSuggest(term, suggests[0])
              this.items = suggests;
            }
            this.suggest = suggest;

            console.log(this.suggest);
          }
        });
    }
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
