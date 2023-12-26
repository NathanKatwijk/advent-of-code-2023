import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Day31Component } from './day-3-1.component';

describe('Day31Component', () => {
  let component: Day31Component;
  let fixture: ComponentFixture<Day31Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Day31Component]
    });
    fixture = TestBed.createComponent(Day31Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
