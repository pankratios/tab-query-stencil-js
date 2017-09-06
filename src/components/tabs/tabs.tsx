import { Component, Listen, State } from '@stencil/core';
import { getAll, activate } from './tab-manager';
import { Tab } from './tab';
import { nextIndex, prevIndex } from './math';
import { KEY_MAP } from './key-map';

@Component({
  tag: 'tq-tabs',
  styleUrl: 'tabs.scss'
})
export class Tabs {
  @State() tabs: Tab[] = [];
  @State() selectedIndex = 0;
  @State() search: { term: string, test: RegExp };

  filteredTabs: Tab[] = [];

  get selected(): Tab {
    return this.tabs[this.selectedIndex];
  }

  componentDidLoad(): void {
    getAll().then((tabs) => this.tabs = this.filteredTabs = tabs);
  }

  render(): JSX.Element {
    const tabs = this.filteredTabs;
    const suggest = tabs.length && tabs[0].title;
    const term = this.search ? this.search.term : '';

    return ([
      <tq-search-box suggest={ suggest } term={ term }></tq-search-box>,
      <div class="container">
        <ul class="list">{ tabs.map((tab, index) => renderTab(tab, index === this.selectedIndex)) }</ul>
      </div>
    ]);
  }

  @Listen('onSearch')
  onSearch(ev: CustomEvent): void {
    const term = ev.detail;

    this.search = { term, test: new RegExp(ev.detail, 'i') };
    this.filteredTabs = this.search ? this.tabs.filter((tab) => this.search.test.test(tab.title)) : this.tabs;
  }

  @Listen('window:keydown')
  onSelect(ev: KeyboardEvent): void {
    let key = ev.key.toUpperCase();
    key = ev.metaKey ? `M${key}` : key;

    this.execKeyAction(key);
  }

  execKeyAction(key: string): void {
    switch(KEY_MAP[key] || key) {
      case 'CLOSE':
        window.close();
        break;
      case 'ACTIVATE':
        activate(this.selected);
        break;
      case 'PREV':
        this.selectedIndex = prevIndex(this.selectedIndex, this.filteredTabs.length - 1);
        // up
        break;
      case 'NEXT':
        this.selectedIndex = nextIndex(this.selectedIndex, this.filteredTabs.length - 1);
        // down
        break;
    }
  }
}

const renderTab = (tab: Tab, selected: boolean): JSX.Element => {
  const styles = {
    backgroundImage: `url(${tab.favIconUrl})`
  };
  const classes = {
    item: true,
    'item--selected': selected,
    'item--highlighted': tab.highlighted
  };

  return (<li style={ styles } class={ classes }>{ tab.title }</li>);
}
