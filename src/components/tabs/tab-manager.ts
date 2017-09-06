import { Tab } from './tab';
import { HistoryItem } from './history-item';

export const query = (currentWindow = true): Promise<Tab[]> => {
  const options = { currentWindow: currentWindow };
  const tabs = new Promise((resolve) => {
    chromeTabs().query(options, (tabs: chrome.tabs.Tab[]) => resolve(tabs));
  })
    .then((tabs: chrome.tabs.Tab[]) => tabs.map(convertTab));

  return tabs;
}

export const getAll = (): Promise<Tab[]> => {
  const tabs = new Promise((resolve) => {
    chromeTabs().getAllInWindow((tabs: chrome.tabs.Tab[]) => resolve(tabs));
  })
    .then((tabs: chrome.tabs.Tab[]) => tabs.map(convertTab));

  return tabs;
}

export const queryHistory = (text: string, maxResults = 1): Promise<HistoryItem[]> => {
  const historyItems = new Promise((resolve) => {
    chromeHistory().search({ text, maxResults }, (historyItems: chrome.history.HistoryItem[]) => resolve(historyItems));
  })
    .then((historyItems: chrome.history.HistoryItem[]) => historyItems.map(convertHistoryItem));

  return historyItems;
}

export const activate = (tab: Tab): void => {
  chromeTabs().update(tab.id, { active: true });
}

const convertTab = (tab: chrome.tabs.Tab): Tab => {
  const { title, id, highlighted, favIconUrl } = tab;

  return { title, id, favIconUrl, highlighted };
}

const convertHistoryItem = (historyItem: chrome.history.HistoryItem): HistoryItem => {
  const { title, url } = historyItem;

  return { title, url };
}

const chromeTabs = (): any => chrome.tabs || chromeTabsStub;
const chromeHistory = (): any => chrome.history || chromeHistoryStub;

// stub for browser dev
const historyItemsStub = [
  { title: 'Some history entry', url: 'www.some-history-entry.url' }
];
const chromeHistoryStub = {
  search: (_, callback) => callback(historyItemsStub)
};
const tabsStub = [
  { id: 1, title: 'Preethi Instagramm', favIconUrl: 'url.jpg', highlighted: false },
  { id: 2, title: 'Lena twitter', favIconUrl: 'url.jpg', highlighted: false },
  { id: 3, title: 'Alien 1 youtube', favIconUrl: 'url.jpg', highlighted: false },
  { id: 4, title: 'Unity 3d - Animation - Cinemachine', favIconUrl: 'url.jpg', highlighted: true },
  { id: 5, title: 'Blender - Tutorial - Video - UV Mapping', favIconUrl: 'url.jpg', highlighted: false },
];
const chromeTabsStub = {
  update: (tabId, opts) => {
    console.info('chrome stub update tab: ', tabId, opts);
  },
  query: (_, callback) => callback(tabsStub),
  getAllInWindow: (callback) => callback(tabsStub),
}
