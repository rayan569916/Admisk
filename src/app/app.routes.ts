import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/pages/pages').then((m) => m.Home),
    title: 'ADMISK Investment Limited',
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./components/pages/pages').then((m) => m.About),
    title: 'About – ADMISK',
  },
  {
    path: 'leadership',
    loadComponent: () =>
      import('./components/pages/pages').then((m) => m.Leadership),
    title: 'Our Team – ADMISK',
  },
  {
    path: 'divisions',
    loadComponent: () =>
      import('./components/pages/pages').then((m) => m.Divisions),
    title: 'Divisions – ADMISK',
  },
  {
    path: 'divisions/:slug',
    loadComponent: () =>
      import('./components/pages/pages').then((m) => m.DivisionDetail),
    title: 'Division – ADMISK',
  },
  {
    path: 'solutions',
    loadComponent: () =>
      import('./components/pages/pages').then((m) => m.Solutions),
    title: 'Integrated Solutions – ADMISK',
  },
  {
    path: 'vision-2030',
    loadComponent: () =>
      import('./components/pages/pages').then((m) => m.Vision),
    title: 'Saudi Vision 2030 – ADMISK',
  },
  {
    path: 'why-admisk',
    loadComponent: () =>
      import('./components/pages/pages').then((m) => m.Why),
    title: 'Why ADMISK',
  },
  {
    path: 'roadmap',
    loadComponent: () =>
      import('./components/pages/pages').then((m) => m.Roadmap),
    title: 'Growth Roadmap 2026–2027 – ADMISK',
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./components/pages/pages').then((m) => m.Contact),
    title: 'Contact – ADMISK',
  },
  {
    path: '**',
    redirectTo: '',
  },
];