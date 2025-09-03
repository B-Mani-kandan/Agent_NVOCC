export interface AutocompleteFieldConfig {
  field: string;
  method: string;
  payloadType: string;
  formType: string;
}

export const AUTOCOMPLETE_FIELDS: AutocompleteFieldConfig[] = [
  {
    field: 'gen_ClientName',
    method: 'fetchClientSuggestions',
    payloadType: 'client',
    formType: 'generalForm',
  },
  {
    field: 'gen_Shipper',
    method: 'fetchShipperSuggestions',
    payloadType: 'common',
    formType: 'generalForm',
  },
  {
    field: 'gen_Consignee',
    method: 'fetchConsigneeSuggestions',
    payloadType: 'common',
    formType: 'generalForm',
  },
  {
    field: 'gen_Pol',
    method: 'fetchPortSuggestions',
    payloadType: 'common',
    formType: 'generalForm',
  },
  {
    field: 'gen_Pod',
    method: 'fetchPortSuggestions',
    payloadType: 'common',
    formType: 'generalForm',
  },
  {
    field: 'gen_Fpod',
    method: 'fetchPortSuggestions',
    payloadType: 'common',
    formType: 'generalForm',
  },
  {
    field: 'gen_ShiplineName',
    method: 'fetchShippingLineSuggestions',
    payloadType: 'common',
    formType: 'generalForm',
  },
  {
    field: 'gen_EmptyName',
    method: 'fetchEmptyYardNameSuggestions',
    payloadType: 'EmptyYard',
    formType: 'generalForm',
  },
  {
    field: 'inv_Currency',
    method: 'fetchInvCurrencySuggestions',
    payloadType: 'InputVal',
    formType: 'invoiceForm',
  },
  {
    field: 'inv_Terms',
    method: 'fetchInvTermsSuggestions',
    payloadType: 'InputVal',
    formType: 'invoiceForm',
  },
  {
    field: 'inv_TypeOfPackage',
    method: 'fetchInvTypePackgSuggestions',
    payloadType: 'InputVal',
    formType: 'invoiceForm',
  },
  {
    field: 'inv_UnitType',
    method: 'fetchInvUnitSuggestions',
    payloadType: 'InputVal',
    formType: 'invoiceForm',
  },
  {
    field: 'cont_ContainerNo',
    method: 'fetchContNoSuggestions',
    payloadType: 'ContainerNo',
    formType: 'containerForm',
  },
  {
    field: 'vess_POL',
    method: 'fetchPortSuggestions',
    payloadType: 'common',
    formType: 'vesselForm',
  },
  {
    field: 'vess_POD',
    method: 'fetchPortSuggestions',
    payloadType: 'common',
    formType: 'vesselForm',
  },
  {
    field: 'vess_VesselName',
    method: 'fetchVesselNameSuggestions',
    payloadType: 'InputVal',
    formType: 'vesselForm',
  },
];
