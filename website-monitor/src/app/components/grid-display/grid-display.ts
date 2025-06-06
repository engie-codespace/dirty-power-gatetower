import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgFor } from '@angular/common';
import { Subscription } from 'rxjs';
import { WebsiteService } from '../../services/website.service';
import { Website } from '../../models/website.model';
import { WebsiteFrame } from '../website-frame/website-frame';

@Component({
  selector: 'app-grid-display',
  standalone: true,
  imports: [NgFor, WebsiteFrame],
  templateUrl: './grid-display.html',
  styleUrl: './grid-display.scss'
})
export class GridDisplay implements OnInit, OnDestroy {
  websites: Website[] = [];
  globalRefreshInterval: number = 60;
  
  private websitesSubscription?: Subscription;
  private refreshIntervalSubscription?: Subscription;
  
  constructor(private websiteService: WebsiteService) {}
  
  ngOnInit(): void {
    this.websitesSubscription = this.websiteService.getWebsites().subscribe(websites => {
      this.websites = websites.filter(website => website.active);
    });
    
    this.refreshIntervalSubscription = this.websiteService.getGlobalRefreshInterval().subscribe(interval => {
      this.globalRefreshInterval = interval;
    });
  }
  
  ngOnDestroy(): void {
    this.websitesSubscription?.unsubscribe();
    this.refreshIntervalSubscription?.unsubscribe();
  }
}
