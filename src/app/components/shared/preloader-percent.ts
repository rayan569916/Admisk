import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

/**
 * Sleek site preloader
 * --------------------
 * Dark grainy backdrop, a rail of five letter-spaced "LOADING" labels on the
 * top and bottom edges, and a giant percentage counter. The digits are drawn
 * twice, stacked on top of each other:
 *
 *   layer 1  hollow outline (-webkit-text-stroke, transparent fill)
 *   layer 2  solid white, clipped from the top so only the bottom N% shows
 *
 * The clip line rises with progress, so at 41% the bottom 41% of the digits
 * is solid white while the rest stays outlined — exactly like the reference.
 *
 * Behaviour (matches the video preloader):
 *   - Shown once per session (sessionStorage). Returning visitors skip it.
 *   - Only shown when images are NOT already loaded. If assetsReady() is true
 *     from the start, the loader never mounts.
 *   - Minimum 1.5s so the animation reads; maximum 8s so slow loads never trap.
 *
 * Angular 21 (signals, @for control flow, zoneless-friendly).
 * Tailwind CSS 4 utilities + one tiny style block for grain + stroke.
 *
 * Usage:
 *   @if (showLoader()) {
 *     <app-preloader [imagesReady]="assetsReady()" (completed)="showLoader.set(false)" />
 *   }
 */
const SEEN_KEY = 'adhmisk-leadership-intro-seen';

@Component({
  selector: 'app-preloader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="grain fixed inset-0 z-50 flex flex-col select-none overflow-hidden bg-white font-sans text-[#08182e] transition-opacity duration-700 ease-out"
      [class.opacity-0]="fading()"
      [class.pointer-events-none]="fading()"
      role="status"
      aria-label="Loading, {{ percent() }} percent complete"
    >
      <!-- top rail -->
      <div class="flex items-center justify-between px-6 pt-4 md:px-10 md:pt-6">
        @for (slot of slots; track slot) {
          <span class="text-[10px] font-semibold tracking-[0.3em] md:text-xs">LOADING</span>
        }
      </div>

      <!-- giant counter -->
      <div class="grid flex-1 place-items-center px-4">
        <div
          class="relative font-bold tracking-[-0.02em] leading-none text-[clamp(84px,18vw,220px)]"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          [attr.aria-valuenow]="percent()"
        >
          <!-- hollow outline layer -->
          <span
            class="block text-transparent [-webkit-text-stroke:clamp(1.5px,0.18vw,2.5px)_rgba(8,24,46,0.92)]"
          >
            {{ percent() }}%
          </span>
          <!-- solid layer, clipped to the bottom N percent -->
          <span
            class="absolute inset-0 block text-[#08182e] will-change-[clip-path]"
            [style.clip-path]="fillClip()"
            aria-hidden="true"
          >
            {{ percent() }}%
          </span>
        </div>
      </div>

      <!-- bottom rail -->
      <div class="flex items-center justify-between px-6 pb-4 md:px-10 md:pb-6">
        @for (slot of slots; track slot) {
          <span class="text-[10px] font-semibold tracking-[0.3em] md:text-xs">LOADING</span>
        }
      </div>
    </div>
  `,
  styles: `
    /* Subtle film grain, like the reference design */
    .grain::after {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      opacity: 0.08;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    }
  `,
})
export class Preloader {
  /** Total time to go from 0% to 100% (ms). */
  readonly duration = input(4000);
  /** Becomes true when all page image assets have loaded. */
  readonly imagesReady = input(false);
  /** Emits once the counter reaches 100% and the fade-out is done. */
  readonly completed = output<void>();

  protected readonly slots = [0, 1, 2, 3, 4];
  protected readonly progress = signal(0); // 0–100, float
  protected readonly fading = signal(false);

  protected readonly percent = computed(() => Math.round(this.progress()));
  protected readonly fillClip = computed(
    () => `inset(${(100 - this.progress()).toFixed(2)}% 0% 0% 0%)`,
  );

  private readonly destroyRef = inject(DestroyRef);
  private rafId = 0;
  private timers: ReturnType<typeof setTimeout>[] = [];

  constructor() {
    // Wait until the parent has subscribed to `completed` before emitting.
    // Emitting synchronously in the constructor loses the event, leaving the
    // parent-visible loader mounted at its initial 0% for the whole session.
    afterNextRender(() => {
      try {
        if (sessionStorage.getItem(SEEN_KEY) === '1') {
          this.completed.emit();
          return;
        }
      } catch { /* storage blocked: just show it */ }

      this.animate();
    });
    this.destroyRef.onDestroy(() => {
      cancelAnimationFrame(this.rafId);
      this.timers.forEach(clearTimeout);
    });
  }

  private animate(): void {
    const reducedMotion =
      typeof matchMedia === 'function' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reducedMotion ? 600 : this.duration();
    const startedAt = performance.now();

    // Minimum time so the animation reads; maximum so slow loads never trap.
    const MIN = reducedMotion ? 800 : 1500;
    const MAX = 8000;

    const tick = (now: number) => {
      const t = Math.min((now - startedAt) / duration, 1);
      this.progress.set(easeInOutQuart(t) * 100);

      const elapsed = now - startedAt;
      const ready = this.imagesReady();

      if (t < 1 && !(elapsed >= MIN && ready) && elapsed < MAX) {
        this.rafId = requestAnimationFrame(tick);
      } else {
        this.finish();
      }
    };
    this.rafId = requestAnimationFrame(tick);
  }

  private finish(): void {
    this.progress.set(100);
    try { sessionStorage.setItem(SEEN_KEY, '1'); } catch { /* ignore */ }
    this.timers.push(setTimeout(() => this.fading.set(true), 250));
    this.timers.push(setTimeout(() => this.completed.emit(), 250 + 700));
  }
}

/** Smooth 0→1 curve; fast in the middle, gentle at both ends. */
function easeInOutQuart(t: number): number {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}
