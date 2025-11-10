/*
   __          _______ __________ _____  _____      __
  / /  __ __  <  /_  /|_  /_  / //_/ _ \|_  / | /| / /
 / _ \/ // /  / //_ <_/_ < / / ,< / , _//_ <| |/ |/ / 
/_.__/\_, /  /_/____/____//_/_/|_/_/|_/____/|__/|__/  
     /___/                                            
*/

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Feature {
  title: string;
  description: string;
  cssClass: string;
}

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cards.html',
  styleUrl: './cards.scss',
})

export class CardsComponent {

  features: Feature[] = [
    { title: 'Secure Management', description: 'Robust registration and login with route protection (Auth Guard).', cssClass: 'card-bg-lock' },
    { title: 'Neumorphic Design', description: 'Modern and unique aesthetic, with shadows that simulate depth and interactive elements.', cssClass: 'card-bg-palette' },
    { title: 'Consistent UX', description: 'Optimized user flow with global navbar and footer that adapt to your session.', cssClass: 'card-bg-layout' },
    { title: 'Total Adaptability', description: 'Interface compatible with desktop and mobile devices thanks to relative units.', cssClass: 'card-bg-responsive' },
    { title: 'Modular Code', description: 'Structure based on standalone components and SCSS variables for easy maintenance.', cssClass: 'card-bg-code' },
    { title: 'Hover Effect', description: 'Each card reacts to mouse hover with a sinking or lifting effect.', cssClass: 'card-bg-hover' },
  ];
}

/*
   __          _______ __________ _____  _____      __
  / /  __ __  <  /_  /|_  /_  / //_/ _ \|_  / | /| / /
 / _ \/ // /  / //_ <_/_ < / / ,< / , _//_ <| |/ |/ / 
/_.__/\_, /  /_/____/____//_/_/|_/_/|_/____/|__/|__/  
     /___/                                            
*/