import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Welcome1Component } from './welcome-1';

describe('Welcome1', () => {
  let component: Welcome1Component;
  let fixture: ComponentFixture<Welcome1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Welcome1Component]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Welcome1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
