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
          <img src="icon.png" alt="" aria-hidden="true" class="size-12 shrink-0 object-contain">
          ADMISK
        </a>

        <div class="hidden items-center gap-4 text-[14px] font-medium xl:gap-6 xl:text-[15px] lg:flex">
          <div class="group relative">
            <a routerLink="/divisions" routerLinkActive="text-brand" class="py-4">Divisions ⌄</a>
            <div class="invisible absolute left-0 top-full w-72 rounded-lg border border-ash bg-white p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
              @for (d of divisions; track d.slug) {
                <a [routerLink]="['/divisions', d.slug]" class="block rounded px-3 py-2 text-sm hover:bg-mist">{{ d.title }}</a>
              }
            </div>
          </div>
          <a routerLink="/about" routerLinkActive="text-brand">About</a>
          <a routerLink="/leadership" routerLinkActive="text-brand">Leadership</a>
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
<footer class="relative isolate overflow-hidden bg-onyx text-sm text-[#bdbdbd]">

  <!-- Background accents -->
  <div class="pointer-events-none absolute -right-40 -top-40 -z-10 size-[420px] rounded-full bg-brand/15 blur-[120px]"></div>
  <div class="pointer-events-none absolute -bottom-40 -left-40 -z-10 size-[360px] rounded-full bg-[#7a5af8]/10 blur-[110px]"></div>
  <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/70 to-transparent"></div>

  <div class="wrap">

    <!-- CTA -->
    <section class="grid gap-7 border-b border-white/10 py-12 sm:py-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-12 lg:py-16">

      <div class="max-w-3xl">
        <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45 sm:text-xs">
          Start a conversation
        </p>

        <h2 class="h-display mt-4 max-w-2xl text-3xl leading-[1.08] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.5rem]">
          Ready to connect
          <span class="bg-gradient-to-r from-[#6ca7ff] to-[#a58bff] bg-clip-text text-transparent">
            across borders?
          </span>
        </h2>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
        <a
          routerLink="/contact"
          class="inline-flex min-h-11 items-center justify-center gap-3 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
          Get in touch
          <span aria-hidden="true">↗</span>
        </a>

        <a
          [href]="'mailto:' + company.email"
          class="inline-flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white/80 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white">
          <span class="min-w-0 break-all">{{ company.email }}</span>
          <span class="shrink-0 text-white/50" aria-hidden="true">↗</span>
        </a>
      </div>
    </section>

    <!-- Footer content -->
    <div class="grid grid-cols-2 gap-x-6 gap-y-10 py-10 sm:gap-x-10 sm:py-12 lg:grid-cols-[1.35fr_0.85fr_0.8fr_1.35fr] lg:gap-10 lg:py-14">

      <!-- Brand -->
      <div class="col-span-2 lg:col-span-1">
        <a
          routerLink="/"
          aria-label="ADMISK home"
          class="inline-flex items-center gap-3 text-xl font-bold tracking-tight text-white sm:text-2xl">

          <img
            src="icon-bg.png"
            alt=""
            aria-hidden="true"
            width="44"
            height="44"
            loading="lazy"
            class="size-10 shrink-0 rounded-xl object-contain ring-1 ring-white/10 sm:size-11">

          <span>ADMISK</span>
        </a>

        <p class="mt-4 max-w-xs text-[13px] leading-6 text-white/55 sm:text-sm">
          {{ company.tagline }}
        </p>

        <div class="mt-5 flex flex-wrap gap-2">
          @for (r of company.regions; track r) {
            <span class="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-[11px] text-white/65 transition hover:border-white/20 hover:text-white">
              {{ r }}
            </span>
          }
        </div>
      </div>

      <!-- Divisions -->
      <nav aria-label="Divisions">
        <h3 class="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/85 sm:mb-5 sm:text-xs">
          Divisions
        </h3>

        <ul class="space-y-3">
          @for (d of divisions; track d.slug) {
            <li>
              <a
                [routerLink]="['/divisions', d.slug]"
                class="group inline-flex items-start gap-2 text-[12px] leading-5 text-white/55 transition hover:text-white sm:text-[13px]">

                <span class="mt-2 h-px w-0 shrink-0 bg-brand transition-all duration-200 group-hover:w-3"></span>
                <span>{{ d.title }}</span>
              </a>
            </li>
          }
        </ul>
      </nav>

      <!-- Company -->
      <nav aria-label="Company">
        <h3 class="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/85 sm:mb-5 sm:text-xs">
          Company
        </h3>

        <ul class="space-y-3">
          @for (l of company_links; track l.to) {
            <li>
              <a
                [routerLink]="l.to"
                class="group inline-flex items-start gap-2 text-[12px] leading-5 text-white/55 transition hover:text-white sm:text-[13px]">

                <span class="mt-2 h-px w-0 shrink-0 bg-brand transition-all duration-200 group-hover:w-3"></span>
                <span>{{ l.label }}</span>
              </a>
            </li>
          }
        </ul>
      </nav>

      <!-- Offices -->
      <div class="col-span-2 lg:col-span-1">
        <h3 class="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/85 sm:mb-5 sm:text-xs">
          Our offices
        </h3>

        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">

          @for (o of offices; track o.key) {
            <article class="rounded-xl border border-white/[0.08] bg-white/[0.035] p-4 transition duration-200 hover:border-white/15 hover:bg-white/[0.06]">

              <div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <h4 class="font-semibold text-white">{{ o.city }}</h4>
                <span class="text-[10px] text-white/40 sm:text-[11px]">{{ o.name }}</span>
              </div>

              <p class="mt-2 text-xs leading-5 text-white/50">
                {{ o.address }}
              </p>

              <a
                [href]="'tel:' + o.phone.replaceAll(' ', '')"
                class="mt-2 inline-flex items-center gap-2 text-xs font-medium text-[#79adff] transition hover:text-white">

                {{ o.phone }}
                <span aria-hidden="true" class="text-white/30">↗</span>
              </a>
            </article>
          }

        </div>
      </div>

    </div>

    <!-- Bottom bar -->
    <div class="flex flex-col gap-5 border-t border-white/10 py-6 sm:flex-row sm:items-center sm:justify-between">

      <p class="text-xs leading-5 text-white/40">
        © {{ company.legal }} 2026. All rights reserved.
      </p>

      <div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
        <span class="text-xs text-white/40">
          Riyadh <span class="px-1 text-white/20">·</span>
          Nairobi <span class="px-1 text-white/20">·</span>
          Kampala
        </span>

        <button
          type="button"
          (click)="toTop()"
          class="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-white/75 transition hover:border-white/25 hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">

          Back to top
          <span aria-hidden="true">↑</span>
        </button>
      </div>

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
  links = [
    { to: '/divisions', label: 'Divisions' }, { to: '/about', label: 'About' }, { to: '/leadership', label: 'Leadership' }, { to: '/solutions', label: 'Solutions' },
    { to: '/vision-2030', label: 'Vision 2030' }, { to: '/why-admisk', label: 'Why ADMISK' }, { to: '/roadmap', label: 'Roadmap' }, { to: '/contact', label: 'Contact' },
  ];
  company_links = this.links.filter((l) => l.to !== '/divisions' && l.to !== '/contact');
  toTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

  @HostListener('window:scroll')
  onScroll() { this.scrolled.set(window.scrollY > 8); }
}
