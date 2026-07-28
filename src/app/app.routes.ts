import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Appointments } from './appointments/appointments';
import { GreenPass } from './green-pass/green-pass';
import { Profile } from './profile/profile';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'appointments', component: Appointments },
  { path: 'green-pass', component: GreenPass },
  { path: 'profile', component: Profile },
  { path: '**', redirectTo: 'home' },
];

