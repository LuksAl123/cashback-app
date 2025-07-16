import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class NavigationService {

  private url: string[] = [];

  constructor(private router: Router) {
    // Subscribe to router events to track navigation history
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Store the URL path segments
      const segments = event.urlAfterRedirects.split('/').filter(segment => segment);
      
      // If we're navigating to a new path (not just a refresh), add it to history
      if (segments.length > 0 && (this.url.length === 0 || segments.join('/') !== this.url.join('/'))) {
        this.url = segments;
      }
    });
  }

  getPreviousUrl(): string {
    // Remove the last segment to go back one level
    if (this.url.length > 1) {
      this.url.pop();
      return this.url.join('/');
    }
    // Return root if we can't go back further
    return '';
  }

  navigateTo(url: string): void {
    this.router.navigateByUrl('/' + url);
  }
}
