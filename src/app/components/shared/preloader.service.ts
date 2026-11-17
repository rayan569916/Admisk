import { Injectable, signal } from '@angular/core';

/**
 * Tiny bridge between the hero (which knows when its video is playing)
 * and the loading screen (which decides when to leave).
 */
@Injectable({ providedIn: 'root' })
export class PreloaderService {
  private readonly _heroReady = signal(false);

  /** true once the hero video is playing (or we know it never will, e.g. mobile / blocked autoplay) */
  readonly heroReady = this._heroReady.asReadonly();

  markReady(): void {
    this._heroReady.set(true);
  }
}
