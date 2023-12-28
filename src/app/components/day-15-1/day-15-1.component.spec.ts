import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Day151Component } from './day-15-1.component';

describe('Day151Component', () => {
  let component: Day151Component;
  let fixture: ComponentFixture<Day151Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Day151Component]
    });
    fixture = TestBed.createComponent(Day151Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
