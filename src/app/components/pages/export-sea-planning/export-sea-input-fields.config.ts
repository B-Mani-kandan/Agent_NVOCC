export const GENERAL_FIELDS = [
  {
    label: 'Job No',
    type: 'text',
    id: 'gen_JobNo',
    validators: ['numbersOnly'],
    readonly: true,
  },
  {
    label: 'Job Date',
    type: 'date',
    id: 'gen_JobDate',
  },
  {
    label: 'Shipper/Exporter Name',
    type: 'autocomplete',
    id: 'gen_Shipper',
  },
  {
    label: 'Consignee Name',
    type: 'autocomplete',
    id: 'gen_Consignee',
  },
  {
    label: 'POL',
    type: 'autocomplete',
    id: 'gen_Pol',
    validators: ['lettersOnly'],
    mandatory: true,
  },
  {
    label: 'POD',
    type: 'autocomplete',
    id: 'gen_Pod',
    validators: ['lettersOnly'],
    mandatory: true,
  },
  {
    label: 'FPOD',
    type: 'autocomplete',
    id: 'gen_Fpod',
    validators: ['lettersOnly'],
  },
  {
    label: 'Item Description',
    type: 'textarea',
    id: 'gen_ItemDesc',
    mandatory: true,
  },
  {
    label: 'Type of Commodity',
    type: 'select',
    id: 'gen_CommodityType',
    options: ['', 'Non DG', 'DG'],
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
  },
  {
    label: 'Remark',
    type: 'text',
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
    label: 'MBL Type',
    type: 'select',
    id: 'gen_Mbltype',
    options: [
      '',
      'EXPRESS BL',
      'ORIGINAL BL',
      'SURRENDER BL',
      'SEAWAY BL',
      'FCR',
      'RFS',
    ],
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
    label: 'HBL Type',
    type: 'select',
    id: 'gen_HblType',
    options: [
      '',
      'EXPRESS BL',
      'ORIGINAL BL',
      'SURRENDER BL',
      'SEAWAY BL',
      'FCR',
      'RFS',
    ],
  },
];

export const OPERATION_FIELDS = [
  { label: 'Gate In Date', type: 'date', id: 'Oper_GateInDate' },
  { label: 'OnBoard Date', type: 'date', id: 'Oper_OnBoardDate' },
  { label: 'Departure Date', type: 'date', id: 'Oper_DepatureDate' },
  { label: 'Pre Alert Date', type: 'date', id: 'Oper_PreAlertDate' },
  { label: 'Delivery Date', type: 'date', id: 'Oper_DeliveryDate' },
];

export const INVOICE_FIELDS = [
  {
    label: 'Invoice No',
    type: 'text',
    id: 'inv_InvoiceNo',
    mandatory: true,
  },
  {
    label: 'Invoice Date',
    type: 'date',
    id: 'inv_InvoiceDate',
    mandatory: true,
  },
  {
    label: 'Invoice Value',
    type: 'text',
    id: 'inv_InvoiceValue',
    validators: ['numbersOnly'],
  },
  {
    label: 'Currency',
    type: 'autocomplete',
    id: 'inv_Currency',
    validators: ['lettersOnly'],
  },
  {
    label: 'Ex-Rate',
    type: 'text',
    id: 'inv_ExRate',
    validators: ['numbersOnly'],
  },
  {
    label: 'Terms',
    type: 'autocomplete',
    id: 'inv_Terms',
    validators: ['lettersOnly'],
  },
  {
    label: 'FOB Value',
    type: 'text',
    id: 'inv_FobValue',
    validators: ['numbersOnly'],
  },
  {
    label: 'No of Packages',
    type: 'text',
    id: 'inv_NoOfpackage',
    validators: ['numbersOnly'],
  },
  {
    label: 'Type Of Packages',
    type: 'autocomplete',
    id: 'inv_TypeOfPackage',
    validators: ['lettersOnly'],
  },
  {
    label: 'Gross Weight',
    type: 'text',
    id: 'inv_GrossWeight',
    validators: ['numbersOnly'],
  },
  {
    label: 'Net Weight',
    type: 'text',
    id: 'inv_NetWeight',
    validators: ['numbersOnly'],
  },
  { label: 'CBM', type: 'text', id: 'inv_Cbm', validators: ['numbersOnly'] },
  {
    label: 'Unit Type',
    type: 'autocomplete',
    id: 'inv_UnitType',
    validators: ['lettersOnly'],
  },
];

export const CONTAINER_FIELDS = [
  {
    label: 'Container Size',
    type: 'autocomplete',
    id: 'cont_ContainerSize',
    mandatory: true,
  },
  {
    label: 'Container No',
    type: 'text',
    id: 'cont_ContainerNo',
    mandatory: true,
  },
  {
    label: 'Line Seal No',
    type: 'text',
    id: 'cont_LineSealNo',
  },
  {
    label: 'Custom Seal No',
    type: 'text',
    id: 'cont_CustomsealNo',
  },
];

export const VESSEL_FIELDS = [
  {
    label: 'POL',
    type: 'autocomplete',
    id: 'vess_POL',
    validators: ['lettersOnly'],
  },
  {
    label: 'POD',
    type: 'autocomplete',
    id: 'vess_POD',
    validators: ['lettersOnly'],
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
  { label: 'ETA', type: 'date', id: 'vess_Eta' },
  { label: 'ETD', type: 'date', id: 'vess_Etd' },
  {
    label: 'ROT No',
    type: 'text',
    id: 'vess_RotNo',
  },
  {
    label: 'Via No',
    type: 'text',
    id: 'vess_ViaNo',
  },
];
