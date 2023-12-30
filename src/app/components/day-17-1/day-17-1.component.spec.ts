import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Day171Component } from './day-17-1.component';

describe('Day171Component', () => {
  let component: Day171Component;
  let fixture: ComponentFixture<Day171Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Day171Component]
    });
    fixture = TestBed.createComponent(Day171Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
