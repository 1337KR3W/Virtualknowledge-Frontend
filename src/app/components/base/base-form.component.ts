import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-base-form',
    standalone: true,
    imports: [IonicModule],
    templateUrl: './base-form.component.html',
    styleUrls: ['./base-form.component.scss']
})
export class BaseFormComponent {
    @Input({ required: true }) title: string = '';
    @Input() subtitle: string = 'Details:';
    @Input() saveLabel: string = 'Save';
    @Output() back = new EventEmitter<void>();
    @Output() save = new EventEmitter<void>();
}