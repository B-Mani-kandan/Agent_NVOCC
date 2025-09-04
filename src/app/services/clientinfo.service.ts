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
  private apiUrl =
    'https://client.f-studio.in/ServiceNVOC/Nvocc_GetClientInfo.ashx';

  private viewApiUrl = 'https://hrm.f-studio.in/Service/GetNvoccViewURL.ashx';

  constructor(private http: HttpClient) {}

  getClientInfo(siteUrl: string): Observable<ClientInfo> {
    const body = { SiteURL: siteUrl };
    return this.http.post<ClientInfo>(this.apiUrl, body);
  }

  getClientViewUrl(siteUrl: string): Observable<ClientViewURL> {
    const body = { SiteURL: siteUrl };
    return this.http.post<ClientViewURL>(this.viewApiUrl, body);
  }
}
