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
  ) {}

  getClientInfo(siteUrl: string): Observable<ClientInfo> {
    let apiUrl = siteUrl || '';
    if (!apiUrl.startsWith('http') && apiUrl) {
      apiUrl = 'https://' + apiUrl;
    }
    return this.http.post<ClientInfo>(
      `${apiUrl}/ServiceNVOC/Nvocc_GetClientInfo.ashx`,
      { SiteURL: siteUrl }
    );
  }

  getClientViewUrl(siteUrl: string): Observable<ClientViewURL> {
    const body = { SiteURL: siteUrl };
    return this.http.post<ClientViewURL>(this.viewApiUrl, body);
  }
}
