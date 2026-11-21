import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { COMPANY, DIVISIONS, OFFICES } from './content';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
<!-- ANNOUNCEMENT BAR -->
<div class="hidden md:block bg-brand px-3 py-2 text-center text-[11px] font-medium leading-5 text-white sm:px-4 sm:text-[13px]">
  <span>Four services. Seven offices. One point of contact.</span>
  <a
    routerLink="/divisions"
    class="ml-1 inline-block whitespace-nowrap font-semibold underline underline-offset-4 transition hover:text-white/75"
  >
    Explore the group →
  </a>
</div>

<!-- MAIN NAVBAR -->
<nav
  class="sticky top-0 z-40 border-b bg-white transition-all duration-300"
  [class.border-ash]="scrolled()"
  [class.border-transparent]="!scrolled()"
  [class.shadow-sm]="scrolled()"
>
  <div class="wrap flex h-14 items-center justify-between gap-3 sm:h-16">

    <!-- LOGO -->
    <a
      routerLink="/"
      class="flex min-w-0 shrink-0 items-center gap-2 sm:gap-2.5"
      aria-label="ADMISK home"
      (click)="open.set(false)"
    >
      <img
        src="icon.png"
        alt=""
        aria-hidden="true"
        class="size-9 shrink-0 rounded-xl object-contain sm:size-11"
      >

      <span class="text-lg font-bold tracking-tight text-ink sm:text-xl">
        Adhmisk
      </span>
    </a>

    <!-- DESKTOP NAVIGATION -->
    <div class="hidden items-center gap-4 text-[13px] font-medium lg:flex xl:gap-5 xl:text-sm">

      <!-- DIVISIONS DROPDOWN -->
      <div class="group relative">
        <a
          routerLink="/divisions"
          routerLinkActive="text-brand"
          class="inline-flex items-center gap-1 py-5 transition-colors hover:text-brand"
        >
          Services
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            class="size-3.5 transition-transform duration-200 group-hover:rotate-180"
          >
            <path d="m6 9 6 6 6-6"></path>
          </svg>
        </a>

        <div
          class="invisible absolute left-0 top-full w-72 translate-y-2 rounded-xl border border-ash bg-white p-2 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
        >
          @for (d of divisions; track d.slug) {
            <a
              [routerLink]="['/divisions', d.slug]"
              routerLinkActive="bg-mist text-brand"
              class="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition hover:bg-mist hover:text-brand"
            >
              <span>{{ d.title }}</span>
              <span aria-hidden="true" class="text-slate/50">→</span>
            </a>
          }
        </div>
      </div>

      <a routerLink="/about" routerLinkActive="text-brand" class="whitespace-nowrap transition-colors hover:text-brand">About</a>
      <a routerLink="/leadership" routerLinkActive="text-brand" class="whitespace-nowrap transition-colors hover:text-brand">Leadership</a>
      <a routerLink="/solutions" routerLinkActive="text-brand" class="whitespace-nowrap transition-colors hover:text-brand">Solutions</a>
      <a routerLink="/vision-2030" routerLinkActive="text-brand" class="whitespace-nowrap transition-colors hover:text-brand">Vision 2030</a>
      <a routerLink="/why-admisk" routerLinkActive="text-brand" class="whitespace-nowrap transition-colors hover:text-brand">Why ADHMISK</a>
      <a routerLink="/roadmap" routerLinkActive="text-brand" class="whitespace-nowrap transition-colors hover:text-brand">Roadmap</a>
    </div>

    <!-- ACTIONS -->
    <div class="ml-auto flex shrink-0 items-center gap-2 sm:gap-4 lg:ml-4">

      <!-- Desktop contact link -->
      <a
        routerLink="/contact"
        class="hidden whitespace-nowrap text-sm font-medium transition-colors hover:text-brand xl:inline-flex"
      >
        Contact
      </a>

      <!-- CTA -->
      <a
        routerLink="/contact"
        class="inline-flex min-h-9 items-center justify-center rounded-md bg-brand px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90 sm:min-h-10 sm:px-4 sm:text-sm"
        (click)="open.set(false)"
      >
        <span class="sm:hidden">Contact us</span>
        <span class="hidden sm:inline">Get in touch</span>
      </a>

      <!-- MOBILE MENU BUTTON -->
      <button
        type="button"
        class="flex size-9 shrink-0 items-center justify-center rounded-lg border border-ash text-ink transition hover:bg-mist lg:hidden sm:size-10"
        (click)="open.set(!open())"
        [attr.aria-expanded]="open()"
        aria-controls="mobile-navigation"
        [attr.aria-label]="open() ? 'Close navigation menu' : 'Open navigation menu'"
      >
        @if (open()) {
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            class="size-5"
          >
            <path d="m18 6-12 12M6 6l12 12"></path>
          </svg>
        } @else {
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            class="size-5"
          >
            <path d="M4 7h16M4 12h16M4 17h16"></path>
          </svg>
        }
      </button>
    </div>
  </div>

  <!-- MOBILE NAVIGATION -->
  @if (open()) {
    <div
      id="mobile-navigation"
      class="border-t border-ash bg-white lg:hidden"
    >
      <div class="wrap max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain py-4">

        <!-- Mobile menu heading -->
        <div class="mb-3 flex items-center justify-between px-1">
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate">
            Explore ADHMISK
          </p>
          <span class="text-xs text-slate/60">Navigation</span>
        </div>

        <!-- Mobile links -->
        <div class="grid gap-1">

          <a
            routerLink="/"
            routerLinkActive="bg-mist text-brand"
            [routerLinkActiveOptions]="{ exact: true }"
            (click)="open.set(false)"
            class="flex min-h-11 items-center justify-between rounded-lg px-3 text-sm font-medium transition hover:bg-mist hover:text-brand"
          >
            Home
            <span aria-hidden="true" class="text-slate/50">→</span>
          </a>

          <!-- Divisions -->
          <div class="rounded-lg border border-ash/70">
            <div class="flex items-center gap-2 px-3">
              <a
                routerLink="/divisions"
                routerLinkActive="text-brand"
                (click)="open.set(false)"
                class="flex min-h-11 flex-1 items-center text-sm font-medium"
              >
                Services
              </a>

              <button
                type="button"
                class="flex size-9 items-center justify-center rounded-md text-slate transition hover:bg-mist"
                (click)="divisionsOpen.set(!divisionsOpen())"
                [attr.aria-expanded]="divisionsOpen()"
                aria-label="Toggle divisions submenu"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  class="size-4 transition-transform duration-200"
                  [class.rotate-180]="divisionsOpen()"
                >
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
              </button>
            </div>

            @if (divisionsOpen()) {
              <div class="border-t border-ash/70 bg-mist/50 p-2">
                @for (d of divisions; track d.slug) {
                  <a
                    [routerLink]="['/divisions', d.slug]"
                    (click)="open.set(false); divisionsOpen.set(false)"
                    class="flex min-h-10 items-center justify-between rounded-md px-3 text-sm text-slate transition hover:bg-white hover:text-brand"
                  >
                    {{ d.title }}
                    <span aria-hidden="true">→</span>
                  </a>
                }
              </div>
            }
          </div>

          @for (l of links; track l.to) {
            <a
              [routerLink]="l.to"
              routerLinkActive="bg-mist text-brand"
              (click)="open.set(false); divisionsOpen.set(false)"
              class="flex min-h-11 items-center justify-between rounded-lg px-3 text-sm font-medium transition hover:bg-mist hover:text-brand"
            >
              {{ l.label }}
              <span aria-hidden="true" class="text-slate/50">→</span>
            </a>
          }
        </div>

        <!-- Mobile contact footer -->
        <div class="mt-4 rounded-xl bg-[#093a56] p-4 text-white">
          <p class="text-sm font-semibold">Have a project in mind?</p>
          <p class="mt-1 text-xs leading-5 text-white/65">
            Connect with our team to discuss your requirements.
          </p>

          <a
            routerLink="/contact"
            (click)="open.set(false)"
            class="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#093a56] transition hover:bg-white/90"
          >
            Get in touch
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  }
</nav>

    <main><router-outlet /></main>
