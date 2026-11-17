import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { DIVISIONS } from '../../content';
import { ImgSkeleton } from '../../ui';

/**
 * Pinned hero: the full-screen video shrinks into a thin header strip while the
 * ADHMISK wordmark scales down to the top, revealing the statement (left) and a
 * compact grid of every division (right). The statement then lights up phrase by phrase.
 *
 * Requires:  npm i gsap
 * Without JS / with prefers-reduced-motion it falls back to a normal static
 * layout (full-height video, then the statement + divisions below, fully visible).
 */
@Component({
  selector: 'app-hero-scroll',
  imports: [RouterLink, ImgSkeleton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="relative bg-[#08182e] text-white" aria-label="ADHMISK introduction">

      <!-- Pinned stage -->
      <div
        data-stage
        class="relative"
        [class]="animated() ? 'h-[100svh] overflow-hidden' : ''">

        <!-- Statement + divisions: sits underneath the video and is uncovered as the video shrinks -->
        <div
          data-statement
          class="z-0 px-5 md:px-[60px]"
          [class]="animated() ? 'absolute inset-0 flex items-center pt-16 md:pt-20' : 'relative py-24 md:py-32'">

          <div class="grid w-full items-center gap-8 md:grid-cols-[1.05fr_0.95fr] md:gap-12 lg:gap-16">

            <!-- LEFT: statement -->
            <p class="max-w-xl text-[26px] font-medium leading-[1.05] tracking-[-0.02em] sm:text-[34px] md:text-[40px] md:tracking-[-0.03em] lg:text-[48px] xl:text-[53px]">
              @for (c of statement; track c) {
                <span data-chunk [class.opacity-25]="animated()">{{ c }}</span>{{ ' ' }}
              }
            </p>

            <!-- RIGHT: all divisions at a glance -->
            <div class="w-full md:ml-auto md:max-w-[520px]">
              <p class="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d8b77e] sm:text-[11px]">
                Our Services
              </p>

              <div class="grid grid-cols-1 gap-2.5 sm:gap-3">
                @for (d of cards; track d.slug; let i = $index; let last = $last) {
                  <a
                    [routerLink]="['/divisions', d.slug]"
                    [attr.aria-label]="'Explore ' + d.title"
                    [class]="cards.length % 2 === 1 && last ? 'col-span-1' : ''"
                    class="group relative isolate flex min-h-[64px] items-center justify-between gap-3 overflow-hidden rounded-2xl border border-white/10 bg-[#102236] p-3.5 transition duration-300 hover:-translate-y-0.5 hover:border-[#a78043]/70 sm:min-h-[84px] sm:p-5">

                    <!-- Background image -->
                    <app-img
                      [src]="d.path"
                      [alt]="''"
                      [dark]="true"
                      containerClass="absolute inset-0 -z-20 size-full overflow-hidden"
                      imgClass="size-full object-cover transition duration-500 group-hover:scale-105" />

                    <!-- Dark overlay -->
                    <div class="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-[#061321]/95 via-[#07182a]/80 to-[#07182a]/45 transition duration-300 group-hover:from-[#061321]/85 group-hover:via-[#07182a]/65"></div>

                    <!-- Gold accent -->
                    <div class="pointer-events-none absolute inset-y-0 left-0 w-[3px] bg-[#a78043] opacity-70 transition-all duration-300 group-hover:w-1 group-hover:opacity-100"></div>

                    <!-- Number + title -->
                    <div class="flex min-w-0 items-center gap-3">
                      <span class="flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-[10px] font-semibold tracking-wider text-white/80 backdrop-blur-sm transition duration-300 group-hover:bg-white/20 group-hover:text-white">
                        {{ (i + 1).toString().padStart(2, '0') }}
                      </span>
                      <h3 class="min-w-0 text-[13px] font-semibold leading-snug tracking-tight text-white transition-colors duration-300 group-hover:text-[#f0dcb4] sm:text-base">
                        {{ d.title }}
                      </h3>
                    </div>

                    <!-- Arrow -->
                    <span class="flex size-7 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm text-white transition duration-300 group-hover:rotate-45 group-hover:border-[#a78043] group-hover:bg-[#a78043]" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                }
              </div>
            </div>
          </div>
        </div>

        <!-- Video frame (its height is what shrinks) -->
        <div
          data-frame
          class="z-10 overflow-hidden bg-[#08182e]"
          [class]="animated() ? 'absolute inset-x-0 top-0 h-full' : 'relative h-[100svh]'">

          <!-- Media keeps a fixed full-screen size, so shrinking the frame crops it instead of rescaling it -->
          <div data-media class="absolute inset-x-0 top-0 h-[100svh]">
            <video
              class="hidden size-full object-cover md:block"
              src="videos/bg-video.mp4"
              poster="home_md.png"
              autoplay loop playsinline preload="auto"
              [muted]="true"
              (loadedmetadata)="startVideo($event)"
              (loadeddata)="mediaLoaded.set(true)"
              (playing)="mediaLoaded.set(true)"
              (error)="mediaLoaded.set(true)"></video>
            <video
              class="size-full object-cover block md:hidden"
              src="videos/bg-video-sm.mp4"
              poster="home_sm.jpg"
              autoplay loop playsinline preload="auto"
              [muted]="true"
              (loadedmetadata)="startVideo($event)"
              (loadeddata)="mediaLoaded.set(true)"
              (playing)="mediaLoaded.set(true)"
              (error)="mediaLoaded.set(true)"></video>
            <div class="absolute inset-0 z-10 hidden bg-white/10 md:block" [class.animate-pulse]="!mediaLoaded()">
              <div class="size-full bg-white/5"></div>
            </div>
          </div>

          <div class="absolute inset-0 bg-gradient-to-b from-[#08182e]/50 via-[#08182e]/15 to-[#08182e]/60"></div>
        </div>

        <!-- Wordmark (scales down and moves to the top) -->
        <div class="pointer-events-none absolute inset-x-0 top-0 z-20 flex h-[100svh] items-center justify-center px-4">
          <h1
            data-mark
            class="whitespace-nowrap text-[clamp(3.5rem,19vw,26rem)] font-semibold leading-none tracking-[-0.05em] text-white will-change-transform">
            ADHMISK
          </h1>
        </div>

        <!-- Eyebrow, tagline and scroll cue -->
        <div
          data-intro
          class="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-6 px-5 pb-8 md:px-[60px] md:pb-12">
          <div>
            <p class="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d8b77e] sm:text-xs">
              A Cross-Border Business Holding Group
            </p>
            <p class="mt-2 text-lg font-medium tracking-tight text-white sm:text-2xl">
              Building value across borders.
            </p>
          </div>
          <span class="hidden items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80 sm:flex">
            Scroll
            <span class="h-8 w-px bg-white/50"></span>
          </span>
        </div>
      </div>
    </section>
  `,
})
export class HeroScroll {
  private readonly destroyRef = inject(DestroyRef);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** true once the scroll animation is running; false = SSR / reduced-motion layout */
  protected readonly animated = signal(false);
  protected readonly mediaLoaded = signal(false);

  protected startVideo(event: Event): void {
    const video = event.currentTarget as HTMLVideoElement;
    // Set the DOM properties as well as the template binding. Some browsers
    // inspect the element's muted property when deciding whether autoplay is allowed.
    video.defaultMuted = true;
    video.muted = true;
    video.volume = 0;
    void video.play().catch(() => undefined);
  }

  /** Phrases that light up one after another. Edit freely. */
  protected readonly statement = [
    'Cross-border business is complex.',
    'ADHMISK brings the people, partners and paperwork',
    'together under one accountable team.',
  ];

  /** Division cards shown on the right (straight from your DIVISIONS data). */
  protected readonly cards = DIVISIONS;

  constructor() {
    afterNextRender(async () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      gsap.registerPlugin(ScrollTrigger);

      this.animated.set(true);
      await new Promise<void>(r => requestAnimationFrame(() => requestAnimationFrame(() => r())));

      const root = this.host.nativeElement;
      const q = (s: string) => root.querySelector<HTMLElement>(s)!;
      const stage = q('[data-stage]');
      const frame = q('[data-frame]');
      const media = q('[data-media]');
      const mark = q('[data-mark]');
      const intro = q('[data-intro]');
      const statement = q('[data-statement]');
      const chunks = gsap.utils.toArray<HTMLElement>('[data-chunk]', root);

      const isDesktop = () => window.innerWidth >= 768;

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: stage,
            start: 'top top',
            end: '+=250%',
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl
          .to(frame, { height: () => (isDesktop() ? 72 : 56), ease: 'power2.inOut', duration: 1 }, 0)
          .to(media, { yPercent: -6, ease: 'power2.in', duration: 1 }, 0)
          .to(mark, {
            scale: () => (isDesktop() ? 0.09 : 0.24),
            y: () => -(stage.clientHeight / 2) + (isDesktop() ? 36 : 28),
            ease: 'power2.inOut',
            duration: 1,
          }, 0)
          .to(intro, { autoAlpha: 0, duration: 0.25 }, 0)
          .fromTo(statement, { yPercent: 18 }, { yPercent: 0, ease: 'power2.out', duration: 1 }, 0)
          .to(chunks, { opacity: 1, stagger: 0.3, duration: 0.3 }, 0.7)
          .to({}, { duration: 0.4 });
      }, root);

      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      this.destroyRef.onDestroy(() => ctx.revert());
    });
  }
}
