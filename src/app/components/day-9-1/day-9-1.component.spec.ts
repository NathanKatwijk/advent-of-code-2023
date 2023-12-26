import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Day91Component } from './day-9-1.component';

describe('Day91Component', () => {
  let component: Day91Component;
  let fixture: ComponentFixture<Day91Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Day91Component]
    });
    fixture = TestBed.createComponent(Day91Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
