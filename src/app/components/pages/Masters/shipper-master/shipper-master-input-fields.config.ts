export const GENERAL_FIELDS = [
  {
    label: 'Party Name',
    type: 'text',
    id: 'shipper_Gen_PartyName',
    mandatory: true,
    validators: ['lettersNumbersCommaDot'],
  },
  {
    label: 'Email ID',
    type: 'text',
    id: 'shipper_Gen_EmailID',
    validators: ['lettersNumbersCommaDot'],
  },
  {
    label: 'Address 1',
    type: 'textarea',
    id: 'shipper_Gen_Address1',
    mandatory: true,
    validators: ['lettersNumbersCommaDot'],
  },
  {
    label: 'Address 2',
    type: 'textarea',
    id: 'shipper_Gen_Address2',
    mandatory: true,
    validators: ['lettersNumbersCommaDot'],
  },
  {
    label: 'Country Name',
    type: 'autocomplete',
    id: 'shipper_Gen_Country',
    validators: ['lettersOnly'],
  },
  {
    label: 'State Name',
    type: 'autocomplete',
    id: 'shipper_Gen_State',
    validators: ['lettersOnly'],
  },
  {
    label: 'Mobile No',
    type: 'text',
    id: 'shipper_Gen_MobileNo',
    validators: ['numbersOnly'],
  },
  {
    label: 'Postal / Zip Code',
    type: 'text',
    id: 'shipper_Gen_PinNo',
    validators: ['numbersOnly'],
  },
  {
    label: 'In Active',
    type: 'checkbox',
    id: 'shipper_Gen_InActive',
  },
];
