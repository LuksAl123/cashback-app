import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class GlobalService {

  constructor() { }

  public direction: 'forward' | 'backward' = 'forward';

}
