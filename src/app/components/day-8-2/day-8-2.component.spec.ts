import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Day82Component } from './day-8-2.component';

describe('Day82Component', () => {
  let component: Day82Component;
  let fixture: ComponentFixture<Day82Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Day82Component]
    });
    fixture = TestBed.createComponent(Day82Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
