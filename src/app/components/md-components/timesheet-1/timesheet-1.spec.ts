import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Timesheet1 } from './timesheet-1';

describe('Timesheet1', () => {
  let component: Timesheet1;
  let fixture: ComponentFixture<Timesheet1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Timesheet1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Timesheet1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
