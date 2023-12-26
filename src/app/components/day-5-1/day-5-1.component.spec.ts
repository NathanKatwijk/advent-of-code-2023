import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Day51Component } from './day-5-1.component';

describe('Day51Component', () => {
  let component: Day51Component;
  let fixture: ComponentFixture<Day51Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Day51Component]
    });
    fixture = TestBed.createComponent(Day51Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
