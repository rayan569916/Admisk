import { Component, computed, input, OnDestroy, OnInit, signal, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AUDIENCES, COMPANY, DIVISIONS, HUB, JOURNEY, OFFICES, PRINCIPLES, ROADMAP, SERVE, STATS, VALUES, VISION, WHY } from '../../content';
import { MEDIA } from '../../media';
import { Cta, Icon, PageHead } from '../../ui';

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
            link: 'InvestAdvise.png'
        },
        {
            title: 'Hire & train',
            text: 'Recruit and upskill work-ready teams.',
            icon: 'hr',
            link: 'HireTrain.png'
        },
        {
            title: 'Source & ship',
            text: 'Import, export and supplier sourcing.',
            icon: 'trade',
            link: 'SourceShip.png'
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
    };

    @HostListener('window:resize')
    onResize(): void {
        this.updateViewport();
        this.updateStatsViewport();
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
    <app-page-head crumb="Home / About" title="A cross-border business holding group, headquartered in Riyadh." lead="ADMISK Investment Limited oversees six specialized divisions across Saudi Arabia, Kenya and Uganda." />
    <section class="wrap grid items-center gap-10 pt-20 md:grid-cols-2">
      <div>
        <h2 class="h-display text-3xl md:text-4xl">Who we are</h2>
        <p class="lead mt-5">We help businesses and individuals identify opportunities, build capable teams, stay compliant with local regulations, improve operations and connect with reliable commercial partners, moving people, capital and projects from country to country under a single accountable group.</p>
      </div>
      <img [src]="media.about" alt="" loading="lazy" class="aspect-[3/2] w-full rounded-lg bg-mist object-cover">
    </section>
    <section class="wrap mt-20 grid gap-4 md:grid-cols-2">
      <div class="rounded-lg border border-ash p-8"><h3 class="text-2xl font-semibold tracking-tight">Our vision</h3><p class="mt-3 text-slate">To build a trusted Saudi-based business holding group that connects investors, entrepreneurs and companies with practical strategies, qualified people and commercial opportunities.</p></div>
      <div class="rounded-lg border border-ash p-8"><h3 class="text-2xl font-semibold tracking-tight">Our mission</h3><p class="mt-3 text-slate">To connect businesses across Africa, the GCC, Asia, Europe and the USA through a coordinated group of specialized divisions delivering professional, responsive and commercially focused solutions that help clients enter markets, build teams, source products and grow sustainably.</p></div>
    </section>
    <section class="wrap mt-20">
      <h2 class="h-display text-3xl md:text-4xl">Our core values</h2>
      <div class="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4">@for (v of values; track v) { <div class="rounded-lg bg-mist p-6 font-medium">{{ v }}</div> }</div>
    </section>
    <section class="wrap mt-20">
      <h2 class="h-display text-3xl md:text-4xl">Our holding structure</h2>
      <p class="lead mt-4 max-w-3xl">A single parent company provides central governance, brand, compliance oversight and client relationships, with six specialized divisions delivering focused services beneath it.</p>
      <div class="mt-10 rounded-lg bg-onyx p-8 text-white">
        <div class="mx-auto max-w-sm rounded bg-brand p-4 text-center font-semibold">ADMISK INVESTMENT LIMITED<div class="text-xs font-normal opacity-80">Holding group · Riyadh · Nairobi · Kampala</div></div>
        <div class="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">@for (d of divisions; track d.slug) { <a [routerLink]="['/divisions', d.slug]" class="rounded border border-[#444] p-4 text-sm hover:bg-[#222]">{{ d.title }}</a> }</div>
        <p class="mt-6 text-center text-sm text-[#bdbdbd]">Six specialized divisions, one accountable holding group.</p>
      </div>
    </section>
    <section class="wrap mt-20 grid gap-4 md:grid-cols-3">
      @for (o of offices; track o.key) {
        <div class="overflow-hidden rounded-lg border border-ash"><img [src]="media[o.key]" [alt]="o.city" loading="lazy" class="h-40 w-full bg-mist object-cover"><div class="p-5"><h3 class="font-semibold">{{ o.name }}</h3><p class="mt-1 text-sm text-slate">{{ o.address }}<br>{{ o.phone }}</p></div></div>
      }
    </section>
    <app-cta />
  `,
})
export class About {
    media: Record<string, string> = MEDIA as unknown as Record<string, string>;
    values = VALUES; divisions = DIVISIONS; offices = OFFICES;
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
        <img [src]="media.division[d.slug]" [alt]="d.title" class="aspect-[3/2] w-full rounded-lg bg-mist object-cover">
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
@Component({
    selector: 'app-solutions',
    imports: [PageHead, Cta],
    template: `
    <app-page-head crumb="Home / Solutions" title="An integrated holding platform, not a collection of unrelated services." lead="A client can enter through one division and access additional support from across the group as its needs develop." />
    <section class="wrap mt-16">
      <h2 class="h-display text-3xl md:text-4xl">How the divisions connect</h2>
      <div class="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">@for (h of hub; track h.t) { <div class="rounded-lg bg-mist p-6"><div class="text-sm text-slate">{{ h.k }}</div><div class="mt-1 text-xl font-semibold tracking-tight">{{ h.t }}</div></div> }</div>
    </section>
    <section class="wrap mt-20">
      <h2 class="h-display text-3xl md:text-4xl">Who we serve</h2>
      <div class="mt-8 flex flex-wrap gap-3">@for (s of serve; track s) { <span class="rounded border border-ash px-4 py-2 text-sm">{{ s }}</span> }</div>
    </section>
    <section class="wrap mt-20">
      <h2 class="h-display text-3xl md:text-4xl">Client journey</h2>
      <ol class="mt-8 grid gap-4 md:grid-cols-5">@for (j of journey; track j.t; let i = $index) { <li class="rounded-lg border border-ash p-5"><div class="text-sm text-brand">Step {{ i + 1 }}</div><h3 class="mt-1 text-lg font-semibold">{{ j.t }}</h3><p class="mt-2 text-sm text-slate">{{ j.d }}</p></li> }</ol>
    </section>
    <app-cta />
  `,
})
export class Solutions { hub = HUB; serve = SERVE; journey = JOURNEY; }

/* ───────────── VISION 2030 ───────────── */
@Component({
    selector: 'app-vision',
    imports: [PageHead, Cta],
    template: `
    <app-page-head crumb="Home / Vision 2030" title="Aligned with Saudi Vision 2030." lead="Saudi Vision 2030 sets out the Kingdom’s plan to diversify the economy, grow the private sector and build a more connected, skilled and globally engaged nation. ADMISK’s divisions are designed to support these goals from Riyadh." />
    <section class="mt-16 bg-onyx py-6 text-white">
      <div class="wrap">
        @for (v of items; track v.goal) {
          <div class="grid gap-4 border-t border-[#333] py-8 first:border-0 md:grid-cols-[1fr_1.3fr] md:gap-12">
            <div><div class="mb-2 text-[13px] text-[#8a8a8a]">Vision 2030 goal</div><div class="text-2xl font-semibold leading-tight tracking-tight">{{ v.goal }}</div></div>
            <div><div class="mb-1.5 font-medium">{{ v.who }}</div><p class="max-w-lg text-[15px] text-[#bdbdbd]">{{ v.text }}</p></div>
          </div>
        }
        <p class="border-t border-[#333] pt-5 text-[13px] text-[#8a8a8a]">Saudi Vision 2030 is the Kingdom of Saudi Arabia’s national development framework. Riyadh-based · Vision 2030-aligned · Globally connected.</p>
      </div>
    </section>
    <app-cta />
  `,
})
export class Vision { items = VISION; }

/* ───────────── WHY ADMISK ───────────── */
@Component({
    selector: 'app-why',
    imports: [PageHead, Cta],
    template: `
    <app-page-head crumb="Home / Why ADMISK" title="Why partner with ADMISK." lead="One accountable group, with clear responsibilities, transparent terms and documented approvals." />
    <section class="wrap mt-16 grid gap-4 md:grid-cols-3">@for (w of why; track w.t) { <div class="rounded-lg border border-ash p-7"><h3 class="text-xl font-semibold tracking-tight">{{ w.t }}</h3><p class="mt-3 text-sm text-slate">{{ w.d }}</p></div> }</section>
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

/* ───────────── ROADMAP ───────────── */
@Component({
    selector: 'app-roadmap',
    imports: [PageHead, Cta],
    template: `
    <app-page-head crumb="Home / Roadmap" title="Growth roadmap 2026–2027." lead="Four phases from building the platform to scaling the strongest divisions." />
    <section class="wrap mt-16 grid gap-4 md:grid-cols-4">
      @for (r of phases; track r.t; let i = $index) {
        <div class="rounded-lg border border-ash p-6"><div class="text-sm text-brand">Phase {{ i + 1 }}</div><h3 class="mt-1 text-xl font-semibold tracking-tight">{{ r.t }}</h3><div class="mt-1 text-sm font-medium">{{ r.s }}</div><p class="mt-3 text-sm text-slate">{{ r.d }}</p></div>
      }
    </section>
    <section class="wrap mt-16"><div class="rounded-lg bg-gradient-to-br from-brand to-[#0a2250] p-10 text-white"><div class="text-sm opacity-80">2027 strategic objective</div><div class="mt-2 text-3xl font-semibold tracking-tight md:text-5xl">6 Business Divisions · 3 Offices · 20+ Corporate Clients</div><p class="mt-4 opacity-90">Supporting Saudi Vision 2030 by connecting Africa, the GCC, Asia, Europe and the USA.</p></div></section>
    <app-cta />
  `,
})
export class Roadmap { phases = ROADMAP; }

/* ───────────── CONTACT ───────────── */
@Component({
    selector: 'app-contact',
    imports: [PageHead],
    template: `
    <app-page-head crumb="Home / Contact" title="Let’s talk about your business." lead="One point of contact for investment, people, training, hospitality and trade." />
    <section class="wrap mt-16 grid items-start gap-10 md:grid-cols-[1fr_1.1fr]">
      <div class="grid gap-3">
        @for (o of offices; track o.key) { <div class="rounded-lg border border-ash p-5"><h3 class="font-semibold">{{ o.name }}</h3><p class="mt-1 text-sm">{{ o.address }}</p><a [href]="'tel:' + o.phone.replaceAll(' ', '')" class="text-sm text-slate hover:underline">{{ o.phone }}</a></div> }
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
        <div class="md:col-span-2"><button class="btn" type="submit">Send message</button><p class="mt-3 text-xs text-slate">Opens your email app with the message ready to send. Connect a backend or form service later.</p></div>
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
