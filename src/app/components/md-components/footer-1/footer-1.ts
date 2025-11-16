import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'app-footer-1',
  imports: [CommonModule, MatToolbar],
  templateUrl: './footer-1.html',
  styleUrl: './footer-1.scss',
})
export class Footer1Component {
  currentYear: number = new Date().getFullYear();

}
