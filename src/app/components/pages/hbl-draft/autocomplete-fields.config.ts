export interface AutocompleteFieldConfig {
  field: string;
  method: string;
  payloadType: string;
  formType: string;
}

export const HBL_AUTOCOMPLETE_FIELDS: AutocompleteFieldConfig[] = [
  {
    field: 'common_ShipperName',
    method: 'fetchShipperNameSuggestions',
    payloadType: 'common',
    formType: 'hbl_GeneralForm',
  },
  {
    field: 'common_ConsigneeName',
    method: 'fetchConsigneeNameSuggestions',
    payloadType: 'common',
    formType: 'hbl_GeneralForm',
  },
  {
    field: 'common_Notify_1Name',
    method: 'fetchNotifyName1Suggestions',
    payloadType: 'common',
    formType: 'hbl_GeneralForm',
  },
  {
    field: 'common_Notify_2Name',
    method: 'fetchNotifyName2Suggestions',
    payloadType: 'common',
    formType: 'hbl_GeneralForm',
  },
  {
    field: 'common_DestinationAgent',
    method: 'fetchDestinationAgentSuggestions',
    payloadType: 'common',
    formType: 'hbl_GeneralForm',
  },
  {
    field: 'common_ForwardingAgent',
    method: 'fetchForwardingAgentSuggestions',
    payloadType: 'common',
    formType: 'hbl_GeneralForm',
  },
  {
    field: 'common_POL',
    method: 'fetchPortSuggestions',
    payloadType: 'common',
    formType: 'hbl_CargoForm',
  },
  {
    field: 'common_POD',
    method: 'fetchPortSuggestions',
    payloadType: 'common',
    formType: 'hbl_CargoForm',
  },
  {
    field: 'common_FPOD',
    method: 'fetchPortSuggestions',
    payloadType: 'common',
    formType: 'hbl_CargoForm',
  },
  {
    field: 'common_VesselName',
    method: 'fetchVesselNameSuggestions',
    payloadType: 'InputVal',
    formType: 'hbl_CargoForm',
  },
  {
    field: 'common_PackageType',
    method: 'fetchPackageTypeSuggestions',
    payloadType: 'InputVal',
    formType: 'hbl_CargoForm',
  },
  {
    field: 'common_UnitType',
    method: 'fetchUnitTypeSuggestions',
    payloadType: 'InputVal',
    formType: 'hbl_CargoForm',
  },
  {
    field: 'common_InvoiceCurrency',
    method: 'fetchCurrencySuggestions',
    payloadType: 'InputVal',
    formType: 'hbl_CargoForm',
  },
  {
    field: 'common_IncoTerms',
    method: 'fetchIncoTermsSuggestions',
    payloadType: 'InputVal',
    formType: 'hbl_FreightForm',
  },
];
