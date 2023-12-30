import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Day1712Component } from './day-17-1-2.component';

describe('Day1712Component', () => {
  let component: Day1712Component;
  let fixture: ComponentFixture<Day1712Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Day1712Component]
    });
    fixture = TestBed.createComponent(Day1712Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
