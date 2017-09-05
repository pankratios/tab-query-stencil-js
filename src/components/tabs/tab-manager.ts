import { Tab } from './tab';

// stub for browser dev
const chromeTabsStub = {
  update: (tabId, opts) => {
    console.info('chrome stub update tab: ', tabId, opts);
  },
  query: (opts, callback) => {
    console.log(opts);
    callback([
      { id: 1, title: 'Preethi Instagramm' },
      { id: 2, title: 'Lena twitter' },
      { id: 3, title: 'Alien 1 youtube' },
      { id: 4, title: 'Unity 3d - Animation - Cinemachine' },
      { id: 5, title: 'Blender - Tutorial - Video - UV Mapping' }
    ]);
  }
}

export class TabManager {
  private get tabs(): any {
    return chrome.tabs || chromeTabsStub;
  }

  public getAll(): Promise<Tab[]> {
    const options = { currentWindow: true };
    const tabs = new Promise((resolve) => {
      this.tabs.query(options, (tabs: chrome.tabs.Tab[]) => resolve(tabs))
    })
      .then((tabs: chrome.tabs.Tab[]) => tabs.map(({ title, id }) => ({ title, id })));

    return tabs;
  }

  public activate(tabId: number): void {
    this.tabs.update(tabId, { active: true });
  }
}
