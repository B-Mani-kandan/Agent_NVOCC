export interface EMPTY_AutocompleteFieldConfig {
  field: string;
  method: string;
  payloadType: string;
  formType: string;
}

export const EMPTY_AUTOCOMPLETE_FIELDS: EMPTY_AutocompleteFieldConfig[] = [
  {
    field: 'empty_MblNo',
    method: 'fetchEmptyMBLNoSuggestions',
    payloadType: 'common',
    formType: 'GeneralForm',
  },
  {
    field: 'empty_HblNo',
    method: 'fetchEmptyHBLNoSuggestions',
    payloadType: 'common',
    formType: 'GeneralForm',
  },
  {
    field: 'empty_EmptyyardName',
    method: 'fetchEmptyYardNameSuggestions',
    payloadType: 'EmptyYard',
    formType: 'EmptyReturnForm',
  },
];
