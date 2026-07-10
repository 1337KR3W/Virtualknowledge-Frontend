import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-base-list',
    standalone: true,
    imports: [IonicModule],
    templateUrl: './base-list.component.html',
    styleUrls: ['./base-list.component.scss']
})
export class BaseListComponent {

    @Input({ required: true }) title: string = '';
    @Output() back = new EventEmitter<void>();
}