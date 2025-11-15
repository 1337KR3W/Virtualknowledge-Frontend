# Virtualknowledge-Frontend-MATERIALDESIGN
      ┌───────────────────────────┐
      |│              🐛         │|
      |│   [ { code(); } 🔐 ]    │|
      |│   [ { tests(); } ✅ ]   │|                                             
      |│   [ { deploy(); } 🌍 ]  │|                                           )
      |│________🐛_______________│|                                       (
      └────────────⚙️─────────────┘                                        ) (
                ⎯⎯⎯⎯⎯⎯⎯⎯                                                 (  ( )
                                                                        ┌──────┐
         [ Q W E R T Y U I O P ]                ____()()                |      |─┐
         [  A S D F G H J K L  ]               /      @@                |      |-'
         [   Z X C V B N M     ]         `~~~~~\_;m__m._>o              └──────┘              


# Material Design Installation guide
Official Material Design for Angular guide: https://material.angular.dev/guide/getting-started
### Install Material Design in Angular proyect path
```
ng add @angular/material
```
### During execution, the Angular CLI will prompt you to make several configuration decisions

Choose a prebuilt theme name: Indigo/Pink, Deep Purple/Amber, Pink/Blue Grey, Purple/Green

### Set up global Angular Material typography styles?

Yes / No

### Set up browser animations for Angular Material?

Yes / No

### Animation settings

If you answered "No" to the animation question, or if you encounter issues, you must ensure that the animations module is configured in your application's main file.
If Using Standalone Components (app.config.ts) Add the animations provider to the providers list in app.config.ts:
```
// src/app/app.config.ts

import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
// ... other imports

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // ADD THIS:
    provideAnimations() 
  ]
};

```
### If Using NgModules (app.module.ts)

Ensure that BrowserAnimationsModule is imported:
```
// src/app/app.module.ts

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// ...

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule, // ADD THIS
    // ...
  ],
  // ...
})
export class AppModule { }

```
### Standalone Component Integration (Imports)

Since Angular favors Standalone Components, to use any Material element (e.g., a card or a button), you must import its specific module within the component's imports array where you plan to use it.

Example of component imports:
```
// src/app/registration/register-1.component.ts

import { Component } from '@angular/core';
// Material Imports used in this component:
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
// ... other modules

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    // Angular Modules
    ReactiveFormsModule,
    // Angular Material Modules (listed here)
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule 
  ],
  templateUrl: './register-1.component.html',
  // ...
})
export class Register1Component {
  // ...
}
```
### Global Styles (Theming)

The ng add command automatically adds the stylesheet for the selected theme to your styles.css (or styles.scss) file:
```
/* styles.css or styles.scss */

@import '@angular/material/prebuilt-themes/indigo-pink.css'; 

```
