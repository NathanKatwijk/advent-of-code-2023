import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Day92Component } from './day-9-2.component';

describe('Day92Component', () => {
  let component: Day92Component;
  let fixture: ComponentFixture<Day92Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Day92Component]
    });
    fixture = TestBed.createComponent(Day92Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
