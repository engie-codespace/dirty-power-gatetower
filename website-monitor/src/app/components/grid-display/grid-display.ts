import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { WebsiteService } from '../../services/website.service';
import { Website } from '../../models/website.model';
import { WebsiteFrame } from '../website-frame/website-frame';

@Component({
  selector: 'app-grid-display',
  standalone: true,
  imports: [CommonModule, WebsiteFrame],
  templateUrl: './grid-display.html',
  styleUrl: './grid-display.scss'
})
export class GridDisplay implements OnInit, OnDestroy {
  websites: Website[] = [];
  globalRefreshInterval: number = 60;
  
  private websitesSubscription?: Subscription;
  private refreshIntervalSubscription?: Subscription;
  
  constructor(private websiteService: WebsiteService) {
  }
  
  ngOnInit(): void {
    
    this.websitesSubscription = this.websiteService.getWebsites().subscribe({
      next: (websites) => {
        this.websites = websites.filter(website => website.active);
      },
      error: (error) => console.error('Error getting websites:', error)
    });
    
    this.refreshIntervalSubscription = this.websiteService.getGlobalRefreshInterval().subscribe({
      next: (interval) => {
        this.globalRefreshInterval = interval;
      },
      error: (error) => console.error('Error getting refresh interval:', error)
    });
  }
  
  ngOnDestroy(): void {
    this.websitesSubscription?.unsubscribe();
    this.refreshIntervalSubscription?.unsubscribe();
  }
}
