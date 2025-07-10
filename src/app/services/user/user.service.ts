import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userIdSubject = new BehaviorSubject<number | null>(null);
  public userId$ = this.userIdSubject.asObservable();

  constructor() {}

  setUserId(userId: number): void {
    this.userIdSubject.next(userId);
    // Also store in localStorage for persistence
    localStorage.setItem('userId', userId.toString());
  }

  getUserId(): number | null {
    // Try to get from BehaviorSubject first
    const currentUserId = this.userIdSubject.value;
    if (currentUserId !== null) {
      return currentUserId;
    }
    // If not in BehaviorSubject, try to get from localStorage
    const storedUserId = localStorage.getItem('userId');
    return storedUserId ? parseInt(storedUserId, 10) : null;
  }

  clearUserId(): void {
    this.userIdSubject.next(null);
    localStorage.removeItem('userId');
  }
}
