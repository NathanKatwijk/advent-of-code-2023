import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Day101Component } from './day-10-1.component';

describe('Day101Component', () => {
  let component: Day101Component;
  let fixture: ComponentFixture<Day101Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Day101Component]
    });
    fixture = TestBed.createComponent(Day101Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
