import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Day81Component } from './day-8-1.component';

describe('Day81Component', () => {
  let component: Day81Component;
  let fixture: ComponentFixture<Day81Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Day81Component]
    });
    fixture = TestBed.createComponent(Day81Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
