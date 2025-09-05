import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
  private BASE_URL: string = '';
  private viewApiUrl = 'https://hrm.f-studio.in/Service/GetNvoccViewURL.ashx';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      let apiUrl = localStorage.getItem('ClientViewApiUrl') || '';
      if (!apiUrl.startsWith('http') && apiUrl) {
        apiUrl = 'https://' + apiUrl;
      }
      this.BASE_URL = apiUrl;
    }
  }

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
