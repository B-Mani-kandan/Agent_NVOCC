export interface AutocompleteFieldConfig {
  field: string;
  method: string;
  payloadType: string;
  formType: string;
}

export const AUTOCOMPLETE_FIELDS: AutocompleteFieldConfig[] = [
  {
    field: 'Cont_gen_ClientName',
    method: 'fetchClientSuggestions',
    payloadType: 'client',
    formType: 'ContgeneralForm',
  },
  {
    field: 'Cont_gen_ShipperName',
    method: 'fetchShipperSuggestions',
    payloadType: 'common',
    formType: 'ContgeneralForm',
  },
  {
    field: 'Cont_gen_Pol',
    method: 'fetchPortSuggestions',
    payloadType: 'common',
    formType: 'ContgeneralForm',
  },
  {
    field: 'Cont_gen_Pod',
    method: 'fetchPortSuggestions',
    payloadType: 'common',
    formType: 'ContgeneralForm',
  },
  {
    field: 'Cont_gen_CarrierName',
    method: 'fetchCarrierName',
    payloadType: 'common',
    formType: 'ContgeneralForm',
  },
  {
    field: 'Cont_gen_EmptyName',
    method: 'fetchEmptyYardNameSuggestions',
    payloadType: 'EmptyYard',
    formType: 'ContgeneralForm',
  },
  {
    field: 'Cont_gen_ForwarderName',
    method: 'fetchForwarderSuggestions',
    payloadType: 'common',
    formType: 'ContgeneralForm',
  },
  {
    field: 'Cont_gen_Surveyor',
    method: 'fetchSurveyorSuggestions',
    payloadType: 'common',
    formType: 'ContgeneralForm',
  },
  {
    field: 'Cont_gen_PackageType',
    method: 'fetchTypePackgSuggestions',
    payloadType: 'InputVal',
    formType: 'ContgeneralForm',
  },
  {
    field: 'Cont_gen_UnitType',
    method: 'fetchUnitSuggestions',
    payloadType: 'InputVal',
    formType: 'ContgeneralForm',
  },
  {
    field: 'Cont_cont_ContainerNo',
    method: 'fetchContNoSuggestions',
    payloadType: 'ContainerNo',
    formType: 'ContcontainerForm',
  },
  {
    field: 'Cont_vess_POL',
    method: 'fetchPortSuggestions',
    payloadType: 'common',
    formType: 'ContvesselForm',
  },
  {
    field: 'Cont_vess_POD',
    method: 'fetchPortSuggestions',
    payloadType: 'common',
    formType: 'ContvesselForm',
  },
  {
    field: 'Cont_vess_VesselName',
    method: 'fetchVesselNameSuggestions',
    payloadType: 'InputVal',
    formType: 'ContvesselForm',
  },
];
