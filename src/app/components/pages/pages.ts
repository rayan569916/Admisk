import {
  Component,
  computed,
  input,
  OnDestroy,
  OnInit,
  signal,
  HostListener,
  ElementRef,
  ViewChild
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ABOUT_FAQ, ADVISORY_STATS, AUDIENCES, COMPANY, DIVISIONS, HUB, JOURNEY, LEADERSHIP, OFFICES, PRACTICES, PRINCIPLES, ROADMAP, SECTORS, SERVE, STATS, VALUES, VISION, WHY } from '../../content';
import { MEDIA } from '../../media';
import { Cta, Icon, PageHead } from '../../ui';
interface Person { name: string; role: string; group: string; bio: string; photo?: string; featured?: boolean; }


/* ───────────── HOME ───────────── */
@Component({
  selector: 'app-home',
  imports: [RouterLink, Icon, Cta],
  templateUrl: './pages.html',
  styleUrl: './pages.css',
})
export class Home implements OnInit, OnDestroy {

  media = MEDIA;
  company = COMPANY;
  stats = STATS;
  journey = JOURNEY;
  divisions = DIVISIONS;
  audiences = AUDIENCES;

  regions = COMPANY.regions;
  offices = OFFICES;

  playing = signal(true);
  aud = signal(0);
  current = computed(() => AUDIENCES[this.aud()]);

  cards = [
    {
      title: 'Invest & advise',
      text: 'Assess opportunities and plan your market entry.',
      icon: 'invest',
      image: "InvestAdvise.png",
      link: '/divisions/investment-advisory'
    },
    {
      title: 'Hire & train',
      text: 'Recruit and upskill work-ready teams.',
      icon: 'hr',
      image: "HireTrain.png",
      link: '/divisions/hr-staffing'
    },
    {
      title: 'Source & ship',
      text: 'Import, export and supplier sourcing.',
      icon: 'trade',
      image: "SourceShip.png",
      link: '/divisions/import-export-trading'
    },
  ];

  imageCards = [
    {
      title: 'Build capability',
      text: 'Recruit, train and equip teams across hospitality, logistics and sales.',
      img: "BuildCapability.png",
      link: '/divisions/hr-staffing',
      cta: 'Explore HR & Staffing'
    },
    {
      title: 'Open new markets',
      text: 'Market entry, sourcing and logistics across Africa, the GCC, Asia, Europe and the USA.',
      img: "OpenNewMarkets.png",
      link: '/divisions/import-export-trading',
      cta: 'Explore Import & Export'
    },
    {
      title: 'Invest with confidence',
      text: 'Opportunity assessment, valuation and transaction support for investors and entrepreneurs.',
      img: "Invest.png",
      link: '/divisions/investment-advisory',
      cta: 'Explore Advisory'
    },
  ];

  // =========================================
  // Mobile Carousel
  // =========================================

  statsCardIndex = 0;
  step = signal(0);

  private statsCarouselInterval?: ReturnType<typeof setInterval>;
  private statsCarouselPaused = false;
  private statsMobileView = false;

  mobileCardIndex = 0;

  private carouselInterval?: ReturnType<typeof setInterval>;
  private mobileView = false;
  private carouselPaused = false;
  private motionQuery?: MediaQueryList;

  prefersReducedMotion = false;



  @ViewChild('divisionScroller')
  divisionScroller?: ElementRef<HTMLDivElement>;

  divisionCardIndex = 0;

  private divisionCarouselInterval?: ReturnType<typeof setInterval>;
  private divisionCarouselPaused = false;
  private divisionMobileView = false;

  ngOnInit(): void {
    if (typeof window === 'undefined') {
      return;
    }

    // Detect the user's motion preference.
    this.motionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );

    this.prefersReducedMotion = this.motionQuery.matches;

    this.motionQuery.addEventListener(
      'change',
      this.onMotionPreferenceChange
    );

