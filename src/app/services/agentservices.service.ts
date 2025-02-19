import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AgentservicesService {
  _http = inject(HttpClient);
  constructor() {}

  // AutoComplete

  NVOCC_GetYardName(payload: any) {
    return this._http
      .post<any>(
        'https://client.f-studio.in/ServiceNVOC/Nvocc_GetYardName.ashx',
        payload
      )
      .pipe(
        map((response) => {
          return response;
        })
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
