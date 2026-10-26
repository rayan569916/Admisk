import { Component, input, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ICONS } from './content';

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
