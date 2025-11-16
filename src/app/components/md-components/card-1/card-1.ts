import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

interface Feature {
  title: string;
  description: string;
  cssClass: string;
  imagePath: string;
}
@Component({
  selector: 'app-card-1',
  imports: [CommonModule, MatCardModule],
  templateUrl: './card-1.html',
  styleUrl: './card-1.scss',
})
export class Card1Component {

  features: Feature[] = [
    {
      title: 'Secure Management',
      description: 'Robust registration and login with route protection (Auth Guard).',
      cssClass: 'card-bg-lock',
      imagePath: "assets/images/original/card-bg-lock.png"
    },
    {
      title: 'Neumorphic Design',
      description: 'Modern and unique aesthetic, with shadows that simulate depth and interactive elements.',
      cssClass: 'card-bg-palette',
      imagePath: 'assets/images/original/card-bg-palette.png'
    },

    {
      title: 'Consistent UX',
      description: 'Optimized user flow with global navbar and footer that adapt to your session.',
      cssClass: 'card-bg-layout',
      imagePath: 'assets/images/original/card-bg-layout.png'

    },

    {
      title: 'Total Adaptability',
      description: 'Interface compatible with desktop and mobile devices thanks to relative units.',
      cssClass: 'card-bg-responsive',
      imagePath: 'assets/images/original/card-bg-responsive.png'
    },

    {
      title: 'Modular Code',
      description: 'Structure based on standalone components and SCSS variables for easy maintenance.',
      cssClass: 'card-bg-code',
      imagePath: 'assets/images/original/card-bg-code.png'
    },

    {
      title: 'Material Design',
      description: 'Latest version of Material Design M3.',
      cssClass: 'card-bg-hover',
      imagePath: 'assets/images/original/card-bg-hover.png'
    },
  ];


}
