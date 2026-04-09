import { inject, Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { PersistenceService } from './persistence.service';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataManagementService {
  private readonly rest = inject(RestService);
  private readonly persistence = inject(PersistenceService);

  login(credentials: any) {
    return this.rest.post<{ token: string }>('/auth/login', credentials).pipe(
      tap(response => {
        if (response && response.token) {
          this.persistence.saveToken(response.token);
        }
      })
    );
  }
}