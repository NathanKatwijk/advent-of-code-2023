import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Day61Component } from './day-6-1.component';

describe('Day61Component', () => {
  let component: Day61Component;
  let fixture: ComponentFixture<Day61Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Day61Component]
    });
    fixture = TestBed.createComponent(Day61Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
