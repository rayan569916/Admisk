import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { COMPANY, DIVISIONS, OFFICES } from './content';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="bg-brand px-4 py-2 text-center text-[13px] font-medium text-white">
      Six divisions. Three offices. One point of contact.
      <a routerLink="/divisions" class="underline">Explore the group →</a>
    </div>

    <nav class="sticky top-0 z-40 h-14 border-b bg-white transition-colors" [class.border-ash]="scrolled()" [class.border-transparent]="!scrolled()">
      <div class="wrap flex h-full items-center">
        <a routerLink="/" class="mr-8 flex items-center gap-2 text-xl font-bold tracking-tight">
          <span class="relative block size-6 rounded-md bg-brand"><span class="absolute inset-[6px] rounded-full border-[2.5px] border-white border-r-transparent"></span></span>
          ADMISK
        </a>

        <div class="hidden items-center gap-6 text-[15px] font-medium lg:flex">
          <div class="group relative">
            <a routerLink="/divisions" routerLinkActive="text-brand" class="py-4">Divisions ⌄</a>
            <div class="invisible absolute left-0 top-full w-72 rounded-lg border border-ash bg-white p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
              @for (d of divisions; track d.slug) {
                <a [routerLink]="['/divisions', d.slug]" class="block rounded px-3 py-2 text-sm hover:bg-mist">{{ d.title }}</a>
              }
            </div>
          </div>
          <a routerLink="/about" routerLinkActive="text-brand">About</a>
          <a routerLink="/solutions" routerLinkActive="text-brand">Solutions</a>
          <a routerLink="/vision-2030" routerLinkActive="text-brand">Vision 2030</a>
          <a routerLink="/why-admisk" routerLinkActive="text-brand">Why ADMISK</a>
          <a routerLink="/roadmap" routerLinkActive="text-brand">Roadmap</a>
        </div>

        <div class="ml-auto flex items-center gap-5 text-[15px] font-medium">
          <a routerLink="/contact" class="hidden sm:inline">Contact</a>
          <a routerLink="/contact" class="btn">Get in touch</a>
          <button class="lg:hidden" (click)="open.set(!open())" aria-label="Menu">
            <span class="block h-0.5 w-5 bg-ink shadow-[0_6px_0_#080808,0_-6px_0_#080808]"></span>
          </button>
        </div>
      </div>
    </nav>

    @if (open()) {
      <div class="border-b border-ash bg-white lg:hidden">
        <div class="wrap grid gap-1 py-4 text-[15px] font-medium">
          @for (l of links; track l.to) { <a [routerLink]="l.to" (click)="open.set(false)" class="py-2">{{ l.label }}</a> }
        </div>
      </div>
    }

    <main><router-outlet /></main>

    <footer class="mt-0 bg-onyx py-16 text-sm text-[#bdbdbd]">
      <div class="wrap grid gap-10 md:grid-cols-[1.6fr_1fr_1fr_1.4fr]">
        <div>
          <a routerLink="/" class="mb-3 flex items-center gap-2 text-xl font-bold text-white"><span class="block size-6 rounded-md bg-white"></span>ADMISK</a>
          <p class="max-w-xs">{{ company.tagline }}</p>
        </div>
        <div>
          <h4 class="mb-3 font-semibold text-white">Divisions</h4>
          <ul class="space-y-2">@for (d of divisions; track d.slug) { <li><a [routerLink]="['/divisions', d.slug]" class="hover:text-white">{{ d.title }}</a></li> }</ul>
        </div>
        <div>
          <h4 class="mb-3 font-semibold text-white">Company</h4>
          <ul class="space-y-2">
            @for (l of company_links; track l.to) { <li><a [routerLink]="l.to" class="hover:text-white">{{ l.label }}</a></li> }
          </ul>
        </div>
        <div>
          <h4 class="mb-3 font-semibold text-white">Offices</h4>
          <ul class="space-y-2">
            @for (o of offices; track o.key) { <li>{{ o.city }} · {{ o.phone }}</li> }
            <li><a [href]="'mailto:' + company.email" class="hover:text-white">{{ company.email }}</a></li>
          </ul>
        </div>
        <p class="border-t border-[#333] pt-5 text-[13px] text-[#8a8a8a] md:col-span-4">© {{ company.legal }} 2026 · Riyadh · Nairobi · Kampala</p>
      </div>
    </footer>
  `,
})
export class App {
  company = COMPANY;
  divisions = DIVISIONS;
  offices = OFFICES;
  scrolled = signal(false);
  open = signal(false);
  links = [
    { to: '/divisions', label: 'Divisions' }, { to: '/about', label: 'About' }, { to: '/solutions', label: 'Solutions' },
    { to: '/vision-2030', label: 'Vision 2030' }, { to: '/why-admisk', label: 'Why ADMISK' }, { to: '/roadmap', label: 'Roadmap' }, { to: '/contact', label: 'Contact' },
  ];
  company_links = this.links.filter((l) => l.to !== '/divisions' && l.to !== '/contact');

  @HostListener('window:scroll')
  onScroll() { this.scrolled.set(window.scrollY > 8); }
}
