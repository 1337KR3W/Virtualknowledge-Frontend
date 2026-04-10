import { inject, Injectable } from '@angular/core';
import { LoadingController, ToastController, Platform } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class UtilsService {
  private readonly loadingCtrl = inject(LoadingController);
  private readonly toastCtrl = inject(ToastController);
  private readonly platform = inject(Platform);

  async showLoading(message: string = 'Cargando...') {
    const loading = await this.loadingCtrl.create({ message });
    await loading.present();
    return loading;
  }

  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }

  /**
   * Returns the platform where the application is running
   *  * ios: ios device as native app
   *  * Android: android device as native app
   *  * web: anything else runing from a web browser
   */
  public getPlatform(): 'android' | 'ios' | 'web' {
    if (this.platform.is('ios') && this.platform.is('capacitor')) {
      return 'ios';
    } else if (this.platform.is('android') && this.platform.is('capacitor')) {
      return 'android';
    } else {
      return 'web';
    }
  }

  /**
   * Checks if the app is running as webApp
   */
  public isVersionWeb(): boolean {
    return (!this.platform.is('capacitor') || this.platform.is('mobileweb'));
  }

  /**
   * Checks if the app is running in a desktop browser
   */
  public isDesktop(): boolean {
    return (!this.platform.is('capacitor') || this.platform.is('desktop'));
  }
}