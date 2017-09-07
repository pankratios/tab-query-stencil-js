import { Component, Event, EventEmitter, Prop } from '@stencil/core';

@Component({
  tag: 'tq-search-box',
  styleUrl: 'search-box.scss'
})
export class SearchBox {
  @Prop() suggest: string;
  @Prop() term: string;

  @Event() onSearch: EventEmitter;

  render(): JSX.Element {
    console.log(this.suggest);

    return ([
      <input disabled class="query suggest" type="text" value={ this.suggest } />,
      <input autoFocus class="query" type="search" onInput={ (ev) => this.input(ev) } autoComplete="off" role="search" />
    ]);
  }

  input(ev: Event): void {
    const inputEl = ev.target as HTMLInputElement;
    const value = inputEl.value;

    this.onSearch.emit(value);
  }
}
