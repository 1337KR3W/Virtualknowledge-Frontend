import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekNumberBar1 } from './week-number-bar-1';

describe('WeekNumberBar1', () => {
  let component: WeekNumberBar1;
  let fixture: ComponentFixture<WeekNumberBar1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeekNumberBar1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeekNumberBar1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
