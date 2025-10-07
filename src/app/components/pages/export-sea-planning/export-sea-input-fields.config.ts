export const COMMON_FIELDS = [
  {
    label: 'Job No',
    type: 'text',
    id: 'gen_JobNo',
    validators: ['numbersOnly'],
    readonly: true,
  },
];

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
    label: 'Client Name',
    type: 'autocomplete',
    id: 'gen_ClientName',
    validators: ['lettersOnly'],
  },
  {
    label: 'Shipper Name',
    type: 'autocomplete',
    id: 'gen_ShipperName',
    validators: ['lettersOnly'],
  },
  {
    label: 'Consignee Name',
    type: 'autocomplete',
    id: 'gen_Consignee',
    validators: ['lettersOnly'],
  },
  {
    label: 'Item Description',
    type: 'textarea',
    id: 'gen_ItemDesc',
    mandatory: true,
    validators: ['lettersNumbersCommaDot'],
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
    validators: ['lettersNumbersCommaDot'],
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

export const GENERAL_GRID = [
  {
    label: 'Container Size',
    type: 'autocomplete',
    id: 'gen_ContainerSizeGrid',
    method: 'fetchContainerTypeSuggestions',
    payloadType: 'common',
  },
  {
    label: 'Container No',
    type: 'text',
    id: 'gen_ContainerNoGrid',
  },
];

export const CONTAINER_FIELDS = [
  {
    label: 'Container Size',
    type: 'select',
    id: 'cont_ContainerSize',
    mandatory: true,
    options: [],
  },
  {
    label: 'Container No',
    type: 'autocomplete',
    id: 'cont_ContainerNo',
    mandatory: true,
  },
  {
    label: 'Empty Pick Up Date',
    type: 'date',
    id: 'cont_PickUpDate',
  },
  {
    label: 'Empty Pick Time',
    type: 'time',
    id: 'cont_PickTime',
  },
  {
    label: 'Gate In Date',
    type: 'date',
    id: 'cont_GateInDate',
  },
  {
    label: 'Gate In Time',
    type: 'time',
    id: 'cont_GateInTime',
  },
  {
    label: 'Remark',
    type: 'textarea',
    id: 'cont_Remarks',
  },
];

export const VESSEL_FIELDS = [
  {
    label: 'POL',
    type: 'autocomplete',
    id: 'vess_POL',
  },
  {
    label: 'POD',
    type: 'autocomplete',
    id: 'vess_POD',
  },
  {
    label: 'Vessel Name',
    type: 'autocomplete',
    id: 'vess_VesselName',
    mandatory: true,
  },
  {
    label: 'Voyage No',
    type: 'text',
    id: 'vess_VoyageNo',
  },
  { label: 'ETD', type: 'date', id: 'vess_Etd' },
  { label: 'ETA', type: 'date', id: 'vess_Eta' },
];
