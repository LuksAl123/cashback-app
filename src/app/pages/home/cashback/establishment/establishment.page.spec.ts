import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EstablishmentPage } from './establishment.page';

describe('EstablishmentPage', () => {
  let component: EstablishmentPage;
  let fixture: ComponentFixture<EstablishmentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EstablishmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
