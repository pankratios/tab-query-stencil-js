import { Component, Listen, Prop, State } from '@stencil/core';
import { TabManager } from './tab-manager';

@Component({
  tag: 'tq-tabs',
  styleUrl: 'tabs.scss'
})
export class Tabs {
  @Prop() first: string;

  @State() tabs: string[] = [];
  @State() searchTerm: RegExp;
  tabManager: TabManager;

  constructor() {
    this.tabManager = new TabManager();
  }

  @Listen('onSearch')
  onSearch(ev: CustomEvent): void {
    this.searchTerm = new RegExp(ev.detail, 'i');
  }

  componentDidLoad(): void {
    this.tabManager.getAll().then((t) => {
      this.tabs = t.map(tab => tab.title);
    });
  }

  filter(name: string): boolean {
    return !this.searchTerm || this.searchTerm.test(name);
  }

  render(): JSX.Element {
    console.log('did load');
    return (
      <div>
        <search-box></search-box>
        <h1>Hello, my name is {this.first}</h1>
        <ul>
          {this.tabs.filter((name) => this.filter(name)).map(name => <li>{name}</li>)}
        </ul>
      </div>
    );
  }
}
