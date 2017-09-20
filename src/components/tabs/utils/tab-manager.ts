import { Tab } from './tab';
import { Observable } from 'rxjs/RX';

export const getAll = (): Observable<Tab[]> => {
  const all = Observable.bindCallback<chrome.tabs.Tab[]>((
    callback: (tabs: chrome.tabs.Tab[]) => void
  ) => chromeTabs().getAllInWindow(callback));

  return all()
    .map((tabs: chrome.tabs.Tab[]) => tabs.map(convertItem));
};

export const queryHistory = (text: string, startTime, maxResults = 1): Observable<Tab[]> => {
  const search = Observable.bindCallback((
    text: string,
    startTime: number,
    maxResults: number,
    callback: (historyItems: chrome.history.HistoryItem[]) => void
  ) => chromeHistory().search({text, startTime, maxResults}, callback));

  return search(text, startTime, maxResults)
    .map(historyItems => historyItems.map(convertItem));
};

export const activate = (id: number): void => {
  chromeTabs().update(id, { active: true });
};

export const create = (url: string): void => {
  chromeTabs().create({ url, active: true });
};

const convertItem = (item: any): Tab => {
  const { title, id, favIconUrl, url, highlighted } = item;


  return { title, id, favIconUrl, highlighted, url };
};

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
  create: (tabId, opts) => {
    console.info('chrome stub create tab: ', tabId, opts);
  },
  all: (callback) => callback(tabsStub),
  getAllInWindow: (callback) => callback(tabsStub),
};
