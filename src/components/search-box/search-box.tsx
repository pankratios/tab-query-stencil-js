import { Component, Event, EventEmitter, Prop } from '@stencil/core';

@Component({
  tag: 'search-box',
  styleUrl: 'search-box.scss'
})
export class SearchBox {
  @Prop() suggest: string;
  @Prop() term: string;

  @Event() onSearch: EventEmitter;

  input(ev: Event): void {
    const inputEl = ev.target as HTMLInputElement;
    const value = inputEl.value;

    this.onSearch.emit(value);
  }

  render(): JSX.Element {
    let suggest = this.term;

    if (this.suggest) {
      suggest = this.term + this.suggest.substring(this.term.length);
    }

    return ([
      <input disabled class="query suggest" type="text" value={ suggest || '' } />,
      <input autoFocus class="query" type="search" onInput={ (ev) => this.input(ev) } autoComplete="off" role="search" />
    ]);
  }
}
