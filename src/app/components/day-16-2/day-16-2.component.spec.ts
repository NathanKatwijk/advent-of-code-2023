import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Day162Component } from './day-16-2.component';

describe('Day162Component', () => {
  let component: Day162Component;
  let fixture: ComponentFixture<Day162Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Day162Component]
    });
    fixture = TestBed.createComponent(Day162Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
