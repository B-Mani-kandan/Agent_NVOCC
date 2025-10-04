export interface AutocompleteFieldConfig {
  field: string;
  method: string;
  payloadType: string;
  formType: string;
}

export const AUTOCOMPLETE_FIELDS: AutocompleteFieldConfig[] = [
  {
    field: 'common_Gen_Country',
    method: 'fetchCountryNameSuggestions',
    payloadType: 'common',
    formType: 'generalForm',
  },
  {
    field: 'common_Gen_State',
    method: 'fetchStateNameSuggestions',
    payloadType: 'common',
    formType: 'generalForm',
  },
];
