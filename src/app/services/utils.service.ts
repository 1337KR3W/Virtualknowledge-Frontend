import { inject, Injectable } from '@angular/core';
import { LoadingController, ToastController, Platform } from '@ionic/angular';
import { ModalController } from '@ionic/angular/standalone';
@Injectable({ providedIn: 'root' })

export class UtilsService {
  private readonly loadingCtrl = inject(LoadingController);
  private readonly toastCtrl = inject(ToastController);
  private readonly platform = inject(Platform);
  private readonly modalCtrl = inject(ModalController);

  /**
   * Abre un modal genérico y devuelve los datos al cerrar
   * @param component El componente que se mostrará
   * @param componentProps Propiedades que recibe el componente (@Input)
   * @param css Clase CSS personalizada (opcional)
   * @param backDrop Si se puede cerrar haciendo clic fuera (default: true)
   */
  public async openModal(
    component: any,
    componentProps: any,
    css: string = '',
    backDrop: boolean = true
  ): Promise<any> {

    const modal = await this.modalCtrl.create({
      component,
      componentProps,
      cssClass: css,
      backdropDismiss: backDrop
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();
    return data;
  }

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
      position: 'bottom',
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