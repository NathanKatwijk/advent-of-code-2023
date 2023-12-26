import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Day822Component } from './day-8-2-2.component';

describe('Day822Component', () => {
  let component: Day822Component;
  let fixture: ComponentFixture<Day822Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Day822Component]
    });
    fixture = TestBed.createComponent(Day822Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
