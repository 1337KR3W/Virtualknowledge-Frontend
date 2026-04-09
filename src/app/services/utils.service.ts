import { inject, Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class UtilsService {
  private readonly loadingCtrl = inject(LoadingController);
  private readonly toastCtrl = inject(ToastController);

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
}