// src/app/components/welcome/welcome.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Necesario para el routerLink

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterModule], // Importamos RouterModule
  templateUrl: './welcome.html',
  styleUrl: './welcome.scss'
})
export class WelcomeComponent {
  // Nada de lógica aquí, es puramente visual
}