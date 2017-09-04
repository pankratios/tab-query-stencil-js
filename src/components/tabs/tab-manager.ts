// stub for browser dev
const chromeTabsStub = {
  query: (opts, callback) => {
    console.log(opts);
    callback([
      { title: 'Preethi Instagramm' },
      { title: 'Lena twitter' },
      { title: 'Alien 1 youtube' },
      { title: 'Unity 3d - Animation - Cinemachine' },
      { title: 'Blender - Tutorial - Video - UV Mapping' }
    ]);
  }
}

export interface Tab {
  title: string;
  url?: string;
}

export class TabManager {
  private get tabs(): any {
    return chrome.tabs || chromeTabsStub;
  }

  public getAll(): Promise<Tab[]> {
    const options = { currentWindow: true };
    const tabs = new Promise((resolve) => {
      this.tabs.query(options, (tabs: chrome.tabs.Tab[]) => resolve(tabs))
    }).then((tabs: chrome.tabs.Tab[]) => tabs.map(tab => ({ title: tab.title })));

    return tabs;
  }
}
