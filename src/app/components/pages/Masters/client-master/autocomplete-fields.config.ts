export interface AutocompleteFieldConfig {
  field: string;
  method: string;
  payloadType: string;
  formType: string;
}

export const AUTOCOMPLETE_FIELDS: AutocompleteFieldConfig[] = [
  {
    field: 'client_Gen_Country',
    method: 'fetchCountryNameSuggestions',
    payloadType: 'common',
    formType: 'generalForm',
  },
];
