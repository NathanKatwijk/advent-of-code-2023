import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Day71Component } from './day-7-1.component';

describe('Day71Component', () => {
  let component: Day71Component;
  let fixture: ComponentFixture<Day71Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Day71Component]
    });
    fixture = TestBed.createComponent(Day71Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
