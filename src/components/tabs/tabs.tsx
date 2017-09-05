import { Component, Listen, State } from '@stencil/core';
import { TabManager } from './tab-manager';
import { Tab } from './tab';
import { KEY_MAP } from './key-map';

@Component({
  tag: 'tq-tabs',
  styleUrl: 'tabs.scss'
})
export class Tabs {
  @State() tabs: Tab[] = [];
  @State() search: { term: string, test: RegExp };

  tabManager: TabManager;

  constructor() {
    this.tabManager = new TabManager();
  }

  @Listen('onSearch')
  onSearch(ev: CustomEvent): void {
    const term = ev.detail;

    this.search = { term, test: new RegExp(ev.detail, 'i') };
  }

  @Listen('window:keydown')
  onSelect(ev: KeyboardEvent): void {
    const key = ev.metaKey ? `m${ev.key}` : ev.key;

    switch(KEY_MAP[key] || key) {
      case 'enter':
        this.tabManager.activate(this.tabs[0].id);
        break;
      case 'up':
        console.info('up');
        // up
        break;
      case 'down':
        console.info('down');
        // down
        break;
    }
  }

  componentDidLoad(): void {
    this.tabManager.getAll().then((tabs) => this.tabs = tabs);
  }

  render(): JSX.Element {
    const tabs = this.search ? this.tabs.filter((tab) => this.filter(tab.title)) : this.tabs;
    const suggest = tabs.length && tabs[0].title;
    const term = this.search ? this.search.term : '';

    return ([
      <search-box suggest={ suggest } term={ term }></search-box>,
      <div class="container">
        <ul class="list">
          {tabs.map(tab => <li class="item">{ tab.title }</li>)}
        </ul>
      </div>
    ]);
  }

  filter(name: string): boolean {
    return this.search.test.test(name);
  }
}
