import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  _http = inject(HttpClient);
  agentLogin(obj: any) {
    return this._http.post(
      'https://client.f-studio.in/ServiceNVOC/ValidateLogin_NVOCC.ashx',
      obj
    );
  }
}
