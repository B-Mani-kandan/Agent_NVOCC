export const GENERAL_FIELDS = [
  {
    label: 'Job Date',
    type: 'date',
    id: 'gen_JobDate',
  },
  {
    label: 'POL',
    type: 'autocomplete',
    id: 'gen_Pol',
    mandatory: true,
  },
  {
    label: 'POD',
    type: 'autocomplete',
    id: 'gen_Pod',
    mandatory: true,
  },
  {
    label: 'FPOD',
    type: 'autocomplete',
    id: 'gen_Fpod',
  },
  {
    label: 'Item Description',
    type: 'textarea',
    id: 'gen_ItemDesc',
    mandatory: true,
  },
  {
    label: 'Carrier Name',
    type: 'autocomplete',
    id: 'gen_ShiplineName',
    validators: ['lettersOnly'],
  },
  {
    label: 'Empty Yard Name',
    type: 'autocomplete',
    id: 'gen_EmptyName',
    validators: ['lettersOnly'],
  },
  {
    label: 'TotalDay of Transit',
    type: 'text',
    id: 'gen_TotTrans',
    validators: ['numbersOnly'],
  },
  {
    label: 'Free Days',
    type: 'text',
    id: 'gen_FreeDays',
    validators: ['numbersOnly'],
  },
  {
    label: 'Container Booking No',
    type: 'text',
    id: 'gen_ContBokNo',
    readonly: true,
  },
  {
    label: 'Remark',
    type: 'textarea',
    id: 'gen_Remark',
  },
  {
    label: 'MBL No',
    type: 'text',
    id: 'gen_MblNo',
  },
  {
    label: 'MBL Date',
    type: 'date',
    id: 'gen_MblDate',
  },

  {
    label: 'HBL No',
    type: 'text',
    id: 'gen_HblNo',
  },
  {
    label: 'HBL Date',
    type: 'date',
    id: 'gen_HblDate',
  },
  {
    label: 'Onboard Date',
    type: 'date',
    id: 'gen_OnBoardDate',
  },
];
