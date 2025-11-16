import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { MatToolbar } from "@angular/material/toolbar";
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-navbar-1',
  imports: [RouterModule, MatToolbar, MatButtonModule],
  templateUrl: './navbar-1.html',
  styleUrl: './navbar-1.scss',
})
export class Navbar1Component {

}
