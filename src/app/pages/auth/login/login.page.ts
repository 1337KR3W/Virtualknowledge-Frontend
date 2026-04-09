import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DataManagementService } from 'src/app/services/data-management.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule] // Importante para usar los forms de Angular con Ionic
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly dataMgmt = inject(DataManagementService);
  private readonly utils = inject(UtilsService);
  private readonly router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3)]]
  });

  async onLogin() {
    if (this.loginForm.invalid) return;

    const loader = await this.utils.showLoading('Iniciando sesión...');

    this.dataMgmt.login(this.loginForm.value).subscribe({
      next: (res) => {
        loader.dismiss();
        this.utils.showToast('¡Bienvenido!');
        this.router.navigateByUrl('/welcome');
      },
      error: (err) => {
        loader.dismiss();
        this.utils.showToast('Error: ' + (err.error?.message || 'Credenciales inválidas'), 'danger');
      }
    });
  }
}