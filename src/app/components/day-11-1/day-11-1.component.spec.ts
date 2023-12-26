import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Day111Component } from './day-11-1.component';

describe('Day111Component', () => {
  let component: Day111Component;
  let fixture: ComponentFixture<Day111Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Day111Component]
    });
    fixture = TestBed.createComponent(Day111Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
