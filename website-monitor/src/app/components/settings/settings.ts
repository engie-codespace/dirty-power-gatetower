import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';

import { WebsiteService } from '../../services/website.service';
import { Website } from '../../models/website.model';
import { Header } from '../header/header';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    NgFor, NgIf, ReactiveFormsModule, FormsModule, MatFormFieldModule, 
    MatInputModule, MatButtonModule, MatIconModule, MatSlideToggleModule,
    MatCardModule, MatListModule, RouterLink, Header
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class Settings implements OnInit {
  websites: Website[] = [];
  newWebsiteForm: FormGroup;
  globalRefreshInterval: number = 60;
  
  constructor(
    private fb: FormBuilder,
    private websiteService: WebsiteService,
    private snackBar: MatSnackBar
  ) {
    this.newWebsiteForm = this.fb.group({
      name: ['', [Validators.required]],
      url: ['', [Validators.required, Validators.pattern('https?://.+')]],
      refreshInterval: [60, [Validators.required, Validators.min(5)]],
      active: [true]
    });
  }
  
  ngOnInit(): void {
    this.loadWebsites();
    this.loadGlobalRefreshInterval();
  }
  
  loadWebsites(): void {
    this.websiteService.getWebsites().subscribe(websites => {
      this.websites = websites;
    });
  }
  
  loadGlobalRefreshInterval(): void {
    this.websiteService.getGlobalRefreshInterval().subscribe(interval => {
      this.globalRefreshInterval = interval;
    });
  }
  
  addWebsite(): void {
    if (this.newWebsiteForm.valid) {
      const newWebsite = this.newWebsiteForm.value;
      this.websiteService.addWebsite(newWebsite);
      this.newWebsiteForm.reset({
        name: '',
        url: '',
        refreshInterval: 60,
        active: true
      });
      this.snackBar.open('Website added successfully', 'Close', { duration: 3000 });
    }
  }
  
  updateWebsite(website: Website): void {
    this.websiteService.updateWebsite(website);
    this.snackBar.open('Website updated successfully', 'Close', { duration: 3000 });
  }
  
  deleteWebsite(id: number): void {
    this.websiteService.deleteWebsite(id);
    this.snackBar.open('Website removed successfully', 'Close', { duration: 3000 });
  }
  
  updateGlobalRefreshInterval(): void {
    this.websiteService.setGlobalRefreshInterval(this.globalRefreshInterval);
    this.snackBar.open('Global refresh interval updated', 'Close', { duration: 3000 });
  }
  
  toggleWebsiteActive(website: Website): void {
    website.active = !website.active;
    this.updateWebsite(website);
  }

  resetSettingsToDefaults(): void {
    if (confirm('Are you sure you want to reset all settings to their default values? This action cannot be undone.')) {
      this.websiteService.resetToDefaultSettings();
      // Optionally, force a reload or re-initialize component data if needed
      this.loadWebsites(); 
      this.loadGlobalRefreshInterval();
      this.snackBar.open('Settings have been reset to defaults.', 'Close', { duration: 3000 });
    }
  }
}
