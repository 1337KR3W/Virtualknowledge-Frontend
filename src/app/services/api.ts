import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private http = inject(HttpClient);

  private apiURL = 'https://reqres.in/api/';

  public getUsers(params?: any): Observable<any> {
    return this.http.get<any>(this.apiURL + 'users', { headers: this.headers, params }).pipe(map(response => response));
  }
  public getUser(id: String): Observable<any> {
    return this.http.get<any>(this.apiURL + 'users/' + id, { headers: this.headers }).pipe(map(response => response));
  }
  get headers(): { [key: string]: string } {
    return { 'x-api-key': 'reqres-free-v1' };
  }

}
