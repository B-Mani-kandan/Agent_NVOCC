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
  NVOCC_GetJobNo(payload: any) {
    return this._http.post<any>(
      'https://client.f-studio.in/ServiceNVOC/Nvocc_GetJobNo.ashx',
      payload
    );
  }
  NVOCC_GetCurrency(payload: any) {
    return this._http.post<any>(
      'https://client.f-studio.in/ServiceNVOC/Nvocc_GetCurrency.ashx',
      payload
    );
  }
  NVOCC_GetTerms(payload: any) {
    return this._http.post<any>(
      'https://client.f-studio.in/ServiceNVOC/Nvocc_GetTerms.ashx',
      payload
    );
  }
  NVOCC_GetTypeOfPackage(payload: any) {
    return this._http.post<any>(
      'https://client.f-studio.in/ServiceNVOC/Nvocc_GetTypeOfPackage.ashx',
      payload
    );
  }
  NVOCC_GetUnitType(payload: any) {
    return this._http.post<any>(
      'https://client.f-studio.in/ServiceNVOC/Nvocc_GetUnitType.ashx',
      payload
    );
  }
  NVOCC_GetContainerSize(payload: any) {
    return this._http.post<any>(
      'https://client.f-studio.in/ServiceNVOC/Nvocc_GetContainerSize.ashx',
      payload
    );
  }
  NVOCC_GetFromToPlaces(payload: any) {
    return this._http.post<any>(
      'https://client.f-studio.in/ServiceNVOC/Nvocc_GetFromToPlaces.ashx',
      payload
    );
  }
  NVOCC_GetTransporterName(payload: any) {
    return this._http.post<any>(
      'https://client.f-studio.in/ServiceNVOC/Nvocc_GetTransporterName.ashx',
      payload
    );
  }
  NVOCC_GetVesselFrom(payload: any) {
    return this._http.post<any>(
      'https://client.f-studio.in/ServiceNVOC/Nvocc_GetVesselFrom.ashx',
      payload
    );
  }
  NVOCC_GetVesselName(payload: any) {
    return this._http.post<any>(
      'https://client.f-studio.in/ServiceNVOC/Nvocc_GetVesselName.ashx',
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

  NVOCC_Save_ExportSea_General(payload: any) {
    return this._http.post<any>(
      'https://client.f-studio.in/ServiceNVOC/Nvocc_Save_ExportSea_General.ashx',
      payload
    );
  }

  NVOCC_Save_ExportSea_OperationDetails(payload: any) {
    return this._http.post<any>(
      'https://client.f-studio.in/ServiceNVOC/Nvocc_Save_ExportSea_OperationDetails.ashx',
      payload
    );
  }

  NVOCC_Save_ExportSea_InvoiceDetails(payload: any) {
    return this._http.post<any>(
      'https://client.f-studio.in/ServiceNVOC/Nvocc_Save_ExportSea_InvoiceDetails.ashx',
      payload
    );
  }
  NVOCC_Save_ExportSea_ContainerDetails(payload: any) {
    return this._http.post<any>(
      'https://client.f-studio.in/ServiceNVOC/Nvocc_Save_ExportSea_ContainerDetails.ashx',
      payload
    );
  }
  NVOCC_Save_ExportSea_VesselDetails(payload: any) {
    return this._http.post<any>(
      'https://client.f-studio.in/ServiceNVOC/Nvocc_Save_ExportSea_VesselDetails.ashx',
      payload
    );
  }
}
