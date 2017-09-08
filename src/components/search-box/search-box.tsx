import { Component, Event, EventEmitter, Prop } from '@stencil/core';

@Component({
  tag: 'tq-search-box',
  styleUrl: 'search-box.scss'
})
export class SearchBox {
  @Prop() suggest: string;

  @Event() onSearch: EventEmitter;

  render(): JSX.Element {
    return ([
      <div class="query suggest">{ this.suggest }<br /></div>,
      <input autoFocus class="query" type="search" onInput={ (ev) => this.input(ev) } autoComplete="off" role="search" />
    ]);
  }

  input(ev: Event): void {
    const inputEl = ev.target as HTMLInputElement;
    const value = inputEl.value;

    this.onSearch.emit(value);
  }
}
