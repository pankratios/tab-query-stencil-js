import { Component, Listen, State } from '@stencil/core';
import { activate, create, getAll, queryHistory } from './tab-manager';
import { Tab } from './tab';
import { nextIndex, prevIndex } from './math';
import { KEY_MAP } from './key-map';

@Component({
  tag: 'tq-tabs',
  styleUrl: 'tabs.scss'
})
export class Tabs {
  @State() selectedIndex = 0;
  @State() filteredTabs: Tab[] = [];
  @State() suggest: { term: string, url: string };

  tabs: Tab[] = [];
  maxHistoryItmes = 5;
  minInputLength = 2;

  get selected(): Tab {
    return this.filteredTabs[this.selectedIndex];
  }

  componentDidLoad(): void {
    getAll()
      .then(tabs => this.tabs = this.filteredTabs = tabs);
  }

  render(): JSX.Element {
    const suggest = this.suggest ? this.suggest.term : '';

    return ([
      <tq-search-box suggest={ suggest }></tq-search-box>,
      <div class="container">
        <ul class="list">{ this.filteredTabs.map((tab, index) => renderTab(tab, index === this.selectedIndex)) }</ul>
      </div>
    ]);
  }

  @Listen('onSearch')
  onSearch(ev: CustomEvent): void {
    const term = ev.detail;
    const searchPattern = new RegExp(ev.detail, 'i');

    this.filteredTabs = searchPattern ? this.tabs.filter((tab) => searchPattern.test(tab.title)) : this.tabs;

    if (!this.filteredTabs.length) {
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

    queryHistory(term, this.maxHistoryItmes)
      .then(suggests => {
        let suggest;

        if (suggests.length) {
          this.filteredTabs = suggests;
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
        activate(this.selected);
        break;
      case 'COMPLETE':
        if (this.suggest) {
          create(this.suggest.url);
        }
      case 'PREV':
        this.selectedIndex = prevIndex(this.selectedIndex, this.filteredTabs.length - 1);
        break;
      case 'NEXT':
        this.selectedIndex = nextIndex(this.selectedIndex, this.filteredTabs.length - 1);
        break;
      default:
        throw `Action ${action} not supported`;
    }
  }
}

const renderTab = (tab: Tab, selected: boolean): JSX.Element => {
  const styles = tab.favIconUrl ? { backgroundImage: `url(${tab.favIconUrl})` } : {};
  const classes = {
    item: true,
    'item--selected': selected,
    'item--highlighted': tab.highlighted
  };

  return (<li style={ styles } class={ classes }>{ tab.title }</li>);
}
