import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Card1Component } from '../../components/md-components/card-1/card-1';

@Component({
  selector: 'app-welcome-1',
  imports: [CommonModule, RouterModule, Card1Component],
  templateUrl: './welcome-1.html',
  styleUrl: './welcome-1.scss',
})
export class Welcome1Component {

}
