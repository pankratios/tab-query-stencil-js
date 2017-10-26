import { Component, Element, Prop, PropDidChange } from '@stencil/core';

import { Tab } from './../tabs/utils/tab';

@Component({
  tag: 'tq-list',
  styleUrl: 'list.scss',
  shadow: true
})
export class List {
  @Prop() selectedIndex = 0;
  @Prop() items: Tab[] = [];

  @Element() listContainer: HTMLElement;

  @PropDidChange('selectedIndex')
  didChangeHandler(index: number): void {
    // seems to be faster than querySelector(`.tq-list__item:nth-child(${index + 1})`);
    /* const selectedEl = this.listContainer.querySelector('ul').childNodes[index] as HTMLElement;*/
    const selectedEl = this.listContainer.shadowRoot.lastChild.childNodes[index] as HTMLElement;
    selectedEl && selectedEl.scrollIntoView({ behavior: 'instant', block: 'nearest' });

    // benching :>
    /* const max = 100000;
     * console.time('ul>li');
     * for (var i = max; i > 0; i--) {
     *   this.listContainer.shadowRoot.querySelectorAll('ul>li')[index];
     * }
     * console.timeEnd('ul>li');
     * console.time('li');
     * for (var i = max; i > 0; i--) {
     *   this.listContainer.shadowRoot.querySelectorAll('li')[index];
     * }
     * console.timeEnd('li');
     * console.time('ul query li');
     * for (var i = max; i > 0; i--) {
     *   this.listContainer.shadowRoot.querySelector('ul').querySelectorAll('.tq-list-item')[index];
     * }
     * console.timeEnd('ul query li');
     * console.time('ul child li');
     * for (var i = max; i > 0; i--) {
     *   this.listContainer.shadowRoot.querySelector('ul').childNodes[index]
     * }
     * console.timeEnd('ul child li');
     * console.time('childNodes');
     * for (var i = max; i > 0; i--) {
     *   this.listContainer.shadowRoot.childNodes[1].childNodes[index];
     * }
     * console.timeEnd('childNodes');
     * console.time('lastchild');
     * for (var i = max; i > 0; i--) {
     *   this.listContainer.shadowRoot.lastChild.childNodes[index];
     * }
     * console.timeEnd('lastchild');
     * console.time('children');
     * for (var i = max; i > 0; i--) {
     *   this.listContainer.shadowRoot.children[1].children[index];
     * }
     * console.timeEnd('children');*/
  }

  render(): JSX.Element {
    return (<ul class="tq-list__list">{ this.items.map((tab, index) => renderTab(tab, index === this.selectedIndex)) }</ul>);
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
