import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExcludeAccountPage } from './delete-account.page';

describe('ExcludeAccountPage', () => {
  let component: ExcludeAccountPage;
  let fixture: ComponentFixture<ExcludeAccountPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcludeAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
