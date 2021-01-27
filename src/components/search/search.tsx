import { Component, Event, EventEmitter, Prop } from '@stencil/core';

@Component({
  tag: 'tq-search',
  styleUrl: 'search.scss'
})
export class Search {
  @Prop() suggest: string;

  @Event() onSearch: EventEmitter;

  searchHintEl!: HTMLSpanElement;

  render(): JSX.Element {
    return ([
      <div class="tq-search__field tq-search__field--suggest">
        <span>{ this.suggest }</span>
        { this.suggest && <span class="tq-search__hint">Press <b>⇥ </b> to open</span> }
        <br />
      </div>,
      <input autoFocus placeholder="Search" class="tq-search__field" type="search" onInput={ (ev) => this.input(ev) } autoComplete="off" role="search" />
    ]);
  }

  input(ev: Event): void {
    const inputEl = ev.target as HTMLInputElement;
    const value = inputEl.value;

    this.onSearch.emit(value);
  }
}
