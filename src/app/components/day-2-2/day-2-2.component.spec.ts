import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Day22Component } from './day-2-2.component';

describe('Day22Component', () => {
  let component: Day22Component;
  let fixture: ComponentFixture<Day22Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Day22Component]
    });
    fixture = TestBed.createComponent(Day22Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
