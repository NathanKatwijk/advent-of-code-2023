import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Day141Component } from './day-14-1.component';

describe('Day141Component', () => {
  let component: Day141Component;
  let fixture: ComponentFixture<Day141Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Day141Component]
    });
    fixture = TestBed.createComponent(Day141Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
