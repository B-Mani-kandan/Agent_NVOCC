export interface AutocompleteFieldConfig {
  field: string;
  method: string;
  payloadType: string;
  formType: string;
}

export const AUTOCOMPLETE_FIELDS: AutocompleteFieldConfig[] = [
  {
    field: 'gen_HblNo',
    method: 'fetchMBLNoSuggestions',
    payloadType: 'common',
    formType: 'generalForm',
  },
];
