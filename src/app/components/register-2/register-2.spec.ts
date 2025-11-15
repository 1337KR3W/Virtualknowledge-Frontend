import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Register2 } from './register-2';

describe('Register2', () => {
  let component: Register2;
  let fixture: ComponentFixture<Register2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Register2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
