export class TabManager {
  constructor() {
  }

  public getAll(): Promise<chrome.tabs.Tab[]>  {
    return new Promise((resolve) => {
      chrome
        .tabs
        .query({currentWindow: true}, (res: chrome.tabs.Tab[]) => {
          resolve(res);
        });
    });
  }
}
