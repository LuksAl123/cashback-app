import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class NavigationService {

  private url: string[] = [];

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const segments = event.urlAfterRedirects.split('/').filter(segment => segment);
      if (segments.length > 0 && (this.url.length === 0 || segments.join('/') !== this.url.join('/'))) {
        this.url = segments;
      }
    });
  }

  getPreviousUrl(): string {
    if (this.url.length > 1) {
      this.url.pop();
      return this.url.join('/');
    }
    return '';
  }

  navigateTo(url: string): void {
    this.router.navigateByUrl('/' + url);
  }
}