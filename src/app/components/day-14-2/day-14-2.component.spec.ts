import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Day142Component } from './day-14-2.component';

describe('Day142Component', () => {
  let component: Day142Component;
  let fixture: ComponentFixture<Day142Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Day142Component]
    });
    fixture = TestBed.createComponent(Day142Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
