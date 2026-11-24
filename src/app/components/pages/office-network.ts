import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import type * as THREE from 'three';
import type ThreeGlobe from 'three-globe';
import type { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Preloader as PercentPreloader } from '../shared/preloader-percent';
import { OFFICES } from '../../content';

type Office = (typeof OFFICES)[number];
type GlobeOffice = Office & {
  size: number;
  color: string;
  abbreviation: string;
};
type OfficeArc = {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string[];
};
type OfficeRing = {
  lat: number;
  lng: number;
  color: string;
  maxR: number;
  propagationSpeed: number;
  repeatPeriod: number;
};

// Shift the supplied day-map features west to align them with the office coordinates.
const DAY_TEXTURE_LONGITUDE_OFFSET = 1 / 360; // 180 degrees in normalized texture coordinates (0-1)
const DAY_OFFICE_LATITUDE_OFFSET = -12;


@Component({
  selector: 'app-office-network',
  imports: [PercentPreloader],
  template: `
    @if (showLoader()) {
      <app-preloader
        [duration]="8000"
        [imagesReady]="!globeLoading()"
        [oncePerSession]="false"
        (completed)="showLoader.set(false)"
      />
    }

    <section [class.office-network--day]="theme() === 'day'" class="office-network">
      <div class="network-backdrop" aria-hidden="true">
        <div class="network-glow network-glow--left"></div>
        <div class="network-glow network-glow--right"></div>
        <div class="network-grid"></div>
        <div class="network-scanline"></div>
      </div>

      <header class="network-header">
        <!-- <div class="network-eyebrow"><span></span> Our global footprint</div> -->
        <h1>One world.<br class="sm:hidden"> <span>Seven local connections.</span></h1>
        <p>Explore the offices connecting our clients to opportunities across the GCC, Africa and the USA.</p>
        <button type="button" class="theme-toggle" (click)="toggleTheme()" [attr.aria-pressed]="theme() === 'day'">
          <span class="theme-toggle-icon">{{ theme() === 'day' ? '🌙' : '☀️' }}</span>
          <span class="theme-toggle-label">{{ theme() === 'day' ? 'Night mode' : 'Day mode' }}</span>
        </button>
        <div class="network-stats" aria-label="Network statistics">
          <div><strong>{{ offices.length }}</strong><span>Office locations</span></div>
          <i></i>
          <div><strong>3</strong><span>Regions connected</span></div>
          <i></i>
          <div><strong>1</strong><span>Global network</span></div>
        </div>
      </header>

      <div class="network-layout">
        <aside class="office-list" aria-label="Office locations">
          <div class="list-heading">
            <div>
              <span class="section-kicker">Our locations</span>
              <h2>Select an office</h2>
            </div>
            <button type="button" class="reset-button" (click)="selectOffice(headquarters)">Reset</button>
          </div>

          <div class="office-options">
            @for (office of offices; track office.key; let i = $index) {
              <button
                type="button"
                class="office-option"
                [class.office-option--active]="selectedOffice().key === office.key"
                [attr.aria-pressed]="selectedOffice().key === office.key"
                (click)="selectOffice(office)"
              >
                <span class="office-code">{{ countryCode(office) }}</span>
                <span class="office-option-copy">
                  <span class="office-option-title">{{ office.city }}</span>
                  <span class="office-option-country">{{ office.key }}</span>
                </span>
                @if (office.key === headquarters.key) {
                  <span class="hq-tag">HQ</span>
                }
              </button>
            }
          </div>
          <p class="list-footnote"><span></span> All locations connected to Riyadh headquarters</p>
        </aside>

        <main class="globe-column" aria-label="Interactive globe showing office locations">
          <div class="globe-stage" (mouseenter)="setGlobeHover(true)" (mouseleave)="setGlobeHover(false)">
            <div class="globe-halo" aria-hidden="true"></div>
            <div class="globe-orbit globe-orbit--solid" aria-hidden="true"></div>
            <div class="globe-orbit globe-orbit--dashed" aria-hidden="true"></div>
            <div #globeCanvas class="globe-canvas"></div>
            <div #officeImageCard class="globe-office-card" [attr.aria-label]="'Image of ' + selectedOffice().city">
              <img [src]="selectedOffice().image" [alt]="selectedOffice().city" loading="lazy" />
              <span>{{ selectedOffice().city }}</span>
            </div>
            @if (globeError()) {
              <div class="globe-message globe-message--error" role="status">
                The interactive globe could not be loaded. Office locations are still available in the list.
              </div>
            }
            <div class="globe-caption"><span></span> LIVE OFFICE NETWORK</div>
            <div class="globe-controls-hint">Drag to rotate <span>·</span> Scroll to zoom</div>
          </div>
        </main>

        <aside class="office-details" aria-live="polite" aria-label="Selected office details">
          <div class="details-topline">
            <span class="live-pulse"></span>
            <span>{{ selectedOffice().key === headquarters.key ? 'Global headquarters' : 'Regional office' }}</span>
          </div>
          <p class="details-country">{{ selectedOffice().key }}</p>
          <h2>{{ selectedOffice().city }}</h2>
          <div class="details-rule"></div>
          <div class="detail-row">
            <span class="detail-icon" aria-hidden="true">⌖</span>
            <div><span class="detail-label">Address</span><p>{{ selectedOffice().address }}</p></div>
          </div>
          @if (selectedOffice().phone) {
            <div class="detail-row">
              <span class="detail-icon" aria-hidden="true">↗</span>
              <div>
                <span class="detail-label">Phone</span>
                <a [href]="'tel:' + selectedOffice().phone.replaceAll(' ', '')">{{ selectedOffice().phone }}</a>
                @if (selectedOffice().alternatePhone) {
                  <a class="alternate-phone" [href]="'tel:' + selectedOffice().alternatePhone.replaceAll(' ', '')">
                    {{ selectedOffice().alternatePhone }}
                  </a>
                }
              </div>
            </div>
          }
          <div class="details-footer">
            <span class="details-footer-mark">A</span>
            <span>ADHMISK<br><small>Connected worldwide</small></span>
          </div>
        </aside>
      </div>
    </section>
  `,
  styleUrl: './office-network.css',
})
export class OfficeNetwork {
  offices = OFFICES;
  headquarters = OFFICES[0];
  selectedOffice = signal<Office>(this.headquarters);
  theme = signal<'day' | 'night'>('night');
  showLoader = signal(true);
  globeLoading = signal(true);
  globeError = signal(false);

