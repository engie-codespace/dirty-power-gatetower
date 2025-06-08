import { Component, Input, OnDestroy, OnInit, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule, MatCardModule, MatProgressBarModule, MatIconModule, MatButtonModule],
  templateUrl: './website-frame.html',
  styleUrl: './website-frame.scss'
})
export class WebsiteFrame implements OnInit, OnDestroy, AfterViewInit {
  @Input() website!: Website;
  @Input() globalRefreshInterval: number = 60;
  @Input() isFullScreen: boolean = false;  // Add this line
  @Output() toggleFullScreen = new EventEmitter<void>();

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
    if (!this.website) {
      console.error('No website data provided to WebsiteFrame'); // Keep error log
      return;
    }
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
    
    // Apply direct DOM style updates for fullscreen mode
    this.updateFullscreenStyles();
  }
  
  private updateFullscreenStyles(): void {
    // Wait for DOM to be ready
    setTimeout(() => {
      if (this.isFullScreen && this.frameElement?.nativeElement) {
        // Direct style application for maximum compatibility
        const iframe = this.frameElement.nativeElement;
        iframe.style.pointerEvents = 'auto';
        iframe.style.position = 'relative';
        iframe.style.transform = 'none';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        
        // Fix container
        const container = iframe.parentElement;
        if (container) {
          container.style.pointerEvents = 'auto';
          container.style.overflow = 'auto';
          container.style.height = '100%';
        }
        
        // Fix card if needed
        const card = container?.parentElement?.parentElement;
        if (card) {
          card.style.cursor = 'default';
          card.style.overflow = 'auto';
        }
        
        this.cdr.detectChanges();
      }
    }, 0);
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
  
  onCardClick(): void {
    if (!this.isFullScreen) {
      this.toggleFullScreen.emit();
    }
  }
}
