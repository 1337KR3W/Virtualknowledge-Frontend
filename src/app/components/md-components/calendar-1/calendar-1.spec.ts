import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Calendar1 } from './calendar-1';

describe('Calendar1', () => {
  let component: Calendar1;
  let fixture: ComponentFixture<Calendar1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Calendar1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Calendar1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
