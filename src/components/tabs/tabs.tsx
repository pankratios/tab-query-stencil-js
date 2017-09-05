import { Component, Listen, State } from '@stencil/core';
import { getAll, activate } from './tab-manager';
import { Tab } from './tab';
import { KEY_MAP } from './key-map';

const renderTab = (tab: Tab): JSX.Element => {
  const styles = {
    backgroundImage: `url(${tab.favIconUrl})`
  };
  const classes = {
    item: true,
    'item--selected': tab.selected,
    'item--highlighted': tab.highlighted
  };

  return (<li style={ styles } class={ classes }>{ tab.title }</li>);
}

@Component({
  tag: 'tq-tabs',
  styleUrl: 'tabs.scss'
})
export class Tabs {
  @State() tabs: Tab[] = [];
  @State() search: { term: string, test: RegExp };

  componentDidLoad(): void {
    getAll().then((tabs) => this.tabs = tabs);
  }

  render(): JSX.Element {
    const tabs = this.search ? this.tabs.filter((tab) => this.search.test.test(tab.title)) : this.tabs;
    const suggest = tabs.length && tabs[0].title;
    const term = this.search ? this.search.term : '';

    return ([
      <tq-search-box suggest={ suggest } term={ term }></tq-search-box>,
      <div class="container">
        <ul class="list">{ tabs.map(renderTab) }</ul>
      </div>
    ]);
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
        activate(this.tabs[0].id);
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
}
