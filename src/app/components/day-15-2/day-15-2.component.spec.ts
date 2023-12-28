import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Day152Component } from './day-15-2.component';

describe('Day152Component', () => {
  let component: Day152Component;
  let fixture: ComponentFixture<Day152Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Day152Component]
    });
    fixture = TestBed.createComponent(Day152Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
