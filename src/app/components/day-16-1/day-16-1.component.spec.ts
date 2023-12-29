import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Day161Component } from './day-16-1.component';

describe('Day161Component', () => {
  let component: Day161Component;
  let fixture: ComponentFixture<Day161Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Day161Component]
    });
    fixture = TestBed.createComponent(Day161Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
