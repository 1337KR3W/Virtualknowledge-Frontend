
import { Component, inject } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DataManagementService } from 'src/app/services/data-management.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AbstractPage } from '../../abstract';
import { Credentials } from 'src/app/models/cretendials.model';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule]
})
export class LoginPage extends AbstractPage {

  private readonly dataMgmt = inject(DataManagementService);
  private readonly utils = inject(UtilsService);
  private readonly encrypt = inject(EncryptionService);
  public authError: string | null = null;

  public loginForm: FormGroup = new FormGroup({
    customerCode: new FormControl(),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  public async login() {
    this.authError = null;
    if (this.loginForm.invalid) return;
    const loading = await this.utils.showLoading('Iniciando sesión...');

    try {
      await this.dataMgmt.setValueFromStorage('customer', this.loginForm.value.customerCode);
      await this.dataMgmt.login(this.loginForm.value.email, this.loginForm.value.password);
      await this.encryptAndSaveCredentials(
        this.loginForm.value.customerCode,
        this.loginForm.value.email,
        this.loginForm.value.password
      );

      this.nav.navigateRoot('welcome');
    } catch (error) {

      this.authError = 'Invalid email/password. Please try again.';
      console.error('Error de autenticación detectado en el componente');
    } finally {
      await loading.dismiss();
    }
  }

  private async handleOnlineLogin() {
    await this.dataMgmt.login(this.loginForm.value.email, this.loginForm.value.password);
    await this.encryptAndSaveCredentials(
      this.loginForm.value.customerCode,
      this.loginForm.value.email,
      this.loginForm.value.password);

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
    await this.dataMgmt.setValueFromStorage('credentials', credentials);
  }
}