  private readonly globeCanvas = viewChild.required<ElementRef<HTMLDivElement>>('globeCanvas');
  private readonly officeImageCard = viewChild.required<ElementRef<HTMLDivElement>>('officeImageCard');
  private readonly destroyRef = inject(DestroyRef);
  private globe?: ThreeGlobe;
  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private controls?: OrbitControls;
  private resizeObserver?: ResizeObserver;
  private appliedGlobeTexture?: THREE.Texture;
  private frameId?: number;
  private focusFrameId?: number;
  private destroyed = false;
  private pointerOnGlobe = false;
  private focusing = false;

  constructor() {
    this.theme.set(this.computeTheme());
    afterNextRender(() => void this.initializeGlobe());
    this.destroyRef.onDestroy(() => this.disposeGlobe());
  }

  private computeTheme(): 'day' | 'night' {
    const hour = new Date().getHours();
    return hour >= 6 && hour < 18 ? 'day' : 'night';
  }

  toggleTheme(): void {
    this.theme.set(this.theme() === 'day' ? 'night' : 'day');
    this.applyThemeToGlobe();
  }

  private applyThemeToGlobe(): void {
    if (!this.globe) return;
    const isDay = this.theme() === 'day';
    this.globe
      .globeImageUrl(isDay ? '/earth/earth-day.png' : '/earth/earth-night.jpg')
      .showAtmosphere(isDay ? false : true)
      .atmosphereColor(isDay ? '#9ec5fe' : '#22d3ee')
      .atmosphereAltitude(isDay ? 0.12 : 0.18)
      .arcStroke(isDay ? 1.2 : 0.45);
    this.updateGlobeData();
  }

  countryCode(office: Office): string {
    if (office.key === 'Saudi Arabia') return 'SA';
    if (office.key === 'Tanzania') return 'TZ';
    if (office.key === 'USA') return 'US';
    return office.key.slice(0, 2).toUpperCase();
  }

  private latitudeFor(office: Office): number {
    return office.lat + (this.theme() === 'day' ? DAY_OFFICE_LATITUDE_OFFSET : 0);
  }

  selectOffice(office: Office): void {
    this.selectedOffice.set(office);
    this.updateGlobeData();
    this.focusOffice(office);
  }

  setGlobeHover(isHovering: boolean): void {
    this.pointerOnGlobe = isHovering;
    if (this.controls && !this.focusing) {
      this.controls.autoRotate = !isHovering;
    }
  }

