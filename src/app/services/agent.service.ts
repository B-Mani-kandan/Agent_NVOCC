import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AgentService {
  private BASE_URL: string;
  _http = inject(HttpClient);
  constructor() {
    let apiUrl = localStorage.getItem('ClientViewApiUrl') || '';
    if (!apiUrl.startsWith('http')) {
      apiUrl = 'https://' + apiUrl;
    }
    this.BASE_URL = apiUrl;
  }

  // AutoComplete
  NVOCC_GetClientName(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetClientName.ashx`,
      payload
    );
  }

  NVOCC_GetShipperName(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetShipperName.ashx`,
      payload
    );
  }

  NVOCC_GetConsigneeName(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetConsigneeName.ashx`,
      payload
    );
  }
  Nvocc_GetPortCountry(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetPortCountry.ashx`,
      payload
    );
  }
  Nvocc_GetShippingLine(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetShippingLine.ashx`,
      payload
    );
  }
  NVOCC_GetYardName(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetYardName.ashx`,
      payload
    );
  }
  NVOCC_GetJobNo(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetJobNo.ashx`,
      payload
    );
  }

  NVOCC_Import_GetJobNo(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_Imp_GetGobNo.ashx`,
      payload
    );
  }

  NVOCC_Cont_GetBookingNo(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_Cont_GetBookingNo.ashx`,
      payload
    );
  }
  NVOCC_GetCurrency(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetCurrency.ashx`,
      payload
    );
  }
  NVOCC_GetTerms(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetTerms.ashx`,
      payload
    );
  }
  NVOCC_GetTypeOfPackage(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetTypeOfPackage.ashx`,
      payload
    );
  }
  NVOCC_GetUnitType(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetUnitType.ashx`,
      payload
    );
  }
  NVOCC_GetContainerSize(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetContainerSize.ashx`,
      payload
    );
  }

  NVOCC_GetContinerNo(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetContainerNo.ashx`,
      payload
    );
  }

  NVOCC_GetImportContinerNo(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetImport_ContainerNo.ashx`,
      payload
    );
  }
  NVOCC_GetContainer_ContainerSize(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetContainer_ContainerSize.ashx`,
      payload
    );
  }
  NVOCC_GetFromToPlaces(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetFromToPlaces.ashx`,
      payload
    );
  }
  NVOCC_GetTransporterName(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetTransporterName.ashx`,
      payload
    );
  }
  NVOCC_GetVesselFrom(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetVesselFrom.ashx`,
      payload
    );
  }
  NVOCC_GetVesselName(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetVesselName.ashx`,
      payload
    );
  }

  NVOCC_GetForwarderName(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetForwarderName.ashx`,
      payload
    );
  }
  NVOCC_GetSurvoyerName(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_SurvoyerName.ashx`,
      payload
    );
  }

  NVOCC_GetEmptyMBLNo(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetEmpty_MblNo.ashx`,
      payload
    );
  }

  NVOCC_GetEmptyHBLNo(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetEmpty_HblNo.ashx`,
      payload
    );
  }

  NVOCC_GetEmptyYardName_EmptyReturn(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetEmptyYard_EmptyReturn.ashx`,
      payload
    );
  }

  NVOCC_LoadContainerDetails_Print(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_Imp_LoadContainerDetails_Print.ashx`,
      payload
    );
  }

  //Fetch Grid

  fetchGridData(tab: string, payload: any) {
    const apiMap: any = {
      GENERAL: `${this.BASE_URL}/ServiceNVOC/Nvocc_Exp_SearchGeneralData.ashx`,
      INVOICE: `${this.BASE_URL}/ServiceNVOC/Nvocc_Exp_SearchInvoiceDetails.ashx`,
      CONTAINER: `${this.BASE_URL}/ServiceNVOC/Nvocc_Exp_SearchContDetails.ashx`,
      VESSEL: `${this.BASE_URL}/ServiceNVOC/Nvocc_Exp_SearchVesselDetails.ashx`,
    };

    const apiUrl = apiMap[tab];
    return this._http.post(apiUrl, payload);
  }

  fetchExpConvImpGridData(tab: string, payload: any) {
    const apiMap: any = {
      GENERAL: `${this.BASE_URL}/ServiceNVOC/Nvocc_Imp_ExportConvert_GeneralData.ashx`,
      BLDETAILS: `${this.BASE_URL}/ServiceNVOC/Nvocc_Exp_SearchBLIGM_Details.ashx`,
      INVOICE: `${this.BASE_URL}/ServiceNVOC/Nvocc_Exp_SearchInvoiceDetails.ashx`,
      CONTAINER: `${this.BASE_URL}/ServiceNVOC/Nvocc_Exp_SearchContDetails.ashx`,
      VESSEL: `${this.BASE_URL}/ServiceNVOC/Nvocc_Exp_SearchVesselDetails.ashx`,
    };

    const apiUrl = apiMap[tab];
    return this._http.post(apiUrl, payload);
  }

  fetchImportSearchGridData(tab: string, payload: any) {
    const apiMap: any = {
      GENERAL: `${this.BASE_URL}/ServiceNVOC/Nvocc_Imp_SearchGeneralData.ashx`,
      BLDETAILS: `${this.BASE_URL}/ServiceNVOC/Nvocc_Imp_SearchBLIGMDetails.ashx`,
      INVOICE: `${this.BASE_URL}/ServiceNVOC/Nvocc_Imp_SearchInvoiceDetails.ashx`,
      CONTAINER: `${this.BASE_URL}/ServiceNVOC/Nvocc_Imp_SearchContDetails.ashx`,
      VESSEL: `${this.BASE_URL}/ServiceNVOC/Nvocc_Imp_SearchVesselDetails.ashx`,
    };

    const apiUrl = apiMap[tab];
    return this._http.post(apiUrl, payload);
  }

  fetchExpConvContainerGridData(tab: string, payload: any) {
    const apiMap: any = {
      GENERAL: `${this.BASE_URL}/ServiceNVOC/Nvocc_Cont_ExpConvert_GeneralDetails.ashx`,
      CONTAINER: `${this.BASE_URL}/ServiceNVOC/Nvocc_Cont_ExpConvert_ContainerDetails.ashx`,
      VESSEL: `${this.BASE_URL}/ServiceNVOC/Nvocc_Cont_ExpConvert_VesselDetails.ashx`,
    };

    const apiUrl = apiMap[tab];
    return this._http.post(apiUrl, payload);
  }

  fetchContainerGridData(tab: string, payload: any) {
    const apiMap: any = {
      GENERAL: `${this.BASE_URL}/ServiceNVOC/Nvocc_Cont_Search_GeneralDetails.ashx`,
      CONTAINER: `${this.BASE_URL}/ServiceNVOC/Nvocc_Cont_ExpConvert_ContainerDetails.ashx`,
      VESSEL: `${this.BASE_URL}/ServiceNVOC/Nvocc_Cont_ExpConvert_VesselDetails.ashx`,
    };

    const apiUrl = apiMap[tab];
    return this._http.post(apiUrl, payload);
  }

  fetchContainerGridAddDeleteData(payload: any) {
    const apiUrl = `${this.BASE_URL}/ServiceNVOC/Nvocc_Exp_SearchGridContDetails.ashx`;
    return this._http.post(apiUrl, payload);
  }

  // Search Details

  Nvocc_ContainerBooking(tab: string, payload: any) {
    const apiMap: any = {
      GENERAL: `${this.BASE_URL}/ServiceNVOC/Nvocc_ContainerBooking.ashx`,
    };

    const apiUrl = apiMap[tab];
    return this._http.post(apiUrl, payload);
  }
  Nvocc_EmptyReturnData(tab: string, payload: any) {
    const apiMap: any = {
      GENERAL: `${this.BASE_URL}/ServiceNVOC/Nvocc_Empty_Search_HblMblNo.ashx`,
    };

    const apiUrl = apiMap[tab];
    return this._http.post(apiUrl, payload);
  }
  Nvocc_Booking(tab: string, payload: any) {
    const apiMap: any = {
      GENERAL: `${this.BASE_URL}/ServiceNVOC/NVOCC_Booking.ashx`,
    };

    const apiUrl = apiMap[tab];
    return this._http.post(apiUrl, payload);
  }

  Nvocc_JobBooking(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_Export_EmptyYard.ashx`,
      payload
    );
  }

  //Save

  NVOCC_Save_JobBooking(payload: any) {
    return this._http
      .post<any>(
        `${this.BASE_URL}/ServiceNVOC/Nvocc_SaveJobBooking.ashx`,
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
      `${this.BASE_URL}/ServiceNVOC/Nvocc_Save_ExportSea_General.ashx`,
      payload
    );
  }
  NVOCC_Save_ExportSea_OperationDetails(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_Save_ExportSea_OperationDetails.ashx`,
      payload
    );
  }

  NVOCC_Save_ExportSea_InvoiceDetails(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_Save_ExportSea_InvoiceDetails.ashx`,
      payload
    );
  }
  NVOCC_Save_ExportSea_ContainerDetails(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_Save_ExportSea_ContainerDetails.ashx`,
      payload
    );
  }
  NVOCC_Save_ExportSea_VesselDetails(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_Save_ExportSea_VesselDetails.ashx`,
      payload
    );
  }

  NVOCC_SaveAllForms_ImportSea_General(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_Save_ImportSea_General.ashx`,
      payload
    );
  }

  NVOCC_Save_ImportSea_BLIGM(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_Save_ImportSea_BLIGM_Details.ashx`,
      payload
    );
  }

  NVOCC_Save_ImportSea_InvoiceDetails(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_Save_ImportSea_InvoiceDetails.ashx`,
      payload
    );
  }

  NVOCC_Save_ImportSea_ContainerDetails(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_Save_ImportSea_ContainerDetails.ashx`,
      payload
    );
  }

  NVOCC_Save_ImportSea_VesselDetails(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_Save_ImportSea_VesselDetailsashx.ashx`,
      payload
    );
  }

  NVOCC_Save_Container_GeneralDetails(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_Cont_Save_GeneralDetails.ashx`,
      payload
    );
  }

  NVOCC_Save_Container_ContainerDetails(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_Cont_Save_ContainerDetails.ashx`,
      payload
    );
  }

  NVOCC_Save_Container_VesselDetails(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_Cont_Save_VesselDetails.ashx`,
      payload
    );
  }

  NVOCC_Save_EmptyReturnDetails(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_Empty_Save_EmptyReturn.ashx`,
      payload
    );
  }

  NVOCC_Save_ExportSea_GridContainerDetails(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_Save_ExportSea_GridContainerDetails.ashx`,
      payload
    );
  }

  //Print
  fetchGeneralActionFile(action: string, payload: any) {
    const apiMap: any = {
      CAN: `${this.BASE_URL}/ServiceNVOC/CANPrint.ashx`,
      DO: `${this.BASE_URL}/ServiceNVOC/DOPrint.ashx`,
    };
    const apiUrl = apiMap[action];
    return this._http.post(apiUrl, payload);
  }

  //Delete

  NVOCC_Delete_ExportSea_GridContainerDetails(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_Exp_DeleteGrid_ContainerDetails.ashx`,
      payload
    );
  }
}