<footer class="relative isolate bg-onyx text-sm text-[#bdbdbd]">

  <!-- Top accent line -->
  <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/70 to-transparent"></div>

  <div class="wrap">

    <!-- Main row: brand | services | company | offices -->
    <div class="grid grid-cols-2 gap-x-6 gap-y-7 py-8 sm:py-10 lg:grid-cols-[1.5fr_1fr_0.8fr_1.1fr] lg:gap-x-10">

      <!-- Brand + contact -->
      <div class="col-span-2 lg:col-span-1">
        <a
          routerLink="/"
          aria-label="ADHMISK home"
          class="inline-flex items-center gap-3 text-xl font-bold tracking-tight text-white">
          <img
            src="icon.png"
            alt=""
            aria-hidden="true"
            width="40"
            height="40"
            loading="lazy"
            class="size-9 shrink-0 rounded-lg object-contain ring-1 ring-white/10 sm:size-10">
          <span>Adhmisk</span>
        </a>

        <p class="mt-3 max-w-xs text-[13px] leading-6 text-white/55">
          {{ company.tagline }}
        </p>

        <a
          [href]="'mailto:' + company.email"
          class="mt-3 inline-flex min-h-8 items-center gap-1.5 break-all text-[13px] font-medium text-white/80 transition hover:text-white">
          {{ company.email }}
          <span class="text-white/40" aria-hidden="true">↗</span>
        </a>
      </div>

      <!-- Services -->
      <nav aria-label="Services">
        <h3 class="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/85">
          Services
        </h3>
        <ul class="space-y-2">
          @for (d of divisions; track d.slug) {
            <li>
              <a
                [routerLink]="['/divisions', d.slug]"
                class="text-[12px] leading-5 text-white/55 transition hover:text-white sm:text-[13px]">
                {{ d.title }}
              </a>
            </li>
          }
        </ul>
      </nav>

      <!-- Company -->
      <nav aria-label="Company">
        <h3 class="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/85">
          Company
        </h3>
        <ul class="space-y-2">
          @for (l of company_links; track l.to) {
            <li>
              <a
                [routerLink]="l.to"
                class="text-[12px] leading-5 text-white/55 transition hover:text-white sm:text-[13px]">
                {{ l.label }}
              </a>
            </li>
          }
        </ul>
      </nav>

      <!-- Offices: city names only (full addresses and phones live on the Contact page) -->
      <div class="col-span-2 lg:col-span-1">
        <h3 class="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/85">
          Our offices
        </h3>
        <ul class="flex flex-wrap gap-x-3 gap-y-1.5 lg:grid lg:grid-cols-2 lg:gap-x-4">
          @for (o of offices; track o.key) {
            <li>
              <a
                routerLink="/contact"
                class="text-[12px] leading-5 text-white/55 transition hover:text-white sm:text-[13px]">
                {{ o.city }}
              </a>
            </li>
          }
        </ul>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="flex items-center justify-between gap-4 border-t border-white/10 py-4">
      <p class="text-xs leading-5 text-white/40">
        © {{ company.legal }} 2026. All rights reserved.
      </p>

      <button
        type="button"
        (click)="toTop()"
        aria-label="Back to top"
        class="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/75 transition hover:border-white/25 hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
        <span aria-hidden="true">↑</span>
      </button>
    </div>

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
  divisionsOpen = signal(false);
  showAllOffices = signal(false);
  officePreviewCount = 4; 
  links = [
    { to: '/divisions', label: 'Divisions' }, { to: '/about', label: 'About' }, { to: '/leadership', label: 'Leadership' }, { to: '/solutions', label: 'Solutions' },
    { to: '/vision-2030', label: 'Vision 2030' }, { to: '/why-admisk', label: 'Why ADMISK' }, { to: '/roadmap', label: 'Roadmap' }, { to: '/contact', label: 'Contact' },
  ];
  company_links = this.links.filter((l) => l.to !== '/divisions' && l.to !== '/contact');
  toTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

  @HostListener('window:scroll')
  onScroll() { this.scrolled.set(window.scrollY > 8); }
}
