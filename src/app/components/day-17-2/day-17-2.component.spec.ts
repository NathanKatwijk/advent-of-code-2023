import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Day172Component } from './day-17-2.component';

describe('Day172Component', () => {
  let component: Day172Component;
  let fixture: ComponentFixture<Day172Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Day172Component]
    });
    fixture = TestBed.createComponent(Day172Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
