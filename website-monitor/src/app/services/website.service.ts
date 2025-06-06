import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Website } from '../models/website.model';
import { APP_SETTINGS } from '../config/app-settings.config'; // Import new config

@Injectable({
  providedIn: 'root'
})
export class WebsiteService {
  // Use defaults from APP_SETTINGS
  private defaultWebsites: Website[] = APP_SETTINGS.defaultWebsites;
  private globalRefreshInterval = APP_SETTINGS.defaultGlobalRefreshInterval;

  private websitesSubject = new BehaviorSubject<Website[]>(this.loadWebsites());
  private globalRefreshIntervalSubject = new BehaviorSubject<number>(this.loadGlobalRefreshInterval());

  constructor() {
    console.log('WebsiteService initializing');
    // Make sure we have initial data
    const initialWebsites = this.loadWebsites();
    console.log('Initial websites loaded:', initialWebsites);
    if (initialWebsites.length === 0) {
      console.log('No websites found in storage, using defaults');
      this.saveWebsites(this.defaultWebsites);
      this.websitesSubject.next(this.defaultWebsites);
    }
  }

  // Get all websites
  getWebsites(): Observable<Website[]> {
    const websites = this.websitesSubject.getValue();
    console.log('getWebsites called, current websites:', websites);
    return this.websitesSubject.asObservable();
  }

  // Get a single website by ID
  getWebsite(id: number): Website | undefined {
    return this.websitesSubject.getValue().find(website => website.id === id);
  }

  // Add a new website
  addWebsite(website: Omit<Website, 'id'>): void {
    const currentWebsites = this.websitesSubject.getValue();
    const newId = currentWebsites.length > 0 
      ? Math.max(...currentWebsites.map(w => w.id)) + 1 
      : 1;
    
    const newWebsite: Website = {
      ...website,
      id: newId
    };
    
    const updatedWebsites = [...currentWebsites, newWebsite];
    this.websitesSubject.next(updatedWebsites);
    this.saveWebsites(updatedWebsites);
  }

  // Update an existing website
  updateWebsite(website: Website): void {
    const currentWebsites = this.websitesSubject.getValue();
    const updatedWebsites = currentWebsites.map(w => 
      w.id === website.id ? website : w
    );
    
    this.websitesSubject.next(updatedWebsites);
    this.saveWebsites(updatedWebsites);
  }

  // Delete a website
  deleteWebsite(id: number): void {
    const currentWebsites = this.websitesSubject.getValue();
    const updatedWebsites = currentWebsites.filter(w => w.id !== id);
    
    this.websitesSubject.next(updatedWebsites);
    this.saveWebsites(updatedWebsites);
  }

  // Get global refresh interval
  getGlobalRefreshInterval(): Observable<number> {
    return this.globalRefreshIntervalSubject.asObservable();
  }

  // Update global refresh interval
  setGlobalRefreshInterval(seconds: number): void {
    this.globalRefreshInterval = seconds;
    this.globalRefreshIntervalSubject.next(seconds);
    this.saveGlobalRefreshInterval(seconds);
  }

  // Save websites to local storage
  private saveWebsites(websites: Website[]): void {
    localStorage.setItem('websites', JSON.stringify(websites));
  }

  // Load websites from local storage or use defaults
  private loadWebsites(): Website[] {
    const storedWebsites = localStorage.getItem('websites');
    if (storedWebsites) {
      return JSON.parse(storedWebsites);
    }
    return this.defaultWebsites;
  }

  // Save global refresh interval to local storage
  private saveGlobalRefreshInterval(seconds: number): void {
    localStorage.setItem('globalRefreshInterval', seconds.toString());
  }

  // Load global refresh interval from local storage or use default
  private loadGlobalRefreshInterval(): number {
    const storedInterval = localStorage.getItem('globalRefreshInterval');
    return storedInterval ? parseInt(storedInterval, 10) : this.globalRefreshInterval;
  }

  // Reset all settings to their default values from the configuration file
  resetToDefaultSettings(): void {
    localStorage.removeItem('websites');
    localStorage.removeItem('globalRefreshInterval');

    // Re-initialize subjects with default values, which will also update local storage via loadWebsites/loadGlobalRefreshInterval
    this.websitesSubject.next(this.loadWebsites()); 
    this.globalRefreshIntervalSubject.next(this.loadGlobalRefreshInterval());
  }
}
