import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Day112Component } from './day-11-2.component';

describe('Day112Component', () => {
  let component: Day112Component;
  let fixture: ComponentFixture<Day112Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Day112Component]
    });
    fixture = TestBed.createComponent(Day112Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
