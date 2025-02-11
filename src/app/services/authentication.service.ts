import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  _http = inject(HttpClient);
  constructor() {}
  agentLogin(obj: any) {
    return this._http.post(
      'https://agencyapi.f-studio.in/Service/Agent_ValidateLogin.ashx',
      obj
    );
  }
}