    // Initialize both carousels independently.
    this.updateViewport();
    this.updateStatsViewport();
    this.updateViewport();
    this.updateStatsViewport();
    this.updateDivisionViewport();
  }

  ngOnDestroy(): void {
    // Clean up image-card carousel.
    this.stopMobileCarousel();

    // Clean up stats carousel.
    this.stopStatsCarousel();

    // Remove motion preference listener.
    this.motionQuery?.removeEventListener(
      'change',
      this.onMotionPreferenceChange
    );
    this.stopDivisionCarousel();
  }

  get activeImageCard() {
    return this.imageCards[this.mobileCardIndex];
  }

  private onMotionPreferenceChange = (
    event: MediaQueryListEvent
  ): void => {
    this.prefersReducedMotion = event.matches;

    this.startMobileCarousel();
    this.startStatsCarousel();
    this.startDivisionCarousel();
  };

  @HostListener('window:resize')
  onResize(): void {
    this.updateViewport();
    this.updateStatsViewport();
    this.updateDivisionViewport();
  }

  // =========================================
  // Division Carousel Methods
  // =========================================

  private updateDivisionViewport(): void {
    if (typeof window === 'undefined') {
      return;
    }

    this.divisionMobileView = window.matchMedia(
      '(max-width: 767px)'
    ).matches;

    this.startDivisionCarousel();
  }

  private startDivisionCarousel(): void {
    this.stopDivisionCarousel();

    if (
      !this.divisionMobileView ||
      this.prefersReducedMotion ||
      this.divisionCarouselPaused ||
      this.divisions.length <= 1
    ) {
      return;
    }

    this.divisionCarouselInterval = setInterval(() => {
      this.advanceDivisionCard();
    }, 2500);
  }

  private stopDivisionCarousel(): void {
    if (this.divisionCarouselInterval !== undefined) {
      clearInterval(this.divisionCarouselInterval);
      this.divisionCarouselInterval = undefined;
    }
  }

  private advanceDivisionCard(): void {
    if (this.divisions.length <= 1) {
      return;
    }

    const nextIndex =
      (this.divisionCardIndex + 1) % this.divisions.length;

    this.goToDivisionCard(nextIndex);
  }

  nextDivisionCard(): void {
    if (this.divisions.length <= 1) {
      return;
    }

    this.goToDivisionCard(
      (this.divisionCardIndex + 1) % this.divisions.length
    );
  }

  previousDivisionCard(): void {
    if (this.divisions.length <= 1) {
      return;
    }

    this.goToDivisionCard(
      (this.divisionCardIndex - 1 + this.divisions.length) %
      this.divisions.length
    );
  }

  goToDivisionCard(index: number): void {
    if (
      index < 0 ||
      index >= this.divisions.length
    ) {
      return;
    }

    this.divisionCardIndex = index;

    const container = this.divisionScroller?.nativeElement;

    if (container && this.divisionMobileView) {
      const cards =
        container.querySelectorAll<HTMLElement>('.division-card');

      const card = cards[index];

      if (card) {
        container.scrollTo({
          left: card.offsetLeft - cards[0].offsetLeft,
          behavior: this.prefersReducedMotion ? 'auto' : 'smooth'
        });
      }
    }

    // Reset the timer after manual navigation.
    this.startDivisionCarousel();
  }

  onDivisionScroll(): void {
    const container = this.divisionScroller?.nativeElement;

    if (!container || !this.divisionMobileView) {
      return;
    }

    const cards =
      container.querySelectorAll<HTMLElement>('.division-card');

    if (!cards.length) {
      return;
    }

    const scrollPosition = container.scrollLeft;
    const firstCardOffset = cards[0].offsetLeft;

    let closestIndex = 0;
    let closestDistance = Infinity;

    cards.forEach((card, index) => {
      const cardPosition = card.offsetLeft - firstCardOffset;
      const distance = Math.abs(cardPosition - scrollPosition);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    this.divisionCardIndex = closestIndex;
  }

  pauseDivisionCarousel(): void {
    this.divisionCarouselPaused = true;
    this.stopDivisionCarousel();
  }

  resumeDivisionCarousel(): void {
    this.divisionCarouselPaused = false;
    this.startDivisionCarousel();
  }

  // =========================================
  // Stats Carousel Methods
  // =========================================

  private updateStatsViewport(): void {
    if (typeof window === 'undefined') {
      return;
    }

    this.statsMobileView = window.matchMedia(
      '(max-width: 767px)'
    ).matches;

    this.startStatsCarousel();
  }

  private startStatsCarousel(): void {
    this.stopStatsCarousel();

    // Autoplay only on mobile/tablet, respecting reduced motion.
    if (
      !this.statsMobileView ||
      this.prefersReducedMotion ||
      this.statsCarouselPaused ||
      this.stats.length <= 1
    ) {
      return;
    }

    this.statsCarouselInterval = setInterval(() => {
      this.advanceStatsCard();
    }, 2000);
  }

  private stopStatsCarousel(): void {
    if (this.statsCarouselInterval !== undefined) {
      clearInterval(this.statsCarouselInterval);
      this.statsCarouselInterval = undefined;
    }
  }

  private advanceStatsCard(): void {
    if (this.stats.length <= 1) {
      return;
    }

    this.statsCardIndex =
      (this.statsCardIndex + 1) % this.stats.length;
  }

  nextStatsCard(): void {
    if (this.stats.length <= 1) {
      return;
    }

    this.statsCardIndex =
      (this.statsCardIndex + 1) % this.stats.length;

    this.restartStatsCarousel();
  }

  previousStatsCard(): void {
    if (this.stats.length <= 1) {
      return;
    }

    this.statsCardIndex =
      (this.statsCardIndex - 1 + this.stats.length) %
      this.stats.length;

    this.restartStatsCarousel();
  }

  goToStatsCard(index: number): void {
    if (index < 0 || index >= this.stats.length) {
      return;
    }

    this.statsCardIndex = index;
    this.restartStatsCarousel();
  }

  pauseStatsCarousel(): void {
    this.statsCarouselPaused = true;
    this.stopStatsCarousel();
  }

  resumeStatsCarousel(): void {
    this.statsCarouselPaused = false;
    this.startStatsCarousel();
  }

  private restartStatsCarousel(): void {
    this.startStatsCarousel();
  }

  private updateViewport(): void {
    if (typeof window === 'undefined') {
      return;
    }

    this.mobileView = window.matchMedia(
      '(max-width: 639px)'
    ).matches;

    this.startMobileCarousel();
  }

  private startMobileCarousel(): void {
    this.stopMobileCarousel();

    // Only autoplay on mobile.
    if (
      !this.mobileView ||
      this.prefersReducedMotion ||
      this.carouselPaused ||
      this.imageCards.length <= 1
    ) {
      return;
    }

    this.carouselInterval = setInterval(() => {
      this.advanceImageCard();
    }, 2000);
  }

  private stopMobileCarousel(): void {
    if (this.carouselInterval !== undefined) {
      clearInterval(this.carouselInterval);
      this.carouselInterval = undefined;
    }
  }

  private advanceImageCard(): void {
    if (this.imageCards.length <= 1) {
      return;
    }

    this.mobileCardIndex =
      (this.mobileCardIndex + 1) % this.imageCards.length;
  }

  nextImageCard(): void {
    if (this.imageCards.length <= 1) {
      return;
    }

    this.mobileCardIndex =
      (this.mobileCardIndex + 1) % this.imageCards.length;

    this.restartMobileCarousel();
  }

  previousImageCard(): void {
    if (this.imageCards.length <= 1) {
      return;
    }

    this.mobileCardIndex =
      (this.mobileCardIndex - 1 + this.imageCards.length) %
      this.imageCards.length;

    this.restartMobileCarousel();
  }

  goToImageCard(index: number): void {
    if (
      index < 0 ||
      index >= this.imageCards.length
    ) {
      return;
    }

    this.mobileCardIndex = index;
    this.restartMobileCarousel();
  }

  pauseMobileCarousel(): void {
    this.carouselPaused = true;
    this.stopMobileCarousel();
  }

  resumeMobileCarousel(): void {
    this.carouselPaused = false;
    this.startMobileCarousel();
  }

  private restartMobileCarousel(): void {
    this.startMobileCarousel();
  }

  // =========================================
  // Existing Video Controls
  // =========================================

  toggle(v: HTMLVideoElement): void {
    if (v.paused) {
      void v.play()
        .then(() => this.playing.set(true))
        .catch(() => this.playing.set(false));
    } else {
      v.pause();
      this.playing.set(false);
    }
  }
}

/* ───────────── ABOUT ───────────── */
@Component({
  selector: 'app-about',
  imports: [RouterLink, PageHead, Cta],
  template: `
<app-page-head crumb="Home / About"
  title="A cross-border business holding group, headquartered in Riyadh."
  [accent]="['cross-border', 'Riy']"
  lead="ADMISK Investment Limited oversees six specialized divisions across Saudi Arabia, Kenya and Uganda." />
<!-- Who We Are -->
<section class="wrap pt-24 md:pt-32">
  <div class="grid items-center gap-8 rounded-[2rem] bg-mist p-5 md:grid-cols-[1.05fr_1fr] md:gap-12">

    <!-- Image card -->
    <div class="relative overflow-hidden rounded-3xl">
      <img
        src="Transparency.png"
        alt="ADMISK connecting businesses and commercial partners across borders"
        loading="lazy"
        class="aspect-[4/3] w-full object-cover md:aspect-[5/4]"
      >

      <!-- Image overlay -->
      <div class="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
    </div>

    <!-- Text content -->
    <div class="md:pr-4">
      <p class="text-[13px] font-medium uppercase tracking-[0.12em] text-slate">
        Who we are
      </p>

      <h2 class="h-display mt-4 text-3xl leading-tight md:text-4xl">
        Connecting people, opportunities and markets.
      </h2>

      <p class="mt-5 text-base leading-7 text-slate md:text-lg md:leading-8">
        We help businesses and individuals identify opportunities, build capable teams,
        stay compliant with local regulations, improve operations and connect with reliable
        commercial partners. We bring people, capital and projects together across borders
        under a single accountable group.
      </p>

      <!-- Key highlights -->
      <div class="mt-7 flex flex-wrap gap-2.5">
        <span class="rounded-full bg-white px-4 py-2 text-sm font-medium">
          Opportunity
        </span>
        <span class="rounded-full bg-white px-4 py-2 text-sm font-medium">
          Compliance
        </span>
        <span class="rounded-full bg-white px-4 py-2 text-sm font-medium">
          Global partnerships
        </span>
      </div>

      <!-- CTA -->
      <a routerLink="/about" class="btn mt-8 inline-flex">
        Meet the group ↗
      </a>
    </div>

  </div>
</section>
<!-- Vision & Mission -->
<section class="wrap mt-20 md:mt-28">
  <div class="grid gap-5 md:grid-cols-2">

    <!-- Vision Card -->
    <div class="group relative overflow-hidden rounded-[2rem] bg-mist p-7 transition-all duration-300 hover:-translate-y-1 md:p-10">

      <div class="flex items-center justify-between">
        <span class="text-[12px] font-medium uppercase tracking-[0.15em] text-slate">
          Our vision
        </span>
        <span class="flex size-11 items-center justify-center rounded-full bg-white text-xl transition-transform duration-300 group-hover:rotate-45">
          ↗
        </span>
      </div>

      <h3 class="h-display mt-10 text-3xl leading-tight tracking-tight md:text-4xl">
        Building trust.<br>
        Connecting opportunity.
      </h3>

      <p class="mt-5 max-w-lg text-sm leading-7 text-slate md:text-base md:leading-8">
        To build a trusted Saudi-based business holding group that connects investors,
        entrepreneurs and companies with practical strategies, qualified people and
        commercial opportunities.
      </p>

      <div class="mt-8 h-px w-full bg-black/10"></div>

      <p class="mt-4 text-xs font-medium uppercase tracking-wider text-slate">
        Trust · Strategy · Opportunity
      </p>
    </div>

    <!-- Mission Card -->
    <div class="group relative overflow-hidden rounded-[2rem] bg-[#093a56] p-7 text-white transition-all duration-300 hover:-translate-y-1 md:p-10">

      <div class="flex items-center justify-between">
        <span class="text-[12px] font-medium uppercase tracking-[0.15em] text-white/65">
          Our mission
        </span>
        <span class="flex size-11 items-center justify-center rounded-full bg-white/10 text-xl transition-transform duration-300 group-hover:rotate-45">
          ↗
        </span>
      </div>

      <h3 class="h-display mt-10 text-3xl leading-tight tracking-tight md:text-4xl">
        Enabling growth<br>
        across borders.
      </h3>

      <p class="mt-5 text-sm leading-7 text-white/75 md:text-base md:leading-8">
        To connect businesses across Africa, the GCC, Asia, Europe and the USA through
        a coordinated group of specialized divisions delivering professional, responsive
        and commercially focused solutions that help clients enter markets, build teams,
        source products and grow sustainably.
      </p>

      <div class="mt-8 h-px w-full bg-white/20"></div>

      <p class="mt-4 text-xs font-medium uppercase tracking-wider text-white/65">
        Markets · People · Sustainable growth
      </p>
    </div>

  </div>
</section>
<!-- Core Values -->
<section class="wrap mt-16 md:mt-20">

  <!-- Heading -->
  <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <p class="text-[11px] font-medium uppercase tracking-[0.15em] text-slate">
        What guides us
      </p>

      <h2 class="h-display mt-2 text-2xl leading-tight tracking-tight md:text-4xl">
        Our core values
      </h2>
    </div>

    <p class="max-w-sm text-sm leading-5 text-slate">
      The principles behind every relationship, decision and opportunity we pursue.
    </p>
  </div>

  <!-- Compact values grid -->
  <div class="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
    @for (v of values; track v; let i = $index) {
      <div
        class="group flex items-center justify-between gap-3 rounded-2xl bg-mist p-4 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#093a56] hover:text-white sm:p-5"
      >
        <div class="flex min-w-0 items-center gap-3">
          <span class="shrink-0 text-[11px] font-medium tracking-wider text-slate/70 transition-colors group-hover:text-white/60">
            0{{ i + 1 }}
          </span>

          <h3 class="text-sm font-semibold leading-snug tracking-tight sm:text-base">
            {{ v }}
          </h3>
        </div>

        <span class="shrink-0 text-sm text-[#093a56] transition-transform duration-300 group-hover:rotate-45 group-hover:text-white">
          ↗
        </span>
      </div>
    }
  </div>

</section>
<!-- Integrated Advisory -->
<section class="wrap mt-24 md:mt-32">

  <!-- Section heading -->
  <div class="grid items-end gap-6 border-b border-ash pb-8 md:grid-cols-[1fr_0.8fr]">
    <div>
      <p class="text-[12px] font-medium uppercase tracking-[0.15em] text-slate">
        Integrated advisory
      </p>

      <h2 class="h-display mt-3 text-3xl leading-tight tracking-tight md:text-5xl">
        Three practices.<br>
        One accountable mandate.
      </h2>
    </div>

    <p class="max-w-lg text-sm leading-7 text-slate md:text-base">
      Clients can engage one practice or coordinate investment, legal and business
      advice around the same commercial objective.
    </p>
  </div>

  <!-- Practice cards -->
  <div class="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
    @for (p of practices; track p.title; let i = $index) {
      <article
        class="group overflow-hidden rounded-[1.75rem] bg-mist transition-all duration-300 hover:-translate-y-1"
      >

        <!-- Image -->
        <div class="relative overflow-hidden rounded-t-[1.75rem]">
          <img
            [src]="p.path"
            [alt]="p.title + ' advisory meeting'"
            loading="lazy"
            class="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-105"
          >

          <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

          <span class="absolute left-5 top-5 flex size-10 items-center justify-center rounded-full bg-white/95 text-sm font-semibold text-[#093a56]">
            0{{ i + 1 }}
          </span>
        </div>

        <!-- Content -->
        <div class="p-6 md:p-7">

          <div class="flex items-start justify-between gap-4">
            <h3 class="text-xl font-semibold tracking-tight md:text-2xl">
              {{ p.title }}
            </h3>

            <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-[#093a56] transition-transform duration-300 group-hover:rotate-45">
              ↗
            </span>
          </div>

          <p class="mt-3 text-sm leading-7 text-slate">
            {{ p.intro }}
          </p>

          <!-- Services -->
          <div class="mt-6 border-t border-black/10 pt-2">
            <p class="mb-2 pt-2 text-[11px] font-medium uppercase tracking-[0.12em] text-slate">
              Areas of expertise
            </p>

            <ul>
              @for (service of p.services; track service) {
                <li class="flex items-start gap-3 border-b border-black/10 py-3 text-sm leading-6 last:border-b-0">
                  <span class="mt-2 size-1.5 shrink-0 rounded-full bg-[#093a56]/60"></span>
                  <span>{{ service }}</span>
                </li>
              }
            </ul>
          </div>

        </div>
      </article>
    }
  </div>

</section>

<section
  class="faq-section relative isolate mt-24 overflow-hidden bg-onyx py-16 text-white md:mt-32 md:py-20"
>
  <!-- Background image -->
  <div
    class="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
    style="background-image: url('QUESTIONS-bg.png')"
    aria-hidden="true"
  ></div>

  <!-- Dark overlay for readability -->
  <div
    class="absolute inset-0 -z-10 bg-black/50"
    aria-hidden="true"
  ></div>

  <!-- Subtle gradient overlay -->
  <div
    class="absolute inset-0 -z-10 bg-gradient-to-r from-black/70 via-black/40 to-black/65"
    aria-hidden="true"
  ></div>

  <div class="wrap relative grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">

    <!-- Section heading -->
    <div>
      <p
        class="text-[13px] font-medium uppercase tracking-[0.15em] text-[#c5a15b]"
      >
        Common questions
      </p>

      <h2 class="h-display mt-3 text-3xl leading-tight md:text-5xl">
        Before we begin.
      </h2>

      <p class="mt-5 max-w-sm text-sm leading-7 text-white/75">
        A few things worth knowing before we start working together.
      </p>
    </div>

    <!-- FAQ accordion -->
    <div class="border-t border-white/25">
      @for (item of aboutFaq; track item.question) {
        <details class="faq-item group border-b border-white/20 py-5">
          <summary
            class="flex cursor-pointer list-none items-center justify-between gap-6 text-base font-medium transition-colors duration-300 hover:text-[#d6b56f] [&::-webkit-details-marker]:hidden"
          >
            <span>{{ item.question }}</span>

            <span
              class="faq-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/30 text-xl font-light transition-all duration-300 group-open:rotate-45 group-open:border-[#c5a15b] group-open:text-[#d6b56f]"
              aria-hidden="true"
            >
              +
            </span>
          </summary>

          <p class="mt-4 max-w-2xl pr-10 text-sm leading-7 text-white/75">
            {{ item.answer }}
          </p>
        </details>
      }
    </div>

  </div>
</section>



<!-- Leadership -->
<!-- <section class="mt-24 bg-mist py-16 md:mt-32 md:py-24">
  <div class="wrap">

  
    <div class="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-end">
      <div>
        <p class="text-[12px] font-medium uppercase tracking-[0.15em] text-slate">
          Leadership
        </p>

        <h2 class="h-display mt-3 text-3xl leading-tight tracking-tight md:text-5xl">
          The people leading<br class="hidden md:block">
          the work.
        </h2>
      </div>

      <div>
        <p class="max-w-xl text-sm leading-7 text-slate md:text-base md:leading-8">
          The leadership team described in the company profile works across the
          group’s advisory practices and client engagements.
        </p>

        <a
          routerLink="/leadership"
          class="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand transition-all duration-300 hover:gap-3"
        >
          Meet our team <span>↗</span>
        </a>
      </div>
    </div>

  
    <div class="mt-10 overflow-hidden rounded-[2rem] bg-white">

    
      <div class="group relative overflow-hidden">
        <img
          [src]="teamImage"
          alt="Business team collaborating around a meeting table"
          loading="lazy"
          class="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-[1.02] md:h-96"
        >

        <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

        <div class="absolute bottom-5 left-5 md:bottom-8 md:left-8">
          <span class="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-medium text-[#093a56]">
            <span class="size-2 rounded-full bg-brand"></span>
            Leadership &amp; collaboration
          </span>
        </div>
      </div>

      <div class="grid md:grid-cols-3">
        @for (person of leadership; track person.name; let i = $index) {
          <article
            class="group relative flex flex-col border-t border-ash p-6 transition-colors duration-300 hover:bg-mist md:p-8"
            [class.md:border-l]="i > 0"
          >

           
            <div class="flex items-center justify-between">
              <span class="text-xs font-medium tracking-widest text-slate/70">
                0{{ i + 1 }}
              </span>

              <div class="flex size-12 items-center justify-center rounded-2xl bg-[#093a56] text-sm font-semibold text-white transition-transform duration-300 group-hover:scale-105">
                {{ person.initials }}
              </div>
            </div>

           
            <div class="mt-7">
              <h3 class="text-xl font-semibold tracking-tight">
                {{ person.name }}
              </h3>

              <p class="mt-2 text-sm font-medium text-brand">
                {{ person.role }}
              </p>

              <p class="mt-4 text-sm leading-7 text-slate">
                {{ person.bio }}
              </p>
            </div>

            
            <div class="mt-7 h-px w-10 bg-brand/50 transition-all duration-300 group-hover:w-full"></div>
          </article>
        }
      </div>

    </div>
  </div>
</section> -->
<!-- EXPERIENCE & SECTORS -->
<section class="wrap mt-16 text-[#080808] md:mt-24">

  <!-- HERO: INTRODUCTION + FEATURED STATISTIC -->
  <div class="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">

    <!-- Introduction -->
    <div class="flex flex-col items-start justify-center py-2 md:py-6">

      <div class="inline-flex items-center gap-2 rounded-full border border-[#d8d8d8] px-3 py-1.5">
        <span class="size-2 rounded-full bg-[#146ef5]"></span>
        <span class="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#5a5a5a]">
          Our experience
        </span>
      </div>

      <h2 class="h-display mt-5 max-w-2xl text-4xl font-semibold leading-[1.05] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
        Experience that
        <span class="block text-[#146ef5]">crosses industries.</span>
      </h2>

      <p class="mt-5 max-w-md text-sm leading-7 text-[#5a5a5a] md:text-base md:leading-8">
        Informed by diverse industries, commercial environments and markets,
        we bring a broader perspective to every opportunity.
      </p>

      <a
        routerLink="/about"
        class="group mt-6 inline-flex items-center gap-3 rounded-full bg-[#080808] px-5 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-[#146ef5]"
      >
        Discover our approach
        <span class="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
      </a>

      <!-- Small trust indicators -->
      <div class="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#d8d8d8] pt-5">
        <span class="text-[10px] font-medium uppercase tracking-[0.1em] text-[#777]">
          Cross-sector insight
        </span>
        <span class="size-1 rounded-full bg-[#146ef5]"></span>
        <span class="text-[10px] font-medium uppercase tracking-[0.1em] text-[#777]">
          Commercial perspective
        </span>
      </div>

    </div>

    <!-- Featured statistic -->
    <div class="group relative flex min-h-[280px] flex-col justify-between overflow-hidden rounded-[1.75rem] bg-[#093a56] p-6 text-white sm:min-h-[320px] sm:p-8 md:p-10">

      <!-- Decorative background -->
      <div class="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full border border-white/10 transition-transform duration-700 group-hover:scale-110"></div>
      <div class="pointer-events-none absolute -right-4 -top-8 size-40 rounded-full border border-white/10"></div>
      <div class="pointer-events-none absolute -bottom-20 -left-12 size-48 rounded-full bg-[#146ef5]/20 blur-3xl"></div>

      <div class="relative flex items-center justify-between gap-4">
        <span class="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/65">
          Industry experience
        </span>

        <span class="grid size-10 place-items-center rounded-full border border-white/20 text-lg transition-all duration-300 group-hover:rotate-45 group-hover:bg-white group-hover:text-[#093a56]">
          ↗
        </span>
      </div>

      <div class="relative mt-10">
        <div class="flex items-baseline gap-1">
          <span class="text-8xl font-semibold leading-none tracking-[-0.09em] sm:text-9xl">
            14
          </span>
          <span class="text-4xl font-medium text-[#75b4ff] sm:text-5xl">+</span>
        </div>

        <h3 class="mt-4 text-xl font-medium tracking-tight sm:text-2xl">
          Industry sectors
        </h3>

        <p class="mt-2 max-w-xs text-xs leading-6 text-white/65 sm:text-sm">
          A broad commercial perspective informed by the sectors represented
          in our company profile.
        </p>
      </div>

      <div class="relative mt-8 flex items-center gap-3 border-t border-white/15 pt-5">
        <span class="size-2 rounded-full bg-[#75b4ff]"></span>
        <span class="text-[10px] font-medium uppercase tracking-[0.12em] text-white/65">
          Diverse industries. Connected opportunities.
        </span>
      </div>

    </div>
  </div>


  <!-- SUPPORTING STATISTICS -->
  <div class="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">

    @for (stat of advisoryStats; track stat.label; let i = $index) {
      <article
        class="group rounded-2xl border border-[#e5e5e5] bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#146ef5]/40 hover:shadow-[0_12px_30px_rgba(20,110,245,0.06)] sm:p-6"
      >

        <div class="flex items-center justify-between">
          <span class="text-[10px] font-medium tracking-widest text-[#999]">
            {{ (i + 1).toString().padStart(2, '0') }}
          </span>

          <span class="text-sm text-[#146ef5] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
            ↗
          </span>
        </div>

        <div class="mt-4 break-words text-3xl font-semibold leading-tight tracking-[-0.06em] sm:mt-6 sm:text-4xl">
          {{ stat.number }}
        </div>

        <p class="mt-2 text-xs leading-5 text-[#5a5a5a] sm:mt-3 sm:text-sm sm:leading-6">
          {{ stat.label }}
        </p>

        <div class="mt-4 h-1 w-8 rounded-full bg-[#146ef5]/30 transition-all duration-300 group-hover:w-full group-hover:bg-[#146ef5]"></div>

      </article>
    }

  </div>


  <!-- SECTOR DIRECTORY -->
  <div class="mt-16 md:mt-24">

    <!-- Heading -->
    <div class="flex flex-col gap-5 border-b border-[#d8d8d8] pb-6 sm:flex-row sm:items-end sm:justify-between">

      <div>
        <p class="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#146ef5]">
          Explore our expertise
        </p>

        <h3 class="h-display mt-3 text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-4xl md:text-5xl">
          Industries we understand.
        </h3>

        <p class="mt-3 max-w-md text-sm leading-6 text-[#5a5a5a]">
          A cross-sector outlook that helps us see opportunities from different perspectives.
        </p>
      </div>

      <div class="flex items-center gap-3 self-start rounded-2xl bg-[#f3f6fa] px-4 py-3 sm:self-auto">
        <span class="text-3xl font-semibold tracking-tight text-[#093a56]">
          {{ sectors.length.toString().padStart(2, '0') }}
        </span>

        <span class="max-w-16 text-[9px] font-semibold uppercase leading-4 tracking-[0.12em] text-[#5a5a5a]">
          Listed sectors
        </span>
      </div>

    </div>


    <!-- Sector cards -->
    <div class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

      @for (sector of sectors; track sector; let i = $index) {
        <article
          class="group relative flex min-h-[76px] items-center gap-4 overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white p-4 transition-all duration-300 hover:border-[#146ef5]/40 hover:bg-[#f7faff] sm:p-5"
        >

          <!-- Number badge -->
          <div class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f1f5fa] text-xs font-semibold text-[#093a56] transition-all duration-300 group-hover:bg-[#093a56] group-hover:text-white">
            {{ (i + 1).toString().padStart(2, '0') }}
          </div>

          <!-- Sector name -->
          <h4 class="min-w-0 flex-1 text-sm font-medium leading-6 text-[#222] transition-colors duration-300 group-hover:text-[#146ef5]">
            {{ sector }}
          </h4>

          <!-- Arrow -->
          <span class="flex size-8 shrink-0 items-center justify-center rounded-full text-base text-[#146ef5] transition-all duration-300 group-hover:bg-[#146ef5] group-hover:text-white">
            ↗
          </span>

        </article>
      }

    </div>

    <p class="mt-4 text-[10px] leading-5 text-[#777]">
      Sector examples are based on those listed in the company profile.
    </p>

  </div>

</section>


    <section class="wrap mt-24 md:mt-32">
      <div class="grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
        <div><p class="text-[13px] font-medium uppercase tracking-[0.1em] text-slate">How we work</p><h2 class="h-display mt-3 text-3xl md:text-5xl">A mandate, from diagnosis to follow-through.</h2></div>
        <ol class="border-t border-ash">
          @for (stage of advisoryApproach; track stage.title; let i = $index) {
            <li class="grid gap-2 border-b border-ash py-5 sm:grid-cols-[56px_1fr] sm:gap-5"><span class="text-sm font-medium text-brand">0{{ i + 1 }}</span><div><h3 class="text-lg font-semibold">{{ stage.title }}</h3><p class="mt-2 max-w-xl text-sm leading-6 text-slate">{{ stage.text }}</p></div></li>
          }
        </ol>
      </div>
    </section>

<!-- HOLDING STRUCTURE -->
<section class="wrap mt-16 md:mt-24">

  <!-- Section heading -->
  <div class="grid gap-5 md:grid-cols-[1fr_0.8fr] md:items-end">
    <div>
      <p class="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-brand">
        <span class="size-2 rounded-full bg-brand"></span>
        How we are structured
      </p>

      <h2 class="h-display mt-3 text-3xl leading-tight tracking-tight md:text-5xl">
        One group.<br class="hidden sm:block">
        Six specialized divisions.
      </h2>
    </div>

    <p class="max-w-xl text-sm leading-7 text-slate md:text-base">
      A single parent company provides central governance, brand direction,
      compliance oversight and client relationships, with six specialized
      divisions delivering focused services beneath it.
    </p>
  </div>

  <!-- Structure diagram -->
  <div class="relative mt-8 overflow-hidden rounded-[1.75rem] bg-[#080d13] p-5 text-white sm:p-8 md:mt-10 md:p-12">

    <!-- Decorative background -->
    <div class="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full border border-white/[0.06]"></div>
    <div class="pointer-events-none absolute -right-12 -top-12 size-56 rounded-full border border-white/[0.06]"></div>
    <div class="pointer-events-none absolute -bottom-32 -left-20 size-72 rounded-full bg-brand/10 blur-3xl"></div>

    <!-- Diagram heading -->
    <div class="relative mb-8 flex flex-wrap items-center justify-between gap-3">
      <span class="text-[10px] font-medium uppercase tracking-[0.15em] text-white/50">
        Group architecture
      </span>

      <span class="rounded-full border border-white/15 px-3 py-1.5 text-[10px] text-white/65">
        Parent company + {{ divisions.length }} divisions
      </span>
    </div>

    <!-- Parent company -->
    <div class="relative mx-auto max-w-lg">
      <div class="rounded-2xl border border-white/15 bg-white/[0.06] p-5 text-center backdrop-blur-sm sm:p-7">

        <div class="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-brand text-xl font-semibold text-white shadow-lg shadow-brand/20">
          A
        </div>

        <p class="text-[9px] font-medium uppercase tracking-[0.18em] text-white/50">
          Holding company
        </p>

        <h3 class="mt-2 text-lg font-semibold tracking-tight sm:text-2xl">
          ADMISK INVESTMENT LIMITED
        </h3>

        <p class="mt-2 text-xs text-white/55">
          Central governance · Brand · Compliance · Client relationships
        </p>

        <div class="mt-5 flex flex-wrap justify-center gap-2">
          <span class="rounded-full bg-white/10 px-3 py-1.5 text-[10px] text-white/75">
            Riyadh
          </span>
          <span class="rounded-full bg-white/10 px-3 py-1.5 text-[10px] text-white/75">
            Nairobi
          </span>
          <span class="rounded-full bg-white/10 px-3 py-1.5 text-[10px] text-white/75">
            Kampala
          </span>
        </div>
      </div>
    </div>

    <!-- Connecting line -->
    <div class="relative mx-auto flex h-12 max-w-lg justify-center">
      <div class="h-full w-px bg-gradient-to-b from-brand/80 to-white/20"></div>
      <span class="absolute bottom-0 size-2 -translate-y-1 rounded-full bg-brand"></span>
    </div>

    <!-- Divisions -->
    <div class="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      @for (d of divisions; track d.slug; let i = $index) {
        <a
          [routerLink]="['/divisions', d.slug]"
          class="group flex min-h-24 items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-brand/60 hover:bg-white/[0.08] sm:p-5"
        >

          <!-- Division number -->
          <span class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-xs font-medium text-white/45 transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-white">
            {{ (i + 1).toString().padStart(2, '0') }}
          </span>

          <!-- Division title -->
          <span class="min-w-0 flex-1">
            <span class="block text-sm font-medium leading-6 text-white/90 transition-colors group-hover:text-white">
              {{ d.title }}
            </span>
            <span class="mt-1 block text-[10px] uppercase tracking-wider text-white/40">
              Specialized division
            </span>
          </span>

          <!-- Arrow -->
          <span class="text-lg text-brand transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
            ↗
          </span>
        </a>
      }
    </div>

    <!-- Footer -->
    <div class="relative mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-xs leading-5 text-white/50">
        Specialized expertise. Coordinated delivery.
      </p>

      <span class="inline-flex items-center gap-2 text-xs font-medium text-white/80">
        One accountable holding group
        <span class="text-brand">↗</span>
      </span>
    </div>

  </div>
</section>


<!-- GLOBAL OFFICES -->
<section class="wrap mt-16 md:mt-24">

  <!-- Heading -->
  <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <p class="text-[10px] font-semibold uppercase tracking-[0.15em] text-brand">
        Our locations
      </p>

      <h2 class="h-display mt-3 text-3xl leading-tight tracking-tight md:text-5xl">
        A presence across markets.
      </h2>

      <p class="mt-3 max-w-lg text-sm leading-6 text-slate md:text-base">
        Connecting relationships and opportunities across our international locations.
      </p>
    </div>

    <span class="inline-flex w-fit items-center gap-2 rounded-full border border-ash px-4 py-2 text-xs font-medium text-slate">
      <span class="size-2 rounded-full bg-brand"></span>
      {{ offices.length }} locations
    </span>
  </div>

  <!-- Office cards -->
  <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    @for (o of offices; track o.key; let i = $index) {
      <article
        class="group overflow-hidden rounded-[1.5rem] border border-ash bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-[0_16px_40px_rgba(0,0,0,0.07)]"
      >

        <!-- Office image -->
        <div class="relative overflow-hidden">
          <img
            [src]="media[o.key]"
            [alt]="o.city"
            loading="lazy"
            class="h-48 w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-52"
          >

          <!-- Image overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent"></div>

          <!-- Location number -->
          <span class="absolute left-4 top-4 rounded-full border border-white/30 bg-black/20 px-3 py-1.5 text-[10px] font-medium text-white backdrop-blur-md">
            LOCATION {{ (i + 1).toString().padStart(2, '0') }}
          </span>

          <!-- City name -->
          <div class="absolute bottom-4 left-5 right-5">
            <h3 class="text-xl font-semibold tracking-tight text-white sm:text-2xl">
              {{ o.city }}
            </h3>
          </div>
        </div>

        <!-- Office details -->
        <div class="p-5 sm:p-6">

          <div class="flex items-start gap-3">
            <span class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#f1f5fa] text-brand">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="size-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 21s7-5.5 7-12a7 7 0 1 0-14 0c0 6.5 7 12 7 12Z"/>
                <circle cx="12" cy="9" r="2.2"/>
              </svg>
            </span>

            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold text-[#080808]">
                {{ o.name }}
              </p>

              <p class="mt-2 break-words text-xs leading-6 text-slate">
                {{ o.address }}
              </p>
            </div>
          </div>

          <div class="mt-5 flex items-center justify-between gap-3 border-t border-ash pt-4">
            <div class="min-w-0">
              <p class="text-[9px] font-medium uppercase tracking-[0.12em] text-slate">
                Contact
              </p>
              <p class="mt-1 break-words text-xs font-medium text-[#080808]">
                {{ o.phone }}
              </p>
            </div>

            <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-mist text-brand transition-all duration-300 group-hover:bg-brand group-hover:text-white">
              ↗
            </span>
          </div>

        </div>
      </article>
    }
  </div>

</section>

    <app-cta />
  `,
})
export class About {
  media: Record<string, string> = MEDIA as unknown as Record<string, string>;
  teamImage = MEDIA.team;
  values = VALUES; divisions = DIVISIONS; offices = OFFICES;
  leadership = LEADERSHIP;
  practices = PRACTICES;
  sectors = SECTORS;
  advisoryStats = ADVISORY_STATS; aboutFaq = ABOUT_FAQ;
  advisoryApproach = [
    { title: 'Diagnose', text: 'Review the commercial objective, financial position and relevant legal context together before recommending a path.' },
    { title: 'Structure', text: 'Coordinate the business plan, transaction terms and supporting documentation around the agreed approach.' },
    { title: 'Negotiate', text: 'Support discussions with counterparties and professional advisers, involving licensed specialists where required.' },
    { title: 'Close and follow through', text: 'Help coordinate closing requirements and ongoing governance or reporting needs.' },
  ];
}


/* ───────────── LEADERSHIP ───────────── */
@Component({
  selector: 'app-leadership',
  imports: [RouterLink],
  template: `
    <!-- LEADERSHIP SECTION -->
    <section class="overflow-hidden bg-mist py-12 sm:py-16 lg:py-20">
      <div class="wrap">

        <!-- HEADER -->
        <div class="flex flex-col gap-6 border-b border-ash pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div class="flex items-center gap-3">
              <span class="h-px w-8 bg-brand"></span>
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                Leadership
              </p>
            </div>

            <h2 class="h-display mt-3 text-4xl tracking-tight sm:text-5xl lg:text-6xl">
              Our team<span class="text-brand">.</span>
            </h2>

            <p class="mt-3 max-w-xl text-sm leading-6 text-slate sm:text-base">
              Meet the people connecting expertise, strategy and execution
              across our divisions and international markets.
            </p>
          </div>

          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:justify-end">
            <!-- TEAM COUNT -->
            <div class="flex items-center gap-3 sm:border-l sm:border-ash sm:pl-5">
              <span class="text-3xl font-semibold tracking-tight text-ink">
                {{ filtered().length < 10 ? '0' + filtered().length : filtered().length }}
              </span>
              <span class="max-w-16 text-[10px] font-medium uppercase leading-4 tracking-[0.14em] text-slate">
                Team members
              </span>
            </div>

            <!-- FILTERS -->
            @if (groups().length > 2) {
              <div class="flex flex-wrap gap-2">
                @for (g of groups(); track g) {
                  <button
                    type="button"
                    (click)="setGroup(g)"
                    class="rounded-full px-3.5 py-2 text-xs font-medium transition sm:px-4"
                    [class]="group() === g
                      ? 'bg-ink text-white shadow-sm'
                      : 'border border-ash bg-white text-slate hover:border-brand hover:text-brand'">
                    {{ g }}
                  </button>
                }
              </div>
            }
          </div>
        </div>

        <!-- FEATURED FOUNDER -->
        @if (featured(); as f) {
          <article class="mt-7 grid overflow-hidden rounded-2xl border border-ash bg-white sm:rounded-3xl md:grid-cols-[0.8fr_1.2fr]">

            <!-- Founder image -->
            <div class="relative overflow-hidden bg-[#e9edf4] h-120 md:h-auto md:min-h-[340px]">
              @if (f.photo) {
                <img
                  [src]="f.photo"
                  [alt]="f.name"
                  loading="lazy"
                  class="absolute inset-0 size-full object-cover object-top">
              } @else {
                <div class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#4d9bff] to-brand text-6xl font-semibold text-white">
                  {{ initials(f.name) }}
                </div>
              }

              <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-5 pt-16">
                <span class="inline-flex items-center rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                  Founder & CEO
                </span>
              </div>
            </div>

            <!-- Founder details -->
            <div class="flex min-w-0 flex-col justify-center p-5 sm:p-8 lg:p-10">
              <div class="flex items-center gap-2">
                <span class="size-2 rounded-full bg-brand"></span>
                <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
                  Group leadership
                </p>
              </div>

              <h3 class="h-display mt-3 text-2xl leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                {{ f.name }}
              </h3>

              <p class="mt-4 max-w-2xl text-sm leading-6 text-slate sm:text-base sm:leading-7">
                {{ f.bio }}
              </p>

              <!-- Key details -->
              <div class="mt-6 grid grid-cols-2 gap-3 border-t border-ash pt-5 sm:grid-cols-3 sm:gap-4">
                <div>
                  <p class="text-xl font-semibold tracking-tight text-ink">06</p>
                  <p class="mt-1 text-xs leading-5 text-slate">Business divisions</p>
                </div>

                <div class="border-l border-ash pl-3 sm:pl-4">
                  <p class="text-xl font-semibold tracking-tight text-ink">01</p>
                  <p class="mt-1 text-xs leading-5 text-slate">Unified team</p>
                </div>

                <div class="col-span-2 border-t border-ash pt-3 sm:col-span-1 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
                  <p class="text-sm font-semibold text-ink">Global presence</p>
                  <p class="mt-1 text-xs leading-5 text-slate">Riyadh · Nairobi · Kampala</p>
                </div>
              </div>
            </div>
          </article>
        }

        <!-- TEAM HEADING -->
        <div class="mt-12 flex flex-col gap-3 sm:mt-14 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
              The people behind ADMISK
            </p>

            <h3 class="h-display mt-2 max-w-xl text-2xl leading-tight tracking-tight sm:text-3xl lg:text-4xl">
              Expertise across every division.
            </h3>
          </div>

          <p class="max-w-md text-sm leading-6 text-slate">
            From operations and technology to recruitment and international
            partnerships, our team turns strategy into action.
          </p>
        </div>

        <!-- TEAM GRID -->
        <div class="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          @for (p of visible(); track p.name; let i = $index) {
            <article
              class="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-ash bg-white transition duration-300 hover:-translate-y-1 hover:border-[#b9cce5] hover:shadow-lg sm:rounded-2xl">

              <!-- IMAGE -->
              <div class="relative aspect-[4/5] overflow-hidden bg-[#e9edf4]">
                @if (p.photo) {
                  <img
                    [src]="p.photo"
                    [alt]="p.name"
                    loading="lazy"
                    class="size-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]">
                } @else {
                  <div class="flex size-full items-center justify-center bg-gradient-to-br from-[#4d9bff] to-brand text-4xl font-semibold text-white">
                    {{ initials(p.name) }}
                  </div>
                }

                <!-- Number badge -->
                <span class="absolute left-2 top-2 rounded-md border border-white/60 bg-white/90 px-2 py-1 text-[10px] font-semibold tracking-wide text-ink backdrop-blur-sm sm:left-3 sm:top-3 sm:px-2.5 sm:text-xs">
                  {{ (i + 1) < 10 ? '0' + (i + 1) : (i + 1) }}
                </span>

                <!-- Subtle image overlay -->
                <div class="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              <!-- DETAILS -->
              <div class="flex flex-1 flex-col p-3 sm:p-4 lg:p-5">
                <p class="text-[9px] font-semibold uppercase tracking-[0.12em] text-brand sm:text-[10px] sm:tracking-[0.14em]">
                  {{ p.group }}
                </p>

                <h4 class="mt-1.5 break-words text-sm font-semibold leading-snug tracking-tight text-ink sm:text-base lg:text-lg">
                  {{ p.name }}
                </h4>

                <p class="mt-1.5 text-[11px] font-medium leading-4 text-brand sm:text-xs sm:leading-5">
                  {{ p.role }}
                </p>

                <p class="mt-2 line-clamp-3 text-xs leading-5 text-slate sm:mt-3 sm:text-sm sm:leading-6">
                  {{ p.bio }}
                </p>

                <div class="mt-auto flex items-center justify-between border-t border-ash pt-3 sm:pt-4">
                  <span class="text-[10px] text-slate sm:text-xs">ADMISK team</span>

                  <span class="flex size-7 shrink-0 items-center justify-center rounded-full bg-mist text-ink transition duration-200 group-hover:bg-brand group-hover:text-white sm:size-8">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.8"
                      class="size-3.5 sm:size-4"
                      aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6 6 6-6 6"/>
                    </svg>
                  </span>
                </div>
              </div>
            </article>
          }
        </div>

        <!-- SHOW MORE -->
        @if (rest().length > limit()) {
          <div class="mt-7 flex justify-center">
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-full border border-ash bg-white px-5 py-3 text-sm font-medium text-ink transition hover:border-brand hover:text-brand"
              (click)="limit.set(limit() + 8)">
              Show more
              <span class="text-xs text-slate">({{ rest().length - limit() }} remaining)</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                class="size-4"
                aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m-7-7 7 7 7-7"/>
              </svg>
            </button>
          </div>
        }
      </div>
    </section>

    <!-- CONTACT CTA -->
<section class="wrap relative py-10 sm:py-14 lg:py-20">
  <div class="relative isolate overflow-hidden rounded-2xl bg-onyx text-white sm:rounded-3xl">

    <!-- Background image -->
    <div
      class="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
      style="background-image: url('/QUESTIONS-bg.png')"
      aria-hidden="true">
    </div>

    <!-- Dark overlay to maintain text readability -->
    <div
      class="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-[#080d18]/95 via-[#080d18]/80 to-[#080d18]/45"
      aria-hidden="true">
    </div>

    <!-- Decorative elements -->
    <div class="pointer-events-none absolute -right-16 -top-24 size-64 rounded-full border border-white/10 sm:size-80"></div>
    <div class="pointer-events-none absolute -right-6 -top-14 size-48 rounded-full border border-white/10 sm:size-64"></div>
    <div class="pointer-events-none absolute bottom-0 right-0 h-1 w-1/3 bg-brand"></div>

    <!-- Content -->
    <div class="relative flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-center md:justify-between md:gap-10 md:p-10 lg:p-12">

      <div class="max-w-2xl">
        <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9fc8ff]">
          Start a conversation
        </p>

        <h2 class="h-display mt-3 text-2xl leading-tight tracking-tight sm:text-3xl lg:text-4xl">
          One team. Accountable from the first meeting.
        </h2>

        <p class="mt-3 max-w-xl text-sm leading-6 text-white/70 sm:text-base">
          Connect with our team to discuss your business needs and explore
          how ADMISK can help.
        </p>
      </div>

      <a
        routerLink="/contact"
        class="inline-flex w-fit shrink-0 items-center justify-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink transition duration-200 hover:-translate-y-0.5 hover:bg-[#e3eeff] sm:px-6">

        Speak with an advisor

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          class="size-4"
          aria-hidden="true">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M5 12h14m-6-6 6 6-6 6" />
        </svg>
      </a>

    </div>
  </div>
</section>

  `,
})
export class Leadership {
  leadership: Person[] = [
    {
      name: 'Mr. Adhan Mohamud Abdi',
      role: 'Founder and CEO',
      group: 'Leadership',
      featured: true,
      photo: 'employees/adhan-mohamud-abdi.jpg',
      bio: 'Adhan founded ADMISK to connect investment, advisory, workforce, training, hospitality and trade under one accountable group. He sets the direction for all six divisions and stays closely involved in key client relationships across Riyadh, Nairobi and Kampala.',
    },

    {
      name: 'Mr. Mutaib Bin Abdullah Bin Hamadi',
      role: 'Managing Partner',
      group: 'Leadership',
      photo: 'employees/mutaib-bin-abdullah-bin-hamadi.jpg',
      bio: 'Mutaib supports the founder in leading the group’s growth and partnerships. He works with clients and divisions to turn opportunities into well-structured, compliant projects.',
    },
        {
      name: 'Dr. Abdallah Omar Elmi',
      role: 'Managing Partner',
      group: 'Leadership',
      photo: 'employees/abdallah-omar-elmi.jpg',
      bio: 'Abdallah works alongside the founder to guide the group’s divisions and client engagements, from first conversation to delivery. He helps keep every mandate accountable, disciplined and focused on long-term relationships.',
    },
    {
      name: 'Eng. Mohamed Altaher',
      role: 'Operations Manager',
      group: 'Leadership',
      photo: 'employees/mohamed-altaher.jpg',
      bio: 'Mohamed keeps day-to-day delivery running smoothly across the divisions and offices. He owns clear responsibilities, documented approvals and on-time coordination, so clients deal with one organised team.',
    },
    {
      name: 'Mr. Ammar Mahmoud',
      role: 'Human Resources',
      group: 'Leadership',
      photo: 'employees/ammar-mahmoud.jpg',
      bio: 'Ammar looks after people and recruitment at ADMISK. He helps match capable candidates with employers and keeps hiring and training standards consistent across the group.',
    },
    {
      name: 'Mr. Abin Raj',
      role: 'IT Manager',
      group: 'Leadership',
      photo: 'employees/abin-raj.jpg',
      bio: 'Abin manages the systems that keep ADMISK connected, from the website and client records to everyday tools used across three countries. He focuses on reliable, secure technology that supports every division.',
    },
    {
      name: 'Mr. Reggie Sanchez',
      role: 'East Asia Marketing Representative',
      group: 'Leadership',
      photo: 'employees/reggie-sanchez.jpg',
      bio: 'Reggie builds relationships with businesses and suppliers across East Asia. He introduces them to ADMISK’s sourcing, trading and advisory services and helps open doors to new markets.',
    },
    {
      name: 'Ms. Anne Kimani',
      role: 'Africa Marketing Representative',
      group: 'Leadership',
      photo: 'employees/anne-kimani.jpg',
      bio: 'Anne represents ADMISK with companies and partners across Africa. She connects them with the right division, from recruitment and training to trade and business advisory.',
    },
  ];

  practices = ['Investment', 'Legal', 'Business'];

  stats = [
    { number: '3', label: 'Integrated advisory practices' },
    { number: '120+', label: 'Transactions structured and closed' },
    { number: '14', label: 'Sectors covered' },
    { number: '1', label: 'Point of accountability' },
  ];

  group = signal('All');
  limit = signal(8);

  groups = computed(() => [
    'All',
    ...new Set(this.leadership.map((p) => p.group)),
  ]);

  filtered = computed(() =>
    this.leadership.filter(
      (p) => this.group() === 'All' || p.group === this.group()
    )
  );

  featured = computed(() =>
    this.group() === 'All'
      ? this.leadership.find((p) => p.featured)
      : undefined
  );

  rest = computed(() =>
    this.filtered().filter((p) => p !== this.featured())
  );

  visible = computed(() => this.rest().slice(0, this.limit()));

  setGroup(g: string) {
    this.group.set(g);
    this.limit.set(8);
  }

  initials(n: string) {
    return n
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();
  }
}

/* ───────────── DIVISIONS ───────────── */
@Component({
  selector: 'app-divisions',
  imports: [RouterLink, PageHead, Icon, Cta],
  template: `
    <app-page-head crumb="Home / Divisions" title="Six divisions, one accountable holding group." lead="Each division has deep expertise. All are coordinated under one parent company with central governance." />
    <section class="wrap mt-16 grid gap-4 md:grid-cols-2">
      @for (d of divisions; track d.slug) {
        <article class="rounded-lg border border-ash p-7">
          <div class="flex items-center gap-4"><span class="flex size-14 items-center justify-center rounded-lg bg-mist text-brand"><app-icon [name]="d.icon" /></span><h2 class="text-2xl font-semibold tracking-tight">{{ d.title }}</h2></div>
          <p class="mt-4 text-slate">{{ d.intro }}</p>
          <div class="mt-5 border-t border-ash">@for (s of d.services; track s) { <div class="arrow-row !py-3 text-sm">{{ s }}<span class="text-slate">→</span></div> }</div>
          <a [routerLink]="['/divisions', d.slug]" class="mt-5 inline-block text-sm font-medium hover:underline">View division →</a>
        </article>
      }
    </section>
    <app-cta title="Not sure which division fits?" text="Start with any one. We coordinate the rest." />
  `,
})
export class Divisions { divisions = DIVISIONS; }

@Component({
  selector: 'app-division-detail',
  imports: [RouterLink, PageHead, Icon, Cta],
  template: `
    @if (div(); as d) {
      <app-page-head [crumb]="'Divisions / ' + d.title" [title]="d.title" [lead]="d.intro">
        <div class="mt-8 flex gap-3"><a class="btn" routerLink="/contact">Talk to this team</a><a class="btn-ghost" routerLink="/divisions">All divisions</a></div>
      </app-page-head>
      <section class="wrap mt-16 grid items-start gap-10 md:grid-cols-2">
        <img [src]="d.path" [alt]="d.title" class="aspect-[3/2] w-full rounded-lg bg-mist object-cover md:min-w-0 h-[390px] sm:h-[420px] md:h-[440px]">
        <div>
          <h2 class="h-display text-3xl md:text-4xl">What we offer</h2>
          <div class="mt-6 border-t border-ash">@for (s of d.services; track s) { <div class="arrow-row">{{ s }}<span class="text-slate">→</span></div> }</div>
        </div>
      </section>
      <section class="wrap mt-20">
        <h2 class="h-display text-3xl md:text-4xl">Related divisions</h2>
        <div class="mt-8 grid gap-4 md:grid-cols-3">
          @for (r of related(); track r.slug) {
            <a [routerLink]="['/divisions', r.slug]" class="rounded-lg border border-ash p-6 transition hover:shadow-xl"><span class="text-brand"><app-icon [name]="r.icon" /></span><h3 class="mt-3 text-xl font-semibold tracking-tight">{{ r.title }}</h3><p class="mt-2 text-sm text-slate">{{ r.short }}</p></a>
          }
        </div>
      </section>
      <app-cta />
    } @else {
      <section class="wrap py-32 text-center"><h1 class="h-display text-4xl">Division not found</h1><a routerLink="/divisions" class="btn mt-8">View all divisions</a></section>
    }
  `,
})
export class DivisionDetail {
  slug = input.required<string>();
  media = MEDIA;
  div = computed(() => DIVISIONS.find((d: any) => d.slug === this.slug()));
  related = computed(() => DIVISIONS.filter((d: any) => d.slug !== this.slug()).slice(0, 3));
}

/* ───────────── SOLUTIONS ───────────── */
/* ───────────── SOLUTIONS ───────────── */
@Component({
  selector: 'app-solutions',
  imports: [PageHead, Cta, Icon],
  template: `
<app-page-head crumb="Home / Solutions"
  title="An integrated holding platform, not a collection of unrelated services."
  [accent]="['integrated', 'unre']"
  lead="A client can enter through one division and access additional support from across the group as its needs develop." />
    <!-- How the divisions connect -->
    <section class="wrap mt-16 grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
      <div>
        <h2 class="h-display text-3xl md:text-5xl">One entry point.<br>Six ways to grow.</h2>
        <p class="lead mt-5 max-w-md">Start with the division that fits today’s need. Strategy, people, capability, operations, trade and growth all connect back to one accountable group.</p>
        <div class="mt-8 flex flex-wrap gap-3">
          <a class="btn" routerLink="/divisions">Explore divisions</a>
          <a class="btn-ghost" routerLink="/contact">Talk to our team</a>
        </div>
      </div>

      <!-- Radial diagram (tablet and up) -->
      <div class="relative mx-auto hidden aspect-square w-full max-w-[620px] md:block">
        <svg viewBox="0 0 100 100" class="absolute inset-0 size-full" aria-hidden="true">
          <circle cx="50" cy="50" r="38" fill="none" stroke="#d8d8d8" stroke-dasharray="1.2 1.6" stroke-width=".3" />
          @for (n of hubNodes; track n.t) {
            <line x1="50" y1="50" [attr.x2]="n.x" [attr.y2]="n.y" stroke="#146ef5" stroke-opacity=".35" stroke-width=".35" stroke-dasharray="1.4 1.4" />
          }
        </svg>
        <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <span class="absolute inset-0 animate-ping rounded-full bg-brand/20"></span>
          <div class="relative flex size-32 flex-col items-center justify-center rounded-full bg-gradient-to-br from-[#4d9bff] to-brand text-center text-white shadow-2xl">
            <span class="text-xl font-bold tracking-tight">ADMISK</span>
            <span class="text-xs opacity-90">One group</span>
          </div>
        </div>
        @for (n of hubNodes; track n.t) {
          <div class="absolute w-[150px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-ash bg-white p-4 shadow-lg transition hover:-translate-y-[55%] hover:shadow-2xl"
               [style.left.%]="n.x" [style.top.%]="n.y">
            <span class="flex size-9 items-center justify-center rounded-lg bg-mist text-brand"><app-icon [name]="n.icon" [size]="20" /></span>
            <div class="mt-2.5 text-xs font-semibold text-brand">{{ n.k }}</div>
            <div class="text-sm font-semibold leading-tight tracking-tight">{{ n.t }}</div>
          </div>
        }
      </div>

      <!-- Cards (phones) -->
      <div class="grid grid-cols-2 gap-3 md:hidden">
        @for (n of hubNodes; track n.t) {
          <div class="rounded-2xl border border-ash p-4">
            <span class="flex size-9 items-center justify-center rounded-lg bg-mist text-brand"><app-icon [name]="n.icon" [size]="20" /></span>
            <div class="mt-2.5 text-xs font-semibold text-brand">{{ n.k }}</div>
            <div class="text-sm font-semibold leading-tight">{{ n.t }}</div>
          </div>
        }
      </div>
    </section>

    <!-- Who we serve -->
    <section class="wrap mt-24">
      <h2 class="h-display text-3xl md:text-5xl">Who we serve</h2>
      <div class="mt-10 grid gap-4 md:grid-cols-3">
        @for (g of groups; track g.title) {
          <div class="rounded-3xl p-7 md:p-8" [class]="g.card">
            <span class="flex size-12 items-center justify-center rounded-xl" [class]="g.icon"><app-icon [name]="g.ic" /></span>
            <h3 class="mt-5 text-2xl font-semibold tracking-tight">{{ g.title }}</h3>
            <ul class="mt-5 space-y-3">
              @for (s of g.items; track s) {
                <li class="flex items-start gap-3 text-[15px]">
                  <span class="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[11px]" [class]="g.tick">✓</span>{{ s }}
                </li>
              }
            </ul>
          </div>
        }
      </div>
    </section>

    <!-- Client journey -->
    <section class="wrap mt-24">
      <div class="rounded-[2rem] bg-onyx px-6 py-12 text-white md:px-12 md:py-16">
        <h2 class="h-display text-3xl md:text-5xl">Client journey</h2>
        <p class="mt-3 max-w-lg text-[#bdbdbd]">Five clear steps keep every project accountable, from first conversation to long-term growth.</p>
        <ol class="relative mt-12 grid gap-8 lg:grid-cols-5 lg:gap-6">
          <span class="absolute left-6 right-6 top-6 hidden h-px bg-gradient-to-r from-brand via-[#6ca7ff] to-[#444] lg:block"></span>
          @for (j of journey; track j.t; let i = $index) {
            <li class="relative flex gap-4 lg:block">
              <span class="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full bg-brand text-lg font-semibold ring-8 ring-onyx">{{ i + 1 }}</span>
              <div class="lg:mt-5">
                <h3 class="text-lg font-semibold tracking-tight">{{ j.t }}</h3>
                <p class="mt-1.5 text-sm text-[#bdbdbd]">{{ j.d }}</p>
              </div>
            </li>
          }
        </ol>
      </div>
    </section>

    <app-cta />
  `,
})
export class Solutions {
  hub = HUB;
  journey = JOURNEY;
  hubIcons = ['consult', 'hr', 'train', 'hosp', 'trade', 'invest'];
  hubNodes = HUB.map((h, i) => {
    const a = ((-90 + i * 60) * Math.PI) / 180;
    return { ...h, icon: this.hubIcons[i], x: 50 + 38 * Math.cos(a), y: 50 + 38 * Math.sin(a) };
  });
  groups = [
    { title: 'Businesses & investors', ic: 'invest', items: [0, 1, 5, 6].map((i) => SERVE[i]),
      card: 'bg-mist', icon: 'bg-white text-brand shadow-sm', tick: 'bg-brand text-white' },
    { title: 'Hospitality & trade', ic: 'trade', items: [2, 3, 4, 8].map((i) => SERVE[i]),
      card: 'bg-gradient-to-br from-brand to-[#0a2250] text-white', icon: 'bg-white/15 text-white', tick: 'bg-white text-brand' },
    { title: 'Employers & people', ic: 'hr', items: [7, 9, 10, 11].map((i) => SERVE[i]),
      card: 'border border-ash bg-white', icon: 'bg-mist text-brand', tick: 'bg-ink text-white' },
  ];
}

/* ───────────── VISION 2030 ───────────── */
@Component({
  selector: 'app-vision',
  imports: [PageHead, Cta, Icon],
  template: `
<app-page-head crumb="Home / Vision 2030"
  title="Aligned with Saudi Vision 2030."
  [accent]="['Al', 'Vision 2030']"
  lead="Saudi Vision 2030 sets out the Kingdom’s plan to diversify the economy, grow the private sector and build a more connected, skilled and globally engaged nation. ADMISK’s divisions are designed to support these goals from Riyadh." />
    <!-- Image banner -->
    <section class="wrap mt-12">
      <div class="relative h-64 overflow-hidden rounded-[2rem] md:h-80">
        <img src="vision-30.png" alt="Riyadh skyline" loading="lazy" class="size-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-[#0a1230]/80 via-[#0a1230]/20 to-transparent"></div>
        <div class="absolute inset-x-6 bottom-6 flex flex-wrap items-end justify-between gap-4 text-white md:inset-x-10 md:bottom-8">
          <p class="max-w-md text-xl font-semibold leading-tight tracking-tight md:text-3xl">Riyadh-based · Vision 2030-aligned · Globally connected</p>
          <span class="rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur">6 national goals we support</span>
        </div>
      </div>
    </section>

    <!-- Goal cards -->
    <section class="wrap mt-4 grid gap-4 md:grid-cols-3">
      @for (v of items; track v.goal; let i = $index) {
        <article class="group relative flex flex-col overflow-hidden rounded-3xl p-7 transition duration-200 hover:-translate-y-1 hover:shadow-2xl md:p-8" [class]="cardClass[i]">
          <span class="pointer-events-none absolute -right-2 -top-4 select-none text-[120px] font-semibold leading-none tracking-tighter opacity-[0.07]">0{{ i + 1 }}</span>
          <span class="mb-6 flex size-12 items-center justify-center rounded-xl" [class]="iconClass[i]"><app-icon [name]="icons[i]" /></span>
          <div class="text-[13px] opacity-60">Vision 2030 goal</div>
          <h2 class="mt-1 text-2xl font-semibold leading-tight tracking-tight">{{ v.goal }}</h2>
          <p class="mt-4 max-w-xl text-[15px] opacity-80">{{ v.text }}</p>
          <div class="mt-auto flex flex-wrap gap-2 pt-6">
            @for (w of v.who.split(' · '); track w) {
              <span class="rounded-full px-3 py-1 text-xs font-medium" [class]="chipClass[i]">{{ w }}</span>
            }
          </div>
        </article>
      }
    </section>

    <p class="wrap mt-6 text-center text-[13px] text-slate">Saudi Vision 2030 is the Kingdom of Saudi Arabia’s national development framework.</p>
    <app-cta />
  `,
})
export class Vision {
  items = VISION;
  media = MEDIA;
  icons = ['invest', 'globe', 'train', 'hosp', 'trade', 'foundation'];
  cardClass = [
    'md:col-span-2 bg-gradient-to-br from-[#14275e] to-onyx text-white',
    'bg-mist',
    'bg-mist',
    'md:col-span-2 bg-gradient-to-br from-brand to-[#0a2250] text-white',
    'md:col-span-2 border border-ash bg-white',
    'bg-onyx text-white',
  ];
  iconClass = [
    'bg-white/15 text-white', 'bg-white text-brand shadow-sm', 'bg-white text-brand shadow-sm',
    'bg-white/15 text-white', 'bg-mist text-brand', 'bg-white/15 text-white',
  ];
  chipClass = [
    'bg-white/15 text-white', 'bg-white text-ink', 'bg-white text-ink',
    'bg-white/15 text-white', 'bg-mist text-ink', 'bg-white/15 text-white',
  ];
}

/* ───────────── WHY ADMISK ───────────── */
@Component({
  selector: 'app-why',
  imports: [PageHead, Cta],
  template: `
<app-page-head crumb="Home / Why ADMISK"
  title="Why partner with ADMISK."
  [accent]="['Why', 'ADMISK']"
  lead="One accountable group, with clear responsibilities, transparent terms and documented approvals." />    <section class="wrap mt-16 grid gap-4 md:grid-cols-3">@for (w of why; track w.t) { <div class="rounded-lg border border-ash p-7"><h3 class="text-xl font-semibold tracking-tight">{{ w.t }}</h3><p class="mt-3 text-sm text-slate">{{ w.d }}</p></div> }</section>
    <section class="wrap mt-20">
      <h2 class="h-display text-3xl md:text-4xl">Partner operating principles</h2>
      <div class="mt-8 grid gap-x-12 md:grid-cols-2">@for (p of principles; track p) { <div class="arrow-row">{{ p }}</div> }</div>
    </section>
    <section class="wrap mt-20 grid gap-4 md:grid-cols-2">
      <div class="rounded-lg bg-mist p-8"><h3 class="text-2xl font-semibold tracking-tight">Governance &amp; compliance</h3><p class="mt-3 text-slate">ADMISK is committed to operating within applicable laws, regulations and licensing requirements in each country where the group operates (Saudi Arabia, Kenya and Uganda), across the holding group and every division beneath it. Specific activities are marketed and delivered only within the scope of each entity’s approved commercial activities and any required professional or sector licenses.</p></div>
      <div class="rounded-lg bg-onyx p-8 text-white"><h3 class="text-2xl font-semibold tracking-tight">Licensed partners</h3><p class="mt-3 text-[#bdbdbd]">Where a service is regulated or requires a specialist license, including legal services and regulated financial activities, we work with appropriately licensed partners and professionals.</p></div>
    </section>
    <app-cta />
  `,
})
export class Why { why = WHY; principles = PRINCIPLES; }

const ROAD = 'M627 860C618 846 595 808 575 775C555 742 527 695 505 660C483 625 460 589 445 565C430 541 416 528 415 515C414 502 420 494 438 490C456 486 486 486 520 490C554 494 601 507 640 512C679 517 726 525 755 522C784 519 802 505 812 492C822 479 822 459 815 445C808 431 789 416 770 408C751 400 720 401 700 395C680 389 656 383 650 372C644 361 652 343 665 330C678 317 708 303 730 292C752 281 777 273 800 262C823 251 846 241 870 228C894 215 920 191 945 185C970 179 994 185 1020 190C1046 195 1077 212 1100 215C1123 218 1138 213 1160 205C1182 197 1218 172 1230 165';

@Component({
  selector: 'app-roadmap',
  imports: [PageHead, Cta, Icon],
  template: `
<app-page-head crumb="Home / Roadmap"
  title="Growth roadmap 2026–2027."
  [accent]="['Growth', '2026–2027']"
  lead="Four phases from building the platform to scaling the strongest divisions." />
    <!-- Wide screens: winding road -->
    <section class="wrap mt-16 hidden xl:block">
      <div class="relative aspect-[1200/800] w-full overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#f4f6fb] to-white ring-1 ring-ash">
        <span class="pointer-events-none absolute left-8 top-6 select-none text-[72px] font-semibold leading-none tracking-tight text-ink/[0.05]">2026–27</span>

        <svg viewBox="0 0 1200 800" class="absolute inset-0 size-full" aria-hidden="true">
          <path [attr.d]="road" fill="none" stroke="#1d1d1f" stroke-width="58" stroke-linecap="round" stroke-linejoin="round" />
          <path [attr.d]="road" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="2.5" stroke-dasharray="9 11" />
        </svg>

        @for (n of nodes; track n.icon; let i = $index) {
          @let p = phases[i];

          <div class="absolute -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_12px_20px_rgba(20,110,245,.45)]"
               [style.left.%]="n.x / 12" [style.top.%]="n.y / 8">
            <div class="hex flex size-[92px] items-center justify-center bg-brand/25">
              <div class="hex flex size-[68px] items-center justify-center bg-gradient-to-br from-[#4d9bff] to-brand text-white">
                <app-icon [name]="n.icon" [size]="28" />
              </div>
            </div>
          </div>

          <div class="absolute w-56" [class]="n.label.align"
               [style.left.%]="n.label.l" [style.right.%]="n.label.r" [style.top.%]="n.label.t">
            <div class="text-xs font-semibold text-brand">Phase {{ i + 1 }}</div>
            <h3 class="text-xl font-semibold tracking-tight">{{ p.t }}</h3>
            <div class="mt-0.5 text-sm font-medium text-brand">{{ p.s }}</div>
            <p class="mt-1 text-sm leading-snug text-slate">{{ p.d }}</p>
          </div>
        }
      </div>
    </section>

    <!-- Smaller screens: vertical road -->
    <section class="wrap mt-12 xl:hidden">
      <div class="relative">
        <div class="absolute bottom-0 left-[22px] top-0 w-3 rounded-full bg-onyx">
          <div class="mx-auto h-full w-0.5 bg-[repeating-linear-gradient(to_bottom,#fff_0_8px,transparent_8px_18px)] opacity-70"></div>
        </div>
        @for (p of phases; track p.t; let i = $index) {
          <div class="relative pb-10 pl-20 last:pb-0">
            <div class="absolute left-0 top-0 drop-shadow-[0_8px_14px_rgba(20,110,245,.4)]">
              <div class="hex flex size-14 items-center justify-center bg-gradient-to-br from-[#4d9bff] to-brand text-white">
                <app-icon [name]="nodes[i].icon" [size]="24" />
              </div>
            </div>
            <div class="text-xs font-semibold text-brand">Phase {{ i + 1 }}</div>
            <h3 class="text-xl font-semibold tracking-tight">{{ p.t }}</h3>
            <div class="mt-0.5 text-sm font-medium text-brand">{{ p.s }}</div>
            <p class="mt-1 text-sm text-slate">{{ p.d }}</p>
          </div>
        }
      </div>
    </section>

    <section class="wrap mt-16"><div class="rounded-lg bg-gradient-to-br from-brand to-[#0a2250] p-10 text-white"><div class="text-sm opacity-80">2027 strategic objective</div><div class="mt-2 text-3xl font-semibold tracking-tight md:text-5xl">6 Business Divisions · 3 Offices · 20+ Corporate Clients</div><p class="mt-4 opacity-90">Supporting Saudi Vision 2030 by connecting Africa, the GCC, Asia, Europe and the USA.</p></div></section>
    <app-cta />
  `,
})
export class Roadmap {
  phases = ROADMAP;
  road = ROAD;
  nodes = [
    { x: 505, y: 660, icon: 'foundation', label: { l: null, r: 63.1, t: 76.9, align: 'text-right' } },
    { x: 415, y: 515, icon: 'hr',         label: { l: null, r: 70.6, t: 56.3, align: 'text-right' } },
    { x: 755, y: 522, icon: 'invest',     label: { l: 64.2, r: null, t: 72.5, align: 'text-left' } },
    { x: 945, y: 185, icon: 'globe',      label: { l: null, r: 28.75, t: 3.1, align: 'text-right' } },
  ];
}

/* ───────────── CONTACT ───────────── */
@Component({
  selector: 'app-contact',
  imports: [PageHead],
  template: `
    <app-page-head crumb="Home / Contact" title="Let’s talk about your business." lead="One point of contact for investment, people, training, hospitality and trade." />
    <section class="wrap mt-16 grid items-start gap-10 md:grid-cols-[1fr_1.1fr]">
      <div class="grid gap-3">
        @for (o of offices; track o.key) { <div class="rounded-lg border border-ash p-5"><h3 class="font-semibold">{{ o.name }}</h3><p class="mt-1 text-sm">{{ o.address }}</p><a [href]="'tel:' + o.phone.replaceAll(' ', '')" class="text-sm text-slate hover:underline">{{ o.phone }}</a>@if (o.alternatePhone) { <span class="text-sm text-slate"> or </span><a [href]="'tel:' + o.alternatePhone.replaceAll(' ', '')" class="text-sm text-slate hover:underline">{{ o.alternatePhone }}</a> }</div> }
        <div class="rounded-lg border border-ash p-5"><h3 class="font-semibold">Email</h3><a [href]="'mailto:' + email" class="text-sm hover:underline">{{ email }}</a></div>
      </div>
      <form #f class="grid gap-4 rounded-lg border border-ash p-6 shadow-xl md:grid-cols-2 md:p-8" (submit)="$event.preventDefault(); send(f)">
        <h2 class="text-2xl font-semibold tracking-tight md:col-span-2">Send us a message</h2>
        <label class="text-[13px] text-slate">Full name<input name="name" required class="mt-1.5 block w-full rounded border border-ash p-2.5 text-sm text-ink"></label>
        <label class="text-[13px] text-slate">Company<input name="company" class="mt-1.5 block w-full rounded border border-ash p-2.5 text-sm text-ink"></label>
        <label class="text-[13px] text-slate">Email<input name="email" type="email" required class="mt-1.5 block w-full rounded border border-ash p-2.5 text-sm text-ink"></label>
        <label class="text-[13px] text-slate">Phone<input name="phone" class="mt-1.5 block w-full rounded border border-ash p-2.5 text-sm text-ink"></label>
        <label class="text-[13px] text-slate">Division of interest
          <select name="division" class="mt-1.5 block w-full rounded border border-ash bg-white p-2.5 text-sm text-ink"><option>Not sure yet</option>@for (d of divisions; track d.slug) { <option>{{ d.title }}</option> }</select></label>
        <label class="text-[13px] text-slate">Country<input name="country" class="mt-1.5 block w-full rounded border border-ash p-2.5 text-sm text-ink"></label>
        <label class="text-[13px] text-slate md:col-span-2">Message<textarea name="message" rows="5" required class="mt-1.5 block w-full rounded border border-ash p-2.5 text-sm text-ink"></textarea></label>
        <div class="md:col-span-2"><button class="btn" type="submit">Send message</button><p class="mt-3 text-xs text-slate">This opens your email app with the message ready to send. The company profile says a partner reviews inquiries within one business day.</p></div>
      </form>
    </section>
    <div class="h-24"></div>
  `,
})
export class Contact {
  offices = OFFICES; divisions = DIVISIONS; email = COMPANY.email;
  send(f: HTMLFormElement) {
    const d = new FormData(f);
    const body = ['name', 'company', 'email', 'phone', 'division', 'country', 'message'].map((k) => `${k}: ${d.get(k) ?? ''}`).join('\n');
    window.location.href = `mailto:${this.email}?subject=${encodeURIComponent('Website enquiry – ' + (d.get('division') ?? ''))}&body=${encodeURIComponent(body)}`;
  }
}
