import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Day62Component } from './day-6-2.component';

describe('Day62Component', () => {
  let component: Day62Component;
  let fixture: ComponentFixture<Day62Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Day62Component]
    });
    fixture = TestBed.createComponent(Day62Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
