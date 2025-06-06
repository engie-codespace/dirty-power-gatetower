import { Component, Input, OnDestroy, OnInit, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { NgIf } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Website } from '../../models/website.model';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-website-frame',
  standalone: true,
  imports: [NgIf, MatCardModule, MatProgressBarModule, MatIconModule, MatButtonModule],
  templateUrl: './website-frame.html',
  styleUrl: './website-frame.scss'
})
export class WebsiteFrame implements OnInit, OnDestroy, AfterViewInit {
  @Input() website!: Website;
  @Input() globalRefreshInterval: number = 60;

  @ViewChild('frame') frameElement!: ElementRef;
  
  safeUrl: SafeResourceUrl = '';
  loading: boolean = true;
  lastRefreshTime: Date = new Date();
  refreshProgress: number = 0;
  refreshSubscription?: Subscription;
  progressSubscription?: Subscription;
  
  constructor(
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    this.updateUrl();
    this.startRefreshTimer();
    this.startProgressTimer();
  }

  ngAfterViewInit(): void {
    if (this.frameElement?.nativeElement) {
      this.frameElement.nativeElement.onload = () => {
        this.loading = false;
        this.cdr.detectChanges();
      };
    }
  }
  
  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
    this.progressSubscription?.unsubscribe();
  }
  
  updateUrl(): void {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.website.url);
    this.loading = true;
    this.lastRefreshTime = new Date();
    this.refreshProgress = 0;
  }
  
  refreshWebsite(): void {
    this.updateUrl();
  }
  
  startRefreshTimer(): void {
    const refreshInterval = this.website.refreshInterval || this.globalRefreshInterval;
    this.refreshSubscription?.unsubscribe();
    
    if (refreshInterval > 0 && this.website.active) {
      this.refreshSubscription = interval(refreshInterval * 1000).subscribe(() => {
        this.refreshWebsite();
      });
    }
  }
  
  startProgressTimer(): void {
    this.progressSubscription?.unsubscribe();
    
    this.progressSubscription = interval(100).subscribe(() => {
      const refreshInterval = this.website.refreshInterval || this.globalRefreshInterval;
      if (refreshInterval > 0) {
        const elapsedMs = Date.now() - this.lastRefreshTime.getTime();
        this.refreshProgress = (elapsedMs / (refreshInterval * 1000)) * 100;
      }
    });
  }
  
  get effectiveRefreshInterval(): string {
    const interval = this.website.refreshInterval || this.globalRefreshInterval;
    if (interval < 60) {
      return `${interval}s`;
    } else {
      return `${Math.floor(interval / 60)}m ${interval % 60}s`;
    }
  }
}
