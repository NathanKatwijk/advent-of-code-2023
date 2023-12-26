import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Day122Component } from './day-12-2.component';

describe('Day122Component', () => {
  let component: Day122Component;
  let fixture: ComponentFixture<Day122Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Day122Component]
    });
    fixture = TestBed.createComponent(Day122Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
