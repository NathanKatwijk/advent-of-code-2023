import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Day121Component } from './day-12-1.component';

describe('Day121Component', () => {
  let component: Day121Component;
  let fixture: ComponentFixture<Day121Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Day121Component]
    });
    fixture = TestBed.createComponent(Day121Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
