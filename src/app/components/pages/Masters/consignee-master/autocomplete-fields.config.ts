export interface AutocompleteFieldConfig {
  field: string;
  method: string;
  payloadType: string;
  formType: string;
}

export const AUTOCOMPLETE_FIELDS: AutocompleteFieldConfig[] = [
  {
    field: 'consignee_Gen_Country',
    method: 'fetchCountryNameSuggestions',
    payloadType: 'common',
    formType: 'generalForm',
  },
  {
    field: 'consignee_Gen_State',
    method: 'fetchStateNameSuggestions',
    payloadType: 'common',
    formType: 'generalForm',
  },
];
