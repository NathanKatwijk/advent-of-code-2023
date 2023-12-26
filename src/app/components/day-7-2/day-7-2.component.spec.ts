import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Day72Component } from './day-7-2.component';

describe('Day72Component', () => {
  let component: Day72Component;
  let fixture: ComponentFixture<Day72Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Day72Component]
    });
    fixture = TestBed.createComponent(Day72Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