  private async initializeGlobe(): Promise<void> {
    try {
      const [{ default: Globe }, THREE, { OrbitControls }] = await Promise.all([
        import('three-globe'),
        import('three'),
        import('three/addons/controls/OrbitControls.js'),
      ]);
      if (this.destroyed) return;

      const container = this.globeCanvas().nativeElement;
      const bounds = container.getBoundingClientRect();
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
      renderer.setSize(bounds.width, bounds.height);
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      scene.add(new THREE.AmbientLight(0xcccccc, Math.PI));
      scene.add(new THREE.DirectionalLight(0xffffff, 0.6 * Math.PI));

      const camera = new THREE.PerspectiveCamera(45, bounds.width / bounds.height, 0.1, 2000);
      const isDay = this.theme() === 'day';
      const globe = new Globe({ waitForGlobeReady: true, animateIn: true })
        .globeImageUrl(isDay ? '/earth/earth-day.png' : '/earth/earth-night.jpg')
        .showAtmosphere(isDay ? false : true)
        .atmosphereColor(isDay ? '#9ec5fe' : '#22d3ee')
        .atmosphereAltitude(isDay ? 0.12 : 0.18)
        .pointLat('lat')
        .pointLng('lng')
        .pointAltitude(0.025)
        .pointRadius('size')
        .pointColor('color')
        .pointResolution(16)
        .pointsMerge(false)
        .arcStartLat('startLat')
        .arcStartLng('startLng')
        .arcEndLat('endLat')
        .arcEndLng('endLng')
        .arcColor('color')
        .arcAltitudeAutoScale(0.45)
        .arcStroke(isDay ? 1.2 : 0.45)
        .arcDashLength(0.35)
        .arcDashGap(0.8)
        .arcDashInitialGap(() => Math.random())
        .arcDashAnimateTime(1800)
        .ringLat('lat')
        .ringLng('lng')
        .ringColor('color')
        .ringMaxRadius('maxR')
        .ringPropagationSpeed('propagationSpeed')
        .ringRepeatPeriod('repeatPeriod')
        .labelLat('lat')
        .labelLng('lng')
        .labelText('abbreviation')
        .labelColor('labelColor')
        .labelSize(0.7)
        .labelAltitude(0.04)
        .labelIncludeDot(true)
        .labelDotRadius(0.2)
        .onGlobeReady(() => this.globeLoading.set(false));

      scene.add(globe);
      this.globe = globe;
      this.renderer = renderer;
      this.scene = scene;
      this.camera = camera;
      const view = globe.getCoords(this.latitudeFor(this.headquarters), this.headquarters.lng, 2.5);
      camera.position.set(view.x, view.y, view.z).normalize().multiplyScalar(360);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.enableZoom = true;
      controls.enablePan = false;
      controls.minDistance = 180;
      controls.maxDistance = 500;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.35;
      this.controls = controls;

      this.updateGlobeData();
      this.resizeObserver = new ResizeObserver(() => this.resizeGlobe());
      this.resizeObserver.observe(container);

      const officePosition = new THREE.Vector3();
      const officeCard = this.officeImageCard().nativeElement;
      const render = () => {
        if (this.destroyed || !this.renderer || !this.scene || !this.camera || !this.controls || !this.globe) return;
        this.frameId = requestAnimationFrame(render);
        this.controls.update();
        scene.updateMatrixWorld(true);
        camera.updateMatrixWorld(true);
        this.globe.setPointOfView(this.camera);
        const material = globe.globeMaterial();
        if (material instanceof THREE.MeshPhongMaterial && material.map && material.map !== this.appliedGlobeTexture) {
          material.map.wrapS = THREE.RepeatWrapping;
          material.map.offset.x = this.theme() === 'day' ? DAY_TEXTURE_LONGITUDE_OFFSET : 0;

          material.map.needsUpdate = true;
          this.appliedGlobeTexture = material.map;
        }

        const office = this.selectedOffice();
        const coords = globe.getCoords(this.latitudeFor(office), office.lng, 0.04);
        officePosition
          .set(coords.x, coords.y, coords.z)
          .applyMatrix4(globe.matrixWorld);
        const isFacingCamera = officePosition.dot(camera.position) > 0;
        officePosition.project(camera);

        const width = container.clientWidth;
        const height = container.clientHeight;
        const x = ((officePosition.x + 1) / 2) * width;
        const y = ((1 - officePosition.y) / 2) * height;
        const cardWidth = Math.min(160, width * 0.32);
        const cardHeight = cardWidth * 0.625 + 34;
        const isVisible =
          isFacingCamera &&
          officePosition.z >= -1 &&
          officePosition.z <= 1 &&
          x >= cardWidth / 2 + 8 &&
          x <= width - cardWidth / 2 - 8 &&
          y >= cardHeight + 14 &&
          y <= height;
        officeCard.style.left = `${x}px`;
        officeCard.style.top = `${y}px`;
        officeCard.style.visibility = isVisible ? 'visible' : 'hidden';

        this.renderer.render(this.scene, this.camera);
      };
      render();
    } catch (error) {
      if (this.destroyed) return;
      console.error('Unable to initialize the office network globe.', error);
      this.globeLoading.set(false);
      this.globeError.set(true);
    }
  }

