import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AgentService {
  _http = inject(HttpClient);
  constructor() {}

  // AutoComplete
  NVOCC_GetClientName(payload: any) {
    return this._http.post<any>(
      'https://client.f-studio.in/ServiceNVOC/Nvocc_GetClientName.ashx',
      payload
    );
  }

  NVOCC_GetShipperName(payload: any) {
    return this._http.post<any>(
      'https://client.f-studio.in/ServiceNVOC/Nvocc_GetShipperName.ashx',
      payload
    );
  }

  NVOCC_GetConsigneeName(payload: any) {
    return this._http.post<any>(
      'https://client.f-studio.in/ServiceNVOC/Nvocc_GetConsigneeName.ashx',
      payload
    );
  }
  Nvocc_GetPortCountry(payload: any) {
    return this._http.post<any>(
      'https://client.f-studio.in/ServiceNVOC/Nvocc_GetPortCountry.ashx',
      payload
    );
  }
  Nvocc_GetCFSName(payload: any) {
    return this._http.post<any>(
      'https://client.f-studio.in/ServiceNVOC/Nvocc_GetCFSName.ashx',
      payload
    );
  }
  Nvocc_GetCHAName(payload: any) {
    return this._http.post<any>(
      'https://client.f-studio.in/ServiceNVOC/Nvocc_GetCHAName.ashx',
      payload
    );
  }
  Nvocc_GetCoLoader(payload: any) {
    return this._http.post<any>(
      'https://client.f-studio.in/ServiceNVOC/Nvocc_GetCoLoader.ashx',
      payload
    );
  }
  Nvocc_GetForwarderName(payload: any) {
    return this._http.post<any>(
      'https://client.f-studio.in/ServiceNVOC/Nvocc_GetForwarderName.ashx',
      payload
    );
  }
  Nvocc_GetShippingLine(payload: any) {
    return this._http.post<any>(
      'https://client.f-studio.in/ServiceNVOC/Nvocc_GetShippingLine.ashx',
      payload
    );
  }
  NVOCC_GetYardName(payload: any) {
    return this._http.post<any>(
      'https://client.f-studio.in/ServiceNVOC/Nvocc_GetYardName.ashx',
      payload
    );
  }

  // Saerch Details
  Nvocc_Booking(payload: any) {
    return this._http
      .post<any>(
        'https://client.f-studio.in/ServiceNVOC/NVOCC_Booking.ashx',
        payload
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  Nvocc_JobBooking(payload: any) {
    return this._http
      .post<any>(
        'https://client.f-studio.in/ServiceNVOC/Nvocc_Export_EmptyYard.ashx',
        payload
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  //Save

  NVOCC_Save_JobBooking(payload: any) {
    return this._http
      .post<any>(
        'https://client.f-studio.in/ServiceNVOC/Nvocc_SaveJobBooking.ashx',
        payload
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
}
