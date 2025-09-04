import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private BASE_URL: string;
  _http = inject(HttpClient);
  constructor() {
    let apiUrl = localStorage.getItem('ClientViewApiUrl') || '';
    if (!apiUrl.startsWith('http')) {
      apiUrl = 'https://' + apiUrl;
    }
    this.BASE_URL = apiUrl;
  }
  agentLogin(obj: any) {
    return this._http.post(
      `${this.BASE_URL}/ServiceNVOC/ValidateLogin_NVOCC.ashx`,
      obj
    );
  }
}
