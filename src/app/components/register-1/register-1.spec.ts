import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Register1Page } from './register-1';

describe('Register1Page', () => {
  let component: Register1Page;
  let fixture: ComponentFixture<Register1Page>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register1Page]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Register1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
