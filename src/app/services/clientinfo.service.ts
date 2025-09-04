import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ClientInfo {
  CompanyId: string;
  CompanyName: string;
  Status: string;
  Message: string;
  EmailId: string;
  ImageURL: string;
  TabImageURL: string;
  TabName: string;
}

interface ClientViewURL {
  ViewURL: string;
  Status: string;
  APIURL: string;
}

@Injectable({
  providedIn: 'root',
})
export class ClientinfoService {
  private BASE_URL: string;
  constructor(private http: HttpClient) {
    let apiUrl = localStorage.getItem('ClientViewApiUrl') || '';
    if (!apiUrl.startsWith('http')) {
      apiUrl = 'https://' + apiUrl;
    }
    this.BASE_URL = apiUrl;
  }

  private viewApiUrl = 'https://hrm.f-studio.in/Service/GetNvoccViewURL.ashx';

  getClientInfo(siteUrl: string): Observable<ClientInfo> {
    const body = { SiteURL: siteUrl };
    return this.http.post<ClientInfo>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetClientInfo.ashx`,
      body
    );
  }

  getClientViewUrl(siteUrl: string): Observable<ClientViewURL> {
    const body = { SiteURL: siteUrl };
    return this.http.post<ClientViewURL>(this.viewApiUrl, body);
  }
}
