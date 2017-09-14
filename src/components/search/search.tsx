import { Component, Event, EventEmitter, Prop } from '@stencil/core';

@Component({
  tag: 'tq-search',
  styleUrl: 'search.scss'
})
export class Search {
  @Prop() suggest: string;

  @Event() onSearch: EventEmitter;

  render(): JSX.Element {
    return ([
      <div class="tq-search__field tq-search__field--suggest"><span>{ this.suggest }</span><br /></div>,
      <input autoFocus placeholder="search..." class="tq-search__field" type="search" onInput={ (ev) => this.input(ev) } autoComplete="off" role="search" />
    ]);
  }

  input(ev: Event): void {
    const inputEl = ev.target as HTMLInputElement;
    const value = inputEl.value;

    this.onSearch.emit(value);
  }
}
