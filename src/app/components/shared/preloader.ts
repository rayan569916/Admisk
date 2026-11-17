import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { PreloaderService } from './preloader.service';

const SEEN_KEY = 'adhmisk-intro-seen';

/**
 * Loading screen, built from the reference frame by frame:
 *
 *  0.00s  solid dark screen, a thick rounded cursor blinks alone at the text start
 *  0.07s  "we do" is typed letter by letter (each letter fades in), cursor follows
 *  0.75s  cursor disappears
 *  1.10s  "we do" slides left to make room (the roller column opens next to it)
 *  1.50s  footer line fades in at the bottom
 *  2.00s  a 3-line vertical roller of services starts: centre line bright, others faded by a mask
 *  ready  the whole screen slides up like a curtain and reveals the hero
 *
 * It stays until the hero video is playing (min time so the animation can play,
 * max time so a slow connection never traps the visitor). Shown once per session.
 */
@Component({
  selector: 'app-preloader',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .pre { transition: transform 0.85s cubic-bezier(0.76, 0, 0.24, 1); will-change: transform; }
    .pre-leave { transform: translateY(-100%); }

    .cursor {
      position: absolute; left: 100%; top: 6%; height: 88%; width: 0.12em;
      margin-left: 0.06em; border-radius: 9999px; background: #d8b77e;
    }
    .cursor-start { left: 0; margin-left: -0.2em; }
    .cursor-blink { animation: blink 0.5s steps(1) infinite; }
    @keyframes blink { 50% { opacity: 0; } }

    .roller {
      -webkit-mask-image: linear-gradient(to bottom, transparent 0%, #000 30%, #000 70%, transparent 100%);
              mask-image: linear-gradient(to bottom, transparent 0%, #000 30%, #000 70%, transparent 100%);
    }
  `],
  template: `
    @if (!done()) {
      <div
        class="pre fixed inset-0 z-[100] flex items-center justify-center bg-[#08182e] text-white"
        [class.pre-leave]="leaving()"
        role="status"
        aria-live="polite">
        <span class="sr-only">Loading ADHMISK</span>

        <!-- Centre group: "we do" + roller -->
        <div
          class="flex items-center font-semibold tracking-tight transition duration-500"
          [class]="leaving() ? '-translate-y-3 opacity-0' : ''"
          aria-hidden="true">

          <!-- Lead text, typed letter by letter -->
          <span class="relative whitespace-nowrap text-[26px] leading-none sm:text-4xl md:text-5xl">
            @for (ch of chars; track $index; let i = $index) {
              <span
                class="relative inline-block transition-opacity duration-150"
                [class]="shown() > i ? 'opacity-100' : 'opacity-0'">
                {{ ch }}
                @if (cursor() && shown() === i + 1) {
                  <i class="cursor" [class.cursor-blink]="shown() === chars.length"></i>
                }
                @if (cursor() && shown() === 0 && i === 0) {
                  <i class="cursor cursor-start"></i>
                }
              </span>
            }
          </span>

          <!-- Roller column: opens (0fr to 1fr), which slides the lead text to the left -->
          <div
            class="grid transition-[grid-template-columns] duration-300 ease-out"
            [style.grid-template-columns]="open() ? '1fr' : '0fr'">
            <div class="min-w-0 overflow-hidden">
              <div class="pl-3 sm:pl-4">
                <div
                  class="roller relative h-[5.7em] overflow-hidden text-[15px] font-medium transition-opacity duration-500 sm:text-xl md:text-2xl"
                  [class]="rollerOn() ? 'opacity-100' : 'opacity-0'">
                  <ul
                    class="will-change-transform"
                    [style.transform]="'translateY(' + (1 - step()) * 1.9 + 'em)'"
                    [style.transition]="instant() ? 'none' : 'transform 450ms cubic-bezier(0.65, 0, 0.35, 1)'">
                    @for (w of list; track $index; let i = $index) {
                      <li
                        class="h-[1.9em] whitespace-nowrap leading-[1.9em] transition-colors duration-300"
                        [class]="i === step() ? 'text-white' : 'text-white/40'">
                        {{ w }}
                      </li>
                    }
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer line -->
        <p
          class="absolute inset-x-0 bottom-[8%] flex items-center justify-center gap-2 px-5 text-[11px] tracking-wide transition-opacity duration-500 sm:text-xs"
          [class]="footer() ? 'opacity-100' : 'opacity-0'"
          aria-hidden="true">
          <span class="font-semibold text-white">ADHMISK</span>
          <span class="text-white/30">|</span>
          <span class="text-white/45 transition-opacity delay-150 duration-500">Cross-border business holding group</span>
        </p>
      </div>
    }
  `,
})
export class Preloader {
  private readonly destroyRef = inject(DestroyRef);
  private readonly pre = inject(PreloaderService);

  /** Lead text and rolling words. Edit freely. */
  protected readonly chars = ['w', 'e', '\u00A0', 'd', 'o'];
  protected readonly words = ['Business consultancy', 'Legal support', 'Manpower', 'Skills training', 'Import & export'];
  /** Words plus a 2-word copy of the start, so the loop can reset invisibly */
  protected readonly list = [...this.words, this.words[0], this.words[1]];

  protected readonly shown = signal(0);        // letters typed so far
  protected readonly cursor = signal(false);
  protected readonly open = signal(false);     // roller column opened (lead text slid left)
  protected readonly footer = signal(false);
  protected readonly rollerOn = signal(false);
  protected readonly step = signal(0);
  protected readonly instant = signal(false);  // no transition while resetting the roller loop
  protected readonly leaving = signal(false);
  protected readonly done = signal(false);

  private dead = false;
  private timer?: ReturnType<typeof setInterval>;
  private prevOverflow = '';

  constructor() {
    afterNextRender(() => void this.run());
    this.destroyRef.onDestroy(() => {
      this.dead = true;
      clearInterval(this.timer);
      this.unlock();
    });
  }

  private readonly wait = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

  private async run(): Promise<void> {
    // Once per session: returning visitors go straight to the site
    try {
      if (sessionStorage.getItem(SEEN_KEY) === '1') {
        this.done.set(true);
        return;
      }
    } catch { /* storage blocked: just show it */ }

    this.lock();
    const started = performance.now();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Let the site font load first so the letters don't swap mid-typing (capped at 1.2s)
    await Promise.race([document.fonts?.ready ?? Promise.resolve(), this.wait(1200)]);
    if (this.dead) return;

    if (reduce) {
      // No motion: show the finished state straight away
      this.shown.set(this.chars.length);
      this.open.set(true);
      this.footer.set(true);
      this.rollerOn.set(true);
    } else {
      await this.intro();
      if (this.dead) return;
      this.startRoller();
    }

    // Stay until the hero is ready, but never less than MIN (so the animation reads) or more than MAX
    const MIN = reduce ? 600 : 3400;
    const MAX = 9000;
    await new Promise<void>(resolve => {
      const check = () => {
        const elapsed = performance.now() - started;
        if (this.dead || (this.pre.heroReady() && elapsed >= MIN) || elapsed >= MAX) resolve();
        else setTimeout(check, 100);
      };
      check();
    });
    if (this.dead) return;

    await this.leave();
  }

  /** The typing / slide / footer sequence, timed from the reference frames */
  private async intro(): Promise<void> {
    const w = this.wait;
    this.cursor.set(true);
    await w(400);                                   // cursor alone on a dark screen

    const gaps = [130, 170, 150, 130, 130];         // a touch slower after "we" and the space
    for (let i = 1; i <= this.chars.length; i++) {
      this.shown.set(i);
      await w(gaps[i - 1]);
      if (this.dead) return;
    }
    await w(250);
    this.cursor.set(false);                         // cursor disappears
    await w(400);
    this.open.set(true);                            // "we do" slides left
    await w(450);
    this.footer.set(true);                          // footer fades in
    await w(450);
    this.rollerOn.set(true);                        // word roller appears
  }

  private startRoller(): void {
    const n = this.words.length;
    this.timer = setInterval(() => {
      const next = this.step() + 1;
      this.step.set(next);
      if (next === n) {
        // We are showing the copy of word 0: jump back to the real word 0 without animating
        setTimeout(() => {
          this.instant.set(true);
          this.step.set(0);
          requestAnimationFrame(() => requestAnimationFrame(() => this.instant.set(false)));
        }, 480);
      }
    }, 950);
  }

  private async leave(): Promise<void> {
    clearInterval(this.timer);
    this.leaving.set(true);                         // fade the text, then slide the curtain up
    try { sessionStorage.setItem(SEEN_KEY, '1'); } catch { /* ignore */ }
    await this.wait(900);
    this.done.set(true);
    this.unlock();
    window.dispatchEvent(new Event('resize'));      // lets ScrollTrigger re-measure after the scroll lock is lifted
  }

  private lock(): void {
    const el = document.documentElement;
    this.prevOverflow = el.style.overflow;
    el.style.overflow = 'hidden';
    window.scrollTo(0, 0);
  }

  private unlock(): void {
    document.documentElement.style.overflow = this.prevOverflow;
  }
}
