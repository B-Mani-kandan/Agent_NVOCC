export const GENERAL_FIELDS = [
  {
    label: 'Account Name',
    type: 'text',
    id: 'consignee_Gen_ConsigneeName',
    mandatory: true,
    validators: ['lettersOnly'],
  },
  {
    label: 'Address 1',
    type: 'text',
    id: 'consignee_Gen_Address1',
    mandatory: true,
    validators: ['lettersNumbersCommaDot'],
  },
  {
    label: 'Address 2',
    type: 'text',
    id: 'consignee_Gen_Address2',
    mandatory: true,
    validators: ['lettersNumbersCommaDot'],
  },
  {
    label: 'Country Name',
    type: 'autocomplete',
    id: 'consignee_Gen_Country',
    validators: ['lettersOnly'],
  },
  {
    label: 'State Name',
    type: 'autocomplete',
    id: 'consignee_Gen_State',
    validators: ['lettersOnly'],
  },
  {
    label: 'Contact Person',
    type: 'text',
    id: 'consignee_Gen_PanNo',
    validators: ['lettersOnly'],
  },
  {
    label: 'Email ID',
    type: 'text',
    id: 'consignee_Gen_EmailID',
    validators: ['lettersNumbersCommaDot'],
  },
  {
    label: 'Mobile No',
    type: 'text',
    id: 'consignee_Gen_MobileNo',
    validators: ['numbersOnly'],
  },
  {
    label: 'Forwarder',
    type: 'checkbox',
    id: 'consignee_Gen_MobileNo',
  },
  {
    label: 'YardName',
    type: 'checkbox',
    id: 'consignee_Gen_MobileNo',
  },
  {
    label: 'CFS',
    type: 'checkbox',
    id: 'consignee_Gen_MobileNo',
  },
  {
    label: 'Carrier',
    type: 'checkbox',
    id: 'consignee_Gen_MobileNo',
  },
  {
    label: 'CHA Name',
    type: 'checkbox',
    id: 'consignee_Gen_MobileNo',
  },
  {
    label: 'Surveyor',
    type: 'checkbox',
    id: 'consignee_Gen_MobileNo',
  },
];
