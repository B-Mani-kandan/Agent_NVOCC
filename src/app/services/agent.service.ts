import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  NVOCC_HBL_BLNo(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetHblNo.ashx`,
      payload
    );
  }

  NVOCC_Import_GetJobNo(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetImpJobNo.ashx`,
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
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetSurvoyerName.ashx`,
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
  NVOCC_AgentName(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetAgentName.ashx`,
      payload
    );
  }
  NVOCC_ChargeName(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetChargeName.ashx`,
      payload
    );
  }

  NVOCC_PackageCode(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetPackageIGM.ashx`,
      payload
    );
  }
  NVOCC_GetShipperAddress(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetShipperAddress.ashx`,
      payload
    );
  }

  NVOCC_GetConsigneeAddress(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetConsigneeAddress.ashx`,
      payload
    );
  }
  NVOCC_GetAgentAddress(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetAgentAddress.ashx`,
      payload
    );
  }
  NVOCC_GetEmptyYardAddress(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetEmptyYard_Address.ashx`,
      payload
    );
  }
  NVOCC_GetApproverName(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetApproverName.ashx`,
      payload
    );
  }
  NVOCC_GetIncoTerms(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetIncoTerms.ashx`,
      payload
    );
  }
  NVOCC_GetCHAName(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetCHAName.ashx`,
      payload
    );
  }
  NVOCC_GetDeStuffPlace(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetDeStuffPlace.ashx`,
      payload
    );
  }
  NVOCC_GetMBLNoPreAlert(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetMBLNoPreAlertMail.ashx`,
      payload
    );
  }
  NVOCC_UpdateVesselDeparture(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_Exp_CheckBoxUpdate.ashx`,
      payload
    );
  }
  NVOCC_GetCountry(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetCountry.ashx`,
      payload
    );
  }
  NVOCC_StateName(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GetStateName.ashx`,
      payload
    );
  }
  NVOCC_GenerateMail(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GenerateMail.ashx`,
      payload
    );
  }
  NVOCC_GenerateContainerBookingMail(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GenerateContMail.ashx`,
      payload
    );
  }
  NVOCC_GenerateHBLMail(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GenerateHBLMail.ashx`,
      payload
    );
  }
  NVOCC_GeneratePreAlertMail(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_GeneratePreAlertMail.ashx`,
      payload
    );
  }
  NVOCC_SendMail(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_ExpSendMail.ashx`,
      payload
    );
  }

  //Fetch Grid

  fetchGridData(tab: string, payload: any) {
    const apiMap: any = {
      GENERAL: `${this.BASE_URL}/ServiceNVOC/Nvocc_Exp_SearchGeneralData.ashx`,
      CONTAINER: `${this.BASE_URL}/ServiceNVOC/Nvocc_Exp_SearchContDetails.ashx`,
      VESSEL: `${this.BASE_URL}/ServiceNVOC/Nvocc_Exp_SearchVesselDetails.ashx`,
    };

    const apiUrl = apiMap[tab];
    return this._http.post(apiUrl, payload);
  }

  fetchExpConvImpGridData(tab: string, payload: any) {
    const apiMap: any = {
      GENERAL: `${this.BASE_URL}/ServiceNVOC/Nvocc_Imp_ExportConvert_GeneralData.ashx`,
      CONTAINER: `${this.BASE_URL}/ServiceNVOC/Nvocc_Imp_ExportConvert_ContainerDetails.ashx`,
      VESSEL: `${this.BASE_URL}/ServiceNVOC/Nvocc_Imp_ExportConvert_VesselDetails.ashx`,
    };

    const apiUrl = apiMap[tab];
    return this._http.post(apiUrl, payload);
  }

  fetchImportSearchGridData(tab: string, payload: any) {
    const apiMap: any = {
      GENERAL: `${this.BASE_URL}/ServiceNVOC/Nvocc_Imp_SearchGeneralData.ashx`,
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
      VESSEL: `${this.BASE_URL}/ServiceNVOC/Nvocc_Cont_Search_VesselDetails.ashx`,
    };

    const apiUrl = apiMap[tab];
    return this._http.post(apiUrl, payload);
  }

  fetchHBLExPortConvertGridData(tab: string, payload: any) {
    const apiMap: any = {
      GENERAL: `${this.BASE_URL}/ServiceNVOC/Nvocc_HBL_ExportConvert_GeneralDetails.ashx`,
    };

    const apiUrl = apiMap[tab];
    return this._http.post(apiUrl, payload);
  }
  fetchJobDetails(tab: string, payload: any) {
    const apiMap: any = {
      GENERAL: `${this.BASE_URL}/ServiceNVOC/Nvocc_GetPreAlertMailJobDetails.ashx`,
    };

    const apiUrl = apiMap[tab];
    return this._http.post(apiUrl, payload);
  }
  fetchHBLAllDetails(tab: string, payload: any) {
    const apiMap: any = {
      GENERAL: `${this.BASE_URL}/ServiceNVOC/Nvocc_HBL_SearchAllDetails.ashx`,
    };

    const apiUrl = apiMap[tab];
    return this._http.post(apiUrl, payload);
  }

  fetchContainerGridAddDeleteData(payload: any) {
    const apiUrl = `${this.BASE_URL}/ServiceNVOC/Nvocc_Exp_SearchGridContDetails.ashx`;
    return this._http.post(apiUrl, payload);
  }

  fetchImpContainerGridAddDeleteData(payload: any) {
    const apiUrl = `${this.BASE_URL}/ServiceNVOC/Nvocc_Imp_SearchGridCont_Details.ashx`;
    return this._http.post(apiUrl, payload);
  }

  fetchFreightGridData(payload: any) {
    const apiUrl = `${this.BASE_URL}/ServiceNVOC/Nvocc_HBL_SearchFreightGrid.ashx`;
    return this._http.post(apiUrl, payload);
  }
  fetchAnnexureGridData(payload: any) {
    const apiUrl = `${this.BASE_URL}/ServiceNVOC/Nvocc_HBL_SearchAnnexureGrid.ashx`;
    return this._http.post(apiUrl, payload);
  }
  fetchHBLContainerGridData(payload: any) {
    const apiUrl = `${this.BASE_URL}/ServiceNVOC/Nvocc_HBL_SearchContainerGrid.ashx`;
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
  Nvocc_ClientMaster(tab: string, payload: any) {
    const apiMap: any = {
      GENERAL: `${this.BASE_URL}/ServiceNVOC/Nvocc_Search_ClientMaster.ashx`,
    };

    const apiUrl = apiMap[tab];
    return this._http.post(apiUrl, payload);
  }
  Nvocc_ShipperMaster(tab: string, payload: any) {
    const apiMap: any = {
      GENERAL: `${this.BASE_URL}/ServiceNVOC/Nvocc_Search_ShipperMaster.ashx`,
    };

    const apiUrl = apiMap[tab];
    return this._http.post(apiUrl, payload);
  }
  Nvocc_ConsigneeMaster(tab: string, payload: any) {
    const apiMap: any = {
      GENERAL: `${this.BASE_URL}/ServiceNVOC/Nvocc_Search_ConsigneeMaster.ashx`,
    };

    const apiUrl = apiMap[tab];
    return this._http.post(apiUrl, payload);
  }
  Nvocc_NonAccountMaster(tab: string, payload: any) {
    const apiMap: any = {
      GENERAL: `${this.BASE_URL}/ServiceNVOC/Nvocc_Search_NonAccountMaster.ashx`,
    };

    const apiUrl = apiMap[tab];
    return this._http.post(apiUrl, payload);
  }
  Nvocc_VesselMaster(tab: string, payload: any) {
    const apiMap: any = {
      GENERAL: `${this.BASE_URL}/ServiceNVOC/Nvocc_Search_VesselMaster.ashx`,
    };

    const apiUrl = apiMap[tab];
    return this._http.post(apiUrl, payload);
  }
  Nvocc_MailSetting(tab: string, payload: any) {
    const apiMap: any = {
      GENERAL: `${this.BASE_URL}/ServiceNVOC/Nvocc_Search_MailSetting.ashx`,
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

  NVOCC_Save_ExportSea_General(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_Save_ExportSea_General.ashx`,
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

  NVOCC_SaveAllForms_HBLDraft(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_HBL_Save_AllDetails.ashx`,
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

  NVOCC_Save_HBL_FreightGrid(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_HBL_Save_FreightGrid.ashx`,
      payload
    );
  }
  NVOCC_Save_HBL_AnnexureGrid(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_HBL_Save_AnnexureGrid.ashx`,
      payload
    );
  }
  NVOCC_Save_HBL_ContainerGrid(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_HBL_Save_ContainerGrid.ashx`,
      payload
    );
  }

  NVOCC_Save_ClientMaster(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_Save_ClientMaster.ashx`,
      payload
    );
  }
  NVOCC_Save_ShipperMaster(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_Save_ShipperMaster.ashx`,
      payload
    );
  }
  NVOCC_Save_ConsigneeMaster(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_Save_ConsigneeMaster.ashx`,
      payload
    );
  }
  NVOCC_Save_CommonMaster(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_Save_NonAccountMaster.ashx`,
      payload
    );
  }
  NVOCC_Save_VesselMaster(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_Save_VesselMaster.ashx`,
      payload
    );
  }
  NVOCC_Save_MailSettingMaster(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_Save_MailSetting.ashx`,
      payload
    );
  }

  //Print
  fetchGeneralActionFile(action: string, payload: any) {
    const apiMap: any = {
      CAN: `${this.BASE_URL}/ServiceNVOC/Nvocc_Imp_CANPrint.ashx`,
      DO: `${this.BASE_URL}/ServiceNVOC/Nvocc_Imp_DOPrint.ashx`,
      Empty: `${this.BASE_URL}/ServiceNVOC/Nvocc_Imp_EmptyPrint.ashx`,
    };
    const apiUrl = apiMap[action];
    return this._http.post(apiUrl, payload);
  }
  fetchHBLGeneralActionFile(action: string, payload: any) {
    const apiMap: any = {
      BLDraft: `${this.BASE_URL}/ServiceNVOC/Nvocc_HBL_BLDraftPrint.ashx`,
      NonNegotiable: `${this.BASE_URL}/ServiceNVOC/Nvocc_HBL_BLDraftPrint.ashx`,
      BLSet: `${this.BASE_URL}/ServiceNVOC/Nvocc_HBL_BLSetPrint.ashx`,
    };
    const apiUrl = apiMap[action];
    return this._http.post(apiUrl, payload);
  }

  fetchContainerBookingGeneralActionFile(action: string, payload: any) {
    const apiMap: any = {
      Booking: `${this.BASE_URL}/ServiceNVOC/Nvocc_Cont_BookingPrint.ashx`,
      Release: `${this.BASE_URL}/ServiceNVOC/Nvocc_Cont_ReleasePrint.ashx`,
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

  NVOCC_HBL_AllGridDelete(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}/ServiceNVOC/Nvocc_HBL_AllGridDataDelete.ashx`,
      payload
    );
  }
}
