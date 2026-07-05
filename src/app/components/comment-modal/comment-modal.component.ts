import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-comment-modal',
  standalone: true,
  imports: [IonicModule, FormsModule],
  templateUrl: './comment-modal.component.html',
  styleUrls: ['./comment-modal.component.scss'],
})
export class CommentModalComponent {

  private readonly modalCtrl = inject(ModalController);

  @Input() comment: string = '';

  save() {
    this.modalCtrl.dismiss(this.comment);
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
