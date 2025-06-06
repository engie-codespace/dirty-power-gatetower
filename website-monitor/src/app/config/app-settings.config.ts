import { Website } from '../models/website.model';

export interface AppSettings {
  defaultWebsites: Website[];
  defaultGlobalRefreshInterval: number; // in seconds
}

export const APP_SETTINGS: AppSettings = {
  defaultGlobalRefreshInterval: 60,
  defaultWebsites: [
    { id: 1, name: 'Dirty Power Demo1', url: 'https://engie-codespace.github.io/demo1-dirty-power/', refreshInterval: 60, active: true },
    { id: 2, name: 'Dirty Power Demo2', url: 'https://engie-codespace.github.io/demo2-dirty-power/', refreshInterval: 60, active: true },
    { id: 3, name: 'Dirty Power Demo3', url: 'https://engie-codespace.github.io/demo3-dirty-power/', refreshInterval: 60, active: true },
    { id: 4, name: 'Dirty Power Demo4', url: 'https://engie-codespace.github.io/demo4-dirty-power/', refreshInterval: 60, active: true },
    { id: 5, name: 'Dirty Power Demo5', url: 'https://engie-codespace.github.io/demo5-dirty-power/', refreshInterval: 60, active: true },
    { id: 6, name: 'Dirty Power Demo6', url: 'https://engie-codespace.github.io/demo6-dirty-power/', refreshInterval: 60, active: true },
    { id: 7, name: 'Dirty Power Demo7', url: 'https://engie-codespace.github.io/demo7-dirty-power/', refreshInterval: 60, active: true },
    { id: 8, name: 'Dirty Power Demo8', url: 'https://engie-codespace.github.io/demo8-dirty-power/', refreshInterval: 60, active: true },
    // You can add more default websites here
  ]
};
