import { Component, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'search-box',
  styleUrl: 'search-box.scss'
})
export class SearchBox {
  @Event() onSearch: EventEmitter;

  input(ev: Event): void {
    const inputEl = ev.target as HTMLInputElement;
    const value = inputEl.value;

    this.onSearch.emit(value);
  }

  render() {
    return (
      <input onInput={(ev) => this.input(ev)} placeholder="Image name" autoComplete="off" role="search" type="search" />
    );
  }
}
