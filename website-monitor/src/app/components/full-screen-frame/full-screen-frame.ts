import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Website } from '../../models/website.model';
import { WebsiteFrame } from '../website-frame/website-frame';

@Component({
  selector: 'app-full-screen-frame',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, WebsiteFrame],
  styleUrls: ['./fullscreen-fix.css'],
  template: `
    <div class="full-screen-overlay">
      <div class="full-screen-content">
        <button mat-icon-button class="close-button" (click)="close.emit()">
          <mat-icon>close</mat-icon>
        </button>
        <app-website-frame 
          [website]="website" 
          [globalRefreshInterval]="globalRefreshInterval"
          [isFullScreen]="true"
          class="full-screen-frame fullscreen-iframe-fix">
        </app-website-frame>
      </div>
    </div>
  `,
  styles: [`
    .full-screen-overlay {
      position: fixed;
      top: 64px; // Leave space for navbar
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.7);
      z-index: 1000;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 24px;
    }

    .full-screen-content {
      position: relative;
      width: 100%;
      height: 100%;
      background: white;
      border-radius: 8px;
      overflow: auto;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    }

    .close-button {
      position: absolute;
      top: 16px;
      right: 16px;
      z-index: 1001;
      background-color: rgba(255, 255, 255, 0.9);
    }

    .full-screen-frame {
      display: block;
      height: calc(100% - 32px);
      margin: 16px;
      width: calc(100% - 32px);
      position: relative;

      ::ng-deep {
        .website-frame-container {
          height: 100%;
        }

        .website-card {
          height: 100%;
          width: 100%;
          cursor: default;
        }

        .iframe-container {
          height: 100%;
          pointer-events: auto !important;
          
          iframe {
            width: 100% !important;
            height: 100% !important;
            transform: none !important;
            position: relative !important;
            pointer-events: auto !important;
          }
        }
      }
    }

    :host {
      display: contents;
    }
  `]
})
export class FullScreenFrame {
  @Input() website!: Website;
  @Input() globalRefreshInterval: number = 60;
  @Output() close = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscapePressed(): void {
    this.close.emit();
  }
}
