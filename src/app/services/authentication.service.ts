import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private _http = inject(HttpClient);

  private getBaseUrl(): string {
    if (typeof window !== 'undefined' && window.localStorage) {
      let apiUrl = localStorage.getItem('ClientViewApiUrl') || '';
      if (apiUrl && !apiUrl.startsWith('http')) {
        apiUrl = 'https://' + apiUrl;
      }
      return apiUrl;
    }
    return '';
  }

  agentLogin(obj: any) {
    const baseUrl = this.getBaseUrl();
    return this._http.post(
      `${baseUrl}/ServiceNVOC/ValidateLogin_NVOCC.ashx`,
      obj
    );
  }
}
