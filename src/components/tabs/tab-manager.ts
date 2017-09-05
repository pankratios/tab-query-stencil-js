import { Tab } from './tab';

export const getAll = (): Promise<Tab[]> => {
  const options = { currentWindow: true };
  const tabs = new Promise((resolve) => {
    chromeTabs().query(options, (tabs: chrome.tabs.Tab[]) => resolve(tabs));
  })
    .then((tabs: chrome.tabs.Tab[]) => {
      return tabs.map(convertTab)
    });

  return tabs;
}

export const activate = (tabId: number): void => {
  chromeTabs().update(tabId, { active: true });
}

// stub for browser dev
const chromeTabsStub = {
  update: (tabId, opts) => {
    console.info('chrome stub update tab: ', tabId, opts);
  },
  query: (opts, callback) => {
    console.log(opts);
    callback([
      { id: 1, title: 'Preethi Instagramm', favIconUrl: 'url.jpg', highlighted: false },
      { id: 2, title: 'Lena twitter', favIconUrl: 'url.jpg', highlighted: false },
      { id: 3, title: 'Alien 1 youtube', favIconUrl: 'url.jpg', highlighted: false },
      { id: 4, title: 'Unity 3d - Animation - Cinemachine', favIconUrl: 'url.jpg', highlighted: true },
      { id: 5, title: 'Blender - Tutorial - Video - UV Mapping', favIconUrl: 'url.jpg', highlighted: false },
    ]);
  }
}

const chromeTabs = (): any => chrome.tabs || chromeTabsStub;

const convertTab = (tab: chrome.tabs.Tab): Tab => {
  const { title, id, highlighted, favIconUrl } = tab;

  return { title, id, favIconUrl, highlighted, selected: false };
}
