import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Day131Component } from './day-13-1.component';

describe('Day131Component', () => {
  let component: Day131Component;
  let fixture: ComponentFixture<Day131Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Day131Component]
    });
    fixture = TestBed.createComponent(Day131Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
