import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Website } from '../models/website.model';

@Injectable({
  providedIn: 'root'
})
export class WebsiteService {
  // Default websites with sample URLs
  private defaultWebsites: Website[] = [
    { id: 1, name: 'Sample 1', url: 'https://example.com', refreshInterval: 60, active: true },
    { id: 2, name: 'Sample 2', url: 'https://example.org', refreshInterval: 60, active: true },
    { id: 3, name: 'Sample 3', url: 'https://example.net', refreshInterval: 60, active: true },
    { id: 4, name: 'Sample 4', url: 'https://example.edu', refreshInterval: 60, active: true },
    { id: 5, name: 'Sample 5', url: 'https://example.co.uk', refreshInterval: 60, active: true },
    { id: 6, name: 'Sample 6', url: 'https://example.io', refreshInterval: 60, active: true },
    { id: 7, name: 'Sample 7', url: 'https://example.dev', refreshInterval: 60, active: true },
    { id: 8, name: 'Sample 8', url: 'https://example.tech', refreshInterval: 60, active: true },
  ];

  private globalRefreshInterval = 60; // Default global refresh interval in seconds
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
}
