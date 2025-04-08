import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerEstablishmentPage } from './per-establishment.page';

describe('PerEstablishmentPage', () => {
  let component: PerEstablishmentPage;
  let fixture: ComponentFixture<PerEstablishmentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PerEstablishmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
