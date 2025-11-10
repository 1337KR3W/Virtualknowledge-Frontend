
/*
   __          _______ __________ _____  _____      __
  / /  __ __  <  /_  /|_  /_  / //_/ _ \|_  / | /| / /
 / _ \/ // /  / //_ <_/_ < / / ,< / , _//_ <| |/ |/ / 
/_.__/\_, /  /_/____/____//_/_/|_/_/|_/____/|__/|__/  
     /___/                                            
*/
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes)
  ]
};

/*
   __          _______ __________ _____  _____      __
  / /  __ __  <  /_  /|_  /_  / //_/ _ \|_  / | /| / /
 / _ \/ // /  / //_ <_/_ < / / ,< / , _//_ <| |/ |/ / 
/_.__/\_, /  /_/____/____//_/_/|_/_/|_/____/|__/|__/  
     /___/                                            
*/
