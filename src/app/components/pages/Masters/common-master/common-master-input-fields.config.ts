export const GENERAL_FIELDS = [
  {
    label: 'Account Name',
    type: 'text',
    id: 'common_Gen_AccountName',
    mandatory: true,
    validators: ['lettersOnly'],
  },
  {
    label: 'Address 1',
    type: 'textarea',
    id: 'common_Gen_Address1',
    mandatory: true,
    validators: ['lettersNumbersCommaDot'],
  },
  {
    label: 'Address 2',
    type: 'textarea',
    id: 'common_Gen_Address2',
    mandatory: true,
    validators: ['lettersNumbersCommaDot'],
  },
  {
    label: 'Country Name',
    type: 'autocomplete',
    id: 'common_Gen_Country',
    validators: ['lettersOnly'],
  },
  {
    label: 'State Name',
    type: 'autocomplete',
    id: 'common_Gen_State',
    validators: ['lettersOnly'],
  },
  {
    label: 'Contact Person',
    type: 'text',
    id: 'common_Gen_ContactPerson',
    validators: ['lettersOnly'],
  },
  {
    label: 'Email ID',
    type: 'text',
    id: 'common_Gen_EmailID',
    validators: ['lettersNumbersCommaDot'],
  },
  {
    label: 'Mobile No',
    type: 'text',
    id: 'common_Gen_MobileNo',
    validators: ['numbersOnly'],
  },
  {
    label: 'Forwarder',
    type: 'checkbox',
    id: 'common_Gen_Forwarder',
  },
  {
    label: 'YardName',
    type: 'checkbox',
    id: 'common_Gen_YardName',
  },
  {
    label: 'CFS',
    type: 'checkbox',
    id: 'common_Gen_CFS',
  },
  {
    label: 'Carrier',
    type: 'checkbox',
    id: 'common_Gen_Carrier',
  },
  {
    label: 'CHA Name',
    type: 'checkbox',
    id: 'common_Gen_CHA',
  },
  {
    label: 'Surveyor',
    type: 'checkbox',
    id: 'common_Gen_Surveyor',
  },
];
