/*
   __          _______ __________ _____  _____      __
  / /  __ __  <  /_  /|_  /_  / //_/ _ \|_  / | /| / /
 / _ \/ // /  / //_ <_/_ < / / ,< / , _//_ <| |/ |/ / 
/_.__/\_, /  /_/____/____//_/_/|_/_/|_/____/|__/|__/  
     /___/                                            
*/

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));


/*
   __          _______ __________ _____  _____      __
  / /  __ __  <  /_  /|_  /_  / //_/ _ \|_  / | /| / /
 / _ \/ // /  / //_ <_/_ < / / ,< / , _//_ <| |/ |/ / 
/_.__/\_, /  /_/____/____//_/_/|_/_/|_/____/|__/|__/  
     /___/                                            
*/


