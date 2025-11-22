import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Overview1 } from './overview-1';

describe('Overview1', () => {
  let component: Overview1;
  let fixture: ComponentFixture<Overview1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Overview1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Overview1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
