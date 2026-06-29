import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { NavController } from "@ionic/angular";

@Injectable({
  providedIn: 'root',
})
export class AbstractService {

  private readonly http = inject(HttpClient);
  protected readonly nav = inject(NavController);


  protected getHeaders(token?: string): HttpHeaders {
    let headers = new HttpHeaders()
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  protected async makeGetRequest<T>(url: string, paramsRequest?: Record<string, any>, token?: string): Promise<T> {
    const headers = this.getHeaders(token);
    const params = new HttpParams({ fromObject: paramsRequest ?? {} });
    try {
      return await firstValueFrom(this.http.get<T>(url, { headers, params }));
    } catch (err: any) {
      if (err?.status === 200) {
        return null as T;
      }
      console.error(err);
      throw err;
    }
  }

  protected async makeDeleteRequest<T>(url: string, paramsRequest?: Record<string, any>, token?: string): Promise<T> {
    const headers = this.getHeaders(token);
    const params = new HttpParams({ fromObject: paramsRequest ?? {} });
    try {
      const response = await firstValueFrom(
        this.http.delete<T>(url, { headers, params, observe: 'response' }));
      return response.body as T;
    } catch (err: any) {
      //legacy backend compatibility:
      // DELETE that returns 200 through error channel
      if (err?.status === 200) {
        return err.error?.text ?? null;
      }
      throw err;
    }
  }

  protected async makePostRequest<T>(url: string, data: any, token?: string): Promise<T> {
    const headers = this.getHeaders(token);
    try {
      return await firstValueFrom(this.http.post<T>(url, data, { headers }));
    } catch (err: any) {
      //legacy behavior compatibility: swallow error
      //return Promise.reject(null);
      const errorMessage = err?.message || 'Error en la peticion POST';
      throw new Error(errorMessage);
    }
  }

  protected async makePostRequestWithoutHeaders<T>(url: string, data: any): Promise<T> {
    const headers = new HttpHeaders().set('Accept', 'application/json');
    try {
      return await firstValueFrom(this.http.post<T>(url, data, { headers }));
    } catch (err: any) {
      const errorMessage = err?.message || 'Error en la peticion POST sin headers';
      throw new Error(errorMessage);
    }
  }

  protected async makePutRequest<T>(url: string, data: any, token?: string): Promise<T> {
    const headers = this.getHeaders(token);
    return await firstValueFrom(this.http.put<T>(url, data, { headers }));
  }

  protected async makePostMultipartRequest<T>(url: string, formData: FormData, token?: string): Promise<T> {
    const headers = this.getHeaders(token);
    try {
      return await firstValueFrom(this.http.post<T>(url, formData, { headers }));
    } catch (err: any) {
      throw err;
    }
  }

  protected async makePutMultipartRequest<T>(url: string, formData: FormData, token?: string): Promise<T> {
    const headers = this.getHeaders(token);
    return await firstValueFrom(this.http.put<T>(url, formData, { headers }));
  }

  protected async makeGetBlobRequest(url: string, token?: string): Promise<Blob> {
    const headers = this.getHeaders(token);
    try {
      return await firstValueFrom(
        this.http.get(url, { headers, responseType: 'blob' })
      );
    } catch (err: any) {
      console.error('[ABSTRACT] Error en la petición Blob:', err);
      throw err;
    }
  }
}
