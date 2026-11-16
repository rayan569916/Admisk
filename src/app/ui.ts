import { Component, input, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ICONS } from './content';

@Component({
  selector: 'app-media-skeleton',
  template: `
    <div class="relative overflow-hidden" [class]="containerClass()">
      @if (!loaded() && !hasError()) {
        <div class="absolute inset-0 skeleton-shimmer z-10 pointer-events-none rounded-[inherit]">
          <div class="w-full h-full bg-[#ece8de]/80 animate-pulse"></div>
        </div>
      }
      <ng-content />
    </div>
  `,
})
export class MediaSkeleton {
  containerClass = input<string>('w-full h-full');
  loaded = signal(false);
  hasError = signal(false);

  markLoaded() {
    this.loaded.set(true);
  }
  markError() {
    this.hasError.set(true);
  }
}

@Component({
  selector: 'app-img',
  host: {
    'style': 'display: contents;'
  },
  template: `
    <div [class]="containerClass()">
      @if (!loaded() && !hasError()) {
        <div class="absolute inset-0 z-10 pointer-events-none rounded-[inherit]"
             [class]="dark() ? 'bg-white/10 animate-pulse' : 'skeleton-shimmer'">
          <div class="w-full h-full" [class]="dark() ? 'bg-white/5' : 'bg-[#ece8de]/80 animate-pulse'"></div>
        </div>
      }
      <img
        [src]="src()"
        [alt]="alt()"
        [loading]="priority() ? 'eager' : 'lazy'"
        [attr.fetchpriority]="priority() ? 'high' : 'auto'"
        [class]="'absolute inset-0 ' + imgClass() + ' transition-opacity duration-500 ease-out ' + (loaded() ? 'opacity-100' : 'opacity-0')"
        (load)="loaded.set(true)"
        (error)="hasError.set(true)"
      />
    </div>
  `,
})
export class ImgSkeleton {
  src = input.required<string>();
  alt = input('');
  containerClass = input('relative w-full h-full overflow-hidden');
  imgClass = input('w-full h-full object-cover');
  priority = input(false);
  dark = input(false);
  loaded = signal(false);
  hasError = signal(false);
}


@Component({
  selector: 'app-icon',
  template: `<svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path [attr.d]="path()" /></svg>`,
})
export class Icon {
  name = input.required<string>();
  size = input(28);
  path() { return ICONS[this.name()] ?? ''; }
}


@Component({
  selector: 'app-page-head',
  template: `
    <header class="bg-gradient-to-b from-white to-[#e4eeff] pb-16 pt-16 md:pt-20">
      <div class="wrap">
        <p class="mb-5 text-sm text-slate">{{ crumb() }}</p>
        <h1 class="h-display max-w-4xl text-4xl md:text-6xl">
          @for (p of parts(); track $index) {
            <span [class]="p.hl ? 'bg-gradient-to-r from-brand to-[#7a5af8] bg-clip-text text-transparent' : ''">{{ p.text }}</span>
          }
        </h1>
        @if (lead()) { <p class="lead mt-6 max-w-2xl">{{ lead() }}</p> }
        <ng-content />
      </div>
    </header>`,
})
export class PageHead {
  crumb = input('');
  title = input.required<string>();
  lead = input('');
  /** Words or word-starts in the title to show in the blue→purple gradient */
  accent = input<string[]>([]);

  parts = computed(() => {
    const t = this.title();
    const acc = this.accent();
    if (!acc.length) return [{ text: t, hl: false }];
    const esc = acc.map((a) => a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    return t.split(new RegExp('(' + esc.join('|') + ')')).filter(Boolean).map((text) => ({ text, hl: acc.includes(text) }));
  });
}

@Component({
  selector: 'app-cta',
  imports: [RouterLink],
  template: `
    <section class="mt-24 bg-mist py-20 text-center">
      <div class="wrap">
        <h2 class="h-display text-3xl md:text-5xl">{{ title() }}</h2>
        <p class="lead mx-auto mt-4 max-w-xl">{{ text() }}</p>
        <div class="mt-8 flex flex-wrap justify-center gap-3">
          <a class="btn" routerLink="/contact">Get in touch</a>
          <a class="btn-ghost" routerLink="/divisions">View divisions</a>
        </div>
      </div>
    </section>`,
})
export class Cta {
  title = input('Ready to enter a new market?');
  text = input('Tell us about your business and we will route you to the right division.');
}
