import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Login1Page } from './login-1';

describe('Login1', () => {
  let component: Login1Page;
  let fixture: ComponentFixture<Login1Page>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login1Page]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Login1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
