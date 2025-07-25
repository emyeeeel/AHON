import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VictimsPage } from './victims.page';

describe('VictimsPage', () => {
  let component: VictimsPage;
  let fixture: ComponentFixture<VictimsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VictimsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
