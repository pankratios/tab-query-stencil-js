import { flush, render } from '@stencil/core/testing';
import { Search } from './search';

describe('Search', () => {
  it('should build', () => {
    expect(new Search()).toBeTruthy();
  });

  describe('rendering', () => {
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
        suggestEl = el.querySelector('.tq-search__field--suggest>span');
      });

      it('should work without parameters', () => {
        expect(suggestEl.textContent).toEqual('');
      });

      it('should work a first name', async () => {
        el.suggest = 'Suggest';

        await flush(el);
        expect(suggestEl.textContent).toEqual('Suggest');
      });
    })

    xdescribe('input', () => {
      let inputEl: HTMLInputElement;
      let inputSpy: jest.SpyInstance<(Event) => void>;
      // let inputSpy: jest.SpyInstance<(Event) => void>;

      beforeEach(() => {
        inputEl = el.querySelector('input.tq-search__field') as HTMLInputElement;
        // inputSpy = jest.spyOn(el, 'input');
        // jest.spyOn(el, 'onSearch');

      });

      it('should work a first name', async () => {
        // let spy = jest.spyOn(el, 'onSearch');
        let ev = new Event('input', {});
        console.log(inputEl);
        inputEl.dispatchEvent(ev);

        await flush(el);

        // expect(inputSpy).toHaveBeenCalled();
        // expect().toHaveBeenCalledWith('vAlUe');
      });
    });
  });
});
