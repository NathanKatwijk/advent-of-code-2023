import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Day102Component } from './day-10-2.component';

describe('Day102Component', () => {
  let component: Day102Component;
  let fixture: ComponentFixture<Day102Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Day102Component]
    });
    fixture = TestBed.createComponent(Day102Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
