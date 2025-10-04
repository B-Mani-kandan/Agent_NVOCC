export const GENERAL_FIELDS = [
  {
    label: 'Account Name',
    type: 'text',
    id: 'client_Gen_AccountName',
    mandatory: true,
    validators: ['lettersOnly'],
  },
  {
    label: 'Registered No',
    type: 'text',
    id: 'client_Gen_RegNo',
  },
  {
    label: 'Company Type',
    type: 'select',
    id: 'client_Gen_CompanyType',
    options: [
      'Proprietor',
      'Partner',
      'Limited Liability Partnership',
      'Private Limited',
      'Public Limited',
    ],
    mandatory: true,
  },
  {
    label: 'In Active',
    type: 'checkbox',
    id: 'client_Gen_InActive',
  },
  {
    label: 'Address Line 1',
    type: 'textarea',
    id: 'client_Gen_Address1',
    mandatory: true,
    validators: ['lettersNumbersCommaDot'],
  },
  {
    label: 'Address Line 2',
    type: 'textarea',
    id: 'client_Gen_Address2',
    mandatory: true,
    validators: ['lettersNumbersCommaDot'],
  },
  {
    label: 'Country Name',
    type: 'autocomplete',
    id: 'client_Gen_Country',
    validators: ['lettersOnly'],
  },
  {
    label: 'Tax No',
    type: 'text',
    id: 'client_Gen_TaxNo',
  },
  {
    label: 'Postal / Zip Code',
    type: 'text',
    id: 'client_Gen_PostalCode',
    validators: ['numbersOnly'],
  },
];
