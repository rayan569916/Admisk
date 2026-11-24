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

    <section class="office-network">
      <div class="network-backdrop" aria-hidden="true">
        <div class="network-glow network-glow--left"></div>
        <div class="network-glow network-glow--right"></div>
        <div class="network-grid"></div>
        <div class="network-scanline"></div>
      </div>

      <header class="network-header">
        <div class="network-eyebrow"><span></span> Our global footprint</div>
        <h1>One world.<br class="sm:hidden"> <span>Seven local connections.</span></h1>
        <p>Explore the offices connecting our clients to opportunities across the GCC, Africa and the USA.</p>
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
  showLoader = signal(true);
  globeLoading = signal(true);
  globeError = signal(false);

  private readonly globeCanvas = viewChild.required<ElementRef<HTMLDivElement>>('globeCanvas');
  private readonly destroyRef = inject(DestroyRef);
  private globe?: ThreeGlobe;
  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private controls?: OrbitControls;
  private resizeObserver?: ResizeObserver;
  private frameId?: number;
  private focusFrameId?: number;
  private destroyed = false;
  private pointerOnGlobe = false;
  private focusing = false;

  constructor() {
    afterNextRender(() => void this.initializeGlobe());
    this.destroyRef.onDestroy(() => this.disposeGlobe());
  }

  countryCode(office: Office): string {
    if (office.key === 'Saudi Arabia') return 'SA';
    if (office.key === 'Tanzania') return 'TZ';
    if (office.key === 'USA') return 'US';
    return office.key.slice(0, 2).toUpperCase();
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
      const globe = new Globe({ waitForGlobeReady: true, animateIn: true })
        .globeImageUrl('/earth/earth-night.jpg')
        .showAtmosphere(true)
        .atmosphereColor('#22d3ee')
        .atmosphereAltitude(0.18)
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
        .arcStroke(0.45)
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
      const view = globe.getCoords(this.headquarters.lat, this.headquarters.lng, 2.5);
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

      const render = () => {
        if (this.destroyed || !this.renderer || !this.scene || !this.camera || !this.controls || !this.globe) return;
        this.frameId = requestAnimationFrame(render);
        this.controls.update();
        this.globe.setPointOfView(this.camera);
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
    return this.offices.map((office) => ({
      ...office,
      size: office.key === activeKey ? 1.4 : 0.55,
      color: office.key === activeKey ? '#22d3ee' : '#34d399',
      abbreviation: this.countryCode(office),
    }));
  }

  private getArcs(): OfficeArc[] {
    const activeKey = this.selectedOffice().key;
    return this.offices
      .filter((office) => office.key !== this.headquarters.key)
      .map((office) => ({
        startLat: this.headquarters.lat,
        startLng: this.headquarters.lng,
        endLat: office.lat,
        endLng: office.lng,
        color: office.key === activeKey
          ? ['#22d3ee', '#ffffff']
          : ['rgba(52,211,153,0.75)', 'rgba(34,211,238,0.15)'],
      }));
  }

  private getRings(): OfficeRing[] {
    const activeKey = this.selectedOffice().key;
    return this.offices.map((office) => ({
      lat: office.lat,
      lng: office.lng,
      color: office.key === activeKey ? '#22d3ee' : '#34d399',
      maxR: office.key === activeKey ? 4 : 2.2,
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
        abbreviation: this.countryCode(office),
        labelColor: office.key === this.selectedOffice().key ? '#ffffff' : 'rgba(255,255,255,0.65)',
      })));
  }

  private focusOffice(office: Office): void {
    if (!this.globe || !this.camera || !this.controls) return;
    if (this.focusFrameId !== undefined) cancelAnimationFrame(this.focusFrameId);

    const coords = this.globe.getCoords(office.lat, office.lng, 2.5);
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
