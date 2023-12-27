import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Day132Component } from './day-13-2.component';

describe('Day132Component', () => {
  let component: Day132Component;
  let fixture: ComponentFixture<Day132Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Day132Component]
    });
    fixture = TestBed.createComponent(Day132Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
