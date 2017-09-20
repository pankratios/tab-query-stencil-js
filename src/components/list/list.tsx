import { Component, Prop } from '@stencil/core';

import { Tab } from './../tabs/utils/tab';

@Component({
  tag: 'tq-list',
  styleUrl: 'list.scss'
})
export class List {
  @Prop() selectedIndex = 0;
  @Prop() items: Tab[] = [];
  @Prop() suggest: string;

  render(): JSX.Element {
    return ([
      <tq-search suggest={ this.suggest }></tq-search>,
      <div class="tq-list__container">
        <ul class="tq-list__list">{ this.items.map((tab, index) => renderTab(tab, index === this.selectedIndex)) }</ul>
      </div>
    ]);
  }
}

const renderTab = (tab: Tab, selected: boolean): JSX.Element => {
  const styles = tab.favIconUrl ? { backgroundImage: `url(${tab.favIconUrl})` } : { };
  const classes = {
    'tq-list__item': true,
    'tq-list__item--thumbnail': !!tab.favIconUrl,
    'tq-list__item--selected': selected,
    'tq-list__item--highlighted': tab.highlighted
  };

  return (
    <li style={ styles } class={ classes }>
      <h1 class="tq-list__heading">{ tab.title }</h1>
      <h2 class="tq-list__sub">{ tab.url }</h2>
    </li>
  );
}
