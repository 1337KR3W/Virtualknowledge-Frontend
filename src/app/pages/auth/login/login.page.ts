
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DataManagementService } from 'src/app/services/data-management.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AbstractPage } from '../../abstract';
import { Credentials } from 'src/app/models/cretendials.model';
import { PersistenceService } from 'src/app/services/persistence.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule] // Importante para usar los forms de Angular con Ionic
})
export class LoginPage extends AbstractPage {
  private readonly fb = inject(FormBuilder);
  private readonly dataMgmt = inject(DataManagementService);
  private readonly utils = inject(UtilsService);
  private readonly router = inject(Router);
  private readonly encrypt = inject(EncryptionService);
  private readonly persistence = inject(PersistenceService);

  public loginForm: FormGroup = new FormGroup({
    customerCode: new FormControl(),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  public async login() {
    if (this.loginForm.invalid) return;
    try {
      await this.dataMgmt.setValueFromStorage('customer', this.loginForm.value.customerCode);

      await this.handleOnlineLogin();

    } catch (error) {
      console.error(error);
      //this.showAlert();


    } finally {
      //await loading.dismiss();
    }
  }

  private async handleOnlineLogin() {
    await this.dataMgmt.login(this.loginForm.value.email, this.loginForm.value.password);

    // 2. Encriptar y guardar credenciales para futuras sesiones
    await this.encryptAndSaveCredentials(
      this.loginForm.value.customerCode,
      this.loginForm.value.email,
      this.loginForm.value.password);

    // 3. Verificar y navegar
    const credentialsEncrypted: Credentials | null = await this.dataMgmt.getValueFromStorage('credentials');

    if (credentialsEncrypted) {
      const decryptedUsername = this.encrypt.decode(credentialsEncrypted.user);
      const decryptedPass = this.encrypt.decode(credentialsEncrypted.password);

      if (this.loginForm.value.email === decryptedUsername && this.loginForm.value.password === decryptedPass) {
        this.nav.navigateRoot('welcome');
      }
    }
  }

  private async encryptAndSaveCredentials(customerShortCode: string, user: string, password: string): Promise<void> {
    const credentials = new Credentials(
      customerShortCode,
      this.encrypt.encode(user),
      this.encrypt.encode(password)
    );
    // Simplemente esperamos a que el servicio termine de guardar
    await this.dataMgmt.setValueFromStorage('credentials', credentials);
  }
}