// src/app/components/carousel/carousel.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Feature {
  title: string;
  description: string;
  cssClass: string; //Usamos esto para la imagen/fondo
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss',
})
export class CarouselComponent implements OnInit, OnDestroy {

  // Intervalo de rotación: 5000 milisegundos (5 segundos)
  private readonly ROTATION_INTERVAL_MS = 5000;
  private intervalId: any;

  features: Feature[] = [
    { title: 'Gestión Segura', description: 'Registro y login robustos con protección de rutas (Auth Guard) para máxima seguridad de acceso.', cssClass: 'card-bg-lock' },
    { title: 'Diseño Neumórfico', description: 'Estética moderna y única, con sombras que simulan profundidad y elementos interactivos.', cssClass: 'card-bg-palette' },
    { title: 'UX Consistente', description: 'Flujo de usuario optimizado con navbar y footer globales que se adaptan a tu sesión.', cssClass: 'card-bg-layout' },
    { title: 'Adaptabilidad Total', description: 'Interfaz compatible con dispositivos de escritorio y móviles gracias a las unidades relativas.', cssClass: 'card-bg-responsive' },
    { title: 'Código Modular', description: 'Estructura basada en standalone components y variables SCSS para fácil mantenimiento.', cssClass: 'card-bg-code' },
    { title: 'Efecto Hover', description: 'Cada tarjeta reacciona al pasar el mouse con un efecto de hundimiento o elevación.', cssClass: 'card-bg-hover' },
  ];

  startIndex = 0;

  // Array de tarjetas a mostrar en la vista actual (las 3 tarjetas visibles)
  currentFeatures: Feature[] = [];


  ngOnInit(): void {
    this.updateCurrentFeatures();
    this.startAutoRotation();
  }

  ngOnDestroy(): void {
    this.stopAutoRotation();
  }

  //Función auxiliar para obtener las 3 tarjetas actuales
  private updateCurrentFeatures(): void {
    this.currentFeatures = [];
    for (let i = 0; i < 3; i++) {
      //módulo (%) para el bucle infinito del carrusel
      this.currentFeatures.push(this.features[(this.startIndex + i) % this.features.length]);
    }
  }

  nextSlide(): void {
    //Si la lista de features es <= 3, no hay necesidad de rotar
    if (this.features.length <= 3) return;

    //Avanza el índice de inicio en uno
    this.startIndex = (this.startIndex + 1) % this.features.length;

    //Actualiza el array visible
    this.updateCurrentFeatures();
  }

  private startAutoRotation(): void {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, this.ROTATION_INTERVAL_MS);
  }

  private stopAutoRotation(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}