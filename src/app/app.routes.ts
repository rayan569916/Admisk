import { Routes } from '@angular/router';
import { About, Contact, DivisionDetail, Divisions, Home, Roadmap, Solutions, Vision, Why } from './components/pages/pages';

export const routes: Routes = [
  { path: '', component: Home, title: 'ADMISK Investment Limited' },
  { path: 'about', component: About, title: 'About – ADMISK' },
  { path: 'divisions', component: Divisions, title: 'Divisions – ADMISK' },
  { path: 'divisions/:slug', component: DivisionDetail, title: 'Division – ADMISK' },
  { path: 'solutions', component: Solutions, title: 'Integrated Solutions – ADMISK' },
  { path: 'vision-2030', component: Vision, title: 'Saudi Vision 2030 – ADMISK' },
  { path: 'why-admisk', component: Why, title: 'Why ADMISK' },
  { path: 'roadmap', component: Roadmap, title: 'Growth Roadmap 2026–2027 – ADMISK' },
  { path: 'contact', component: Contact, title: 'Contact – ADMISK' },
  { path: '**', redirectTo: '' },
];
