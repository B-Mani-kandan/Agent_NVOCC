export interface AutocompleteFieldConfig {
  field: string;
  method: string;
  payloadType: string;
  formType: string;
}

export const AUTOCOMPLETE_FIELDS: AutocompleteFieldConfig[] = [
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
    field: 'gen_ClientName',
    method: 'fetchClientSuggestions',
    payloadType: 'common',
    formType: 'generalForm',
  },
  {
    field: 'gen_ShipperName',
    method: 'fetchShipperNameSuggestions',
    payloadType: 'common',
    formType: 'generalForm',
  },
  {
    field: 'gen_Consignee',
    method: 'fetchConsigneeNameSuggestions',
    payloadType: 'common',
    formType: 'generalForm',
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
