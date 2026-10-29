import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/pages/pages').then((m) => m.Home),
    title: 'Admisk inc Investment Limited',
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./components/pages/pages').then((m) => m.About),
    title: 'About – Admisk inc',
  },
  {
    path: 'leadership',
    loadComponent: () =>
      import('./components/pages/pages').then((m) => m.Leadership),
    title: 'Our Team – Admisk inc',
  },
  {
    path: 'divisions',
    loadComponent: () =>
      import('./components/pages/pages').then((m) => m.Divisions),
    title: 'Divisions – Admisk inc',
  },
  {
    path: 'divisions/:slug',
    loadComponent: () =>
      import('./components/pages/pages').then((m) => m.DivisionDetail),
    title: 'Division – Admisk inc',
  },
  {
    path: 'solutions',
    loadComponent: () =>
      import('./components/pages/pages').then((m) => m.Solutions),
    title: 'Integrated Solutions – Admisk inc',
  },
  {
    path: 'vision-2030',
    loadComponent: () =>
      import('./components/pages/pages').then((m) => m.Vision),
    title: 'Saudi Vision 2030 – Admisk inc',
  },
  {
    path: 'why-Admisk inc',
    loadComponent: () =>
      import('./components/pages/pages').then((m) => m.Why),
    title: 'Why Admisk inc',
  },
  {
    path: 'roadmap',
    loadComponent: () =>
      import('./components/pages/pages').then((m) => m.Roadmap),
    title: 'Growth Roadmap 2026–2027 – Admisk inc',
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./components/pages/pages').then((m) => m.Contact),
    title: 'Contact – Admisk inc',
  },
  {
    path: '**',
    redirectTo: '',
  },
];