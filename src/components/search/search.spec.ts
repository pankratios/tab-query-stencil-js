import { flush, render } from '@stencil/core/testing';

import { Search } from './search';

describe('Search', () => {
  it('should build', () => {
    expect(new Search()).toBeTruthy();
  });

  describe('render', async() => {
    let el: Search & Element;

    beforeEach(async () => {
      el = await render({
        components: [Search],
        html: '<tq-search></tq-search>'
      });
    });

    describe('suggest', () => {
      let suggestEl: Element;

      beforeEach(() => {
        suggestEl = el.querySelector('.tq-search__field--suggest > span');
      });

      it('should be empty', () => {
        expect(suggestEl.textContent).toEqual('');
      });

      it('should be text', async () => {
        el.suggest = 'Suggest';

        await flush(el);
        expect(suggestEl.textContent).toEqual('Suggest');
      });
    });
  });

  describe('input', () => {
    let instance: Search;

    beforeEach(() => {
      instance = new Search();
    });

    it('should emit search event', () => {
      let emitMock = jest.fn();
      instance.onSearch = { emit: emitMock };

      instance.input({ target: { value: 'test' } } as any);
      expect(emitMock.mock.calls.length).toBe(1);
      expect(emitMock.mock.calls[0][0]).toBe('test');
    });
  });
});
