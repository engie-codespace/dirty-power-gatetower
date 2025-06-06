import { Routes } from '@angular/router';
import { GridDisplay } from './components/grid-display/grid-display';
import { Settings } from './components/settings/settings';

export const routes: Routes = [
  { path: '', component: GridDisplay, pathMatch: 'full' },
  { path: 'settings', component: Settings },
  { path: '**', redirectTo: '' } // Redirect any unknown routes to home
];