  private getPoints(): GlobeOffice[] {
    const activeKey = this.selectedOffice().key;
    const isDay = this.theme() === 'day';
    return this.offices.map((office) => ({
      ...office,
      lat: this.latitudeFor(office),
      size: office.key === activeKey
        ? (isDay ? 1.8 : 1.4)
        : (isDay ? 0.9 : 0.55),
      color: office.key === activeKey
        ? (isDay ? '#fff200' : '#22d3ee')
        : (isDay ? '#fff200' : '#34d399'),
      abbreviation: this.countryCode(office),
    }));
  }

  private getArcs(): OfficeArc[] {
    const activeKey = this.selectedOffice().key;
    const isDay = this.theme() === 'day';
    return this.offices
      .filter((office) => office.key !== this.headquarters.key)
      .map((office) => ({
        startLat: this.latitudeFor(this.headquarters),
        startLng: this.headquarters.lng,
        endLat: this.latitudeFor(office),
        endLng: office.lng,
        color: office.key === activeKey
          ? (isDay ? ['#fff200', '#fff200'] : ['#22d3ee', '#ffffff'])
          : (isDay
            ? ['#fff200', '#fff200']
            : ['rgba(52,211,153,0.75)', 'rgba(34,211,238,0.15)']),
      }));
  }

  private getRings(): OfficeRing[] {
    const activeKey = this.selectedOffice().key;
    const isDay = this.theme() === 'day';
    return this.offices.map((office) => ({
      lat: this.latitudeFor(office),
      lng: office.lng,
      color: office.key === activeKey
        ? (isDay ? '#fff200' : '#22d3ee')
        : (isDay ? '#fff200' : '#34d399'),
      maxR: office.key === activeKey ? (isDay ? 5 : 4) : (isDay ? 3 : 2.2),
      propagationSpeed: 2,
      repeatPeriod: office.key === activeKey ? 900 : 1800,
    }));
  }

  private updateGlobeData(): void {
    this.globe
      ?.pointsData(this.getPoints())
      .arcsData(this.getArcs())
      .ringsData(this.getRings())
      .labelsData(this.offices.map((office) => ({
        ...office,
        lat: this.latitudeFor(office),
        abbreviation: this.countryCode(office),
        labelColor: this.theme() === 'day'
          ? (office.key === this.selectedOffice().key ? '#080808' : 'rgba(8,8,8,0.65)')
          : (office.key === this.selectedOffice().key ? '#ffffff' : 'rgba(255,255,255,0.65)'),
      })));
  }

  private focusOffice(office: Office): void {
    if (!this.globe || !this.camera || !this.controls) return;
    if (this.focusFrameId !== undefined) cancelAnimationFrame(this.focusFrameId);

    const coords = this.globe.getCoords(this.latitudeFor(office), office.lng, 2.5);
    const destination = this.camera.position
      .clone()
      .set(coords.x, coords.y, coords.z)
      .normalize()
      .multiplyScalar(330);
    const start = this.camera.position.clone();
    const startTime = performance.now();
    this.focusing = true;
    this.controls.autoRotate = false;

    const animateFocus = (now: number) => {
      if (!this.camera || !this.controls || this.destroyed) return;
      const progress = Math.min((now - startTime) / 1200, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      this.camera.position.lerpVectors(start, destination, eased);
      this.controls.update();
      if (progress < 1) {
        this.focusFrameId = requestAnimationFrame(animateFocus);
      } else {
        this.focusFrameId = undefined;
        this.focusing = false;
        this.controls.autoRotate = !this.pointerOnGlobe;
      }
    };
    this.focusFrameId = requestAnimationFrame(animateFocus);
  }

  private resizeGlobe(): void {
    if (!this.renderer || !this.camera) return;
    const { width, height } = this.globeCanvas().nativeElement.getBoundingClientRect();
    if (!width || !height) return;
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  private disposeGlobe(): void {
    this.destroyed = true;
    if (this.frameId !== undefined) cancelAnimationFrame(this.frameId);
    if (this.focusFrameId !== undefined) cancelAnimationFrame(this.focusFrameId);
    this.resizeObserver?.disconnect();
    this.controls?.dispose();
    this.globe?.pauseAnimation();
    if (this.globe) {
      this.scene?.remove(this.globe);
      this.globe._destructor();
    }
    this.renderer?.dispose();
    this.renderer?.domElement.remove();
  }
}
