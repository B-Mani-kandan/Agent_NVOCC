export const IMP_GENERAL_FIELDS = [
  {
    label: 'Job No',
    type: 'text',
    id: 'Imp_gen_JobNo',
    validators: ['numbersOnly'],
  },
  {
    label: 'Job Date',
    type: 'date',
    id: 'Imp_gen_JobDate',
  },
  {
    label: 'Client Name',
    type: 'autocomplete',
    id: 'Imp_gen_ClientName',
    mandatory: true,
  },
  {
    label: 'Shipper/Exporter Name',
    type: 'autocomplete',
    id: 'Imp_gen_Shipper',
  },
  {
    label: 'Consignee Name',
    type: 'autocomplete',
    id: 'Imp_gen_Consignee',
  },
  {
    label: 'POL',
    type: 'autocomplete',
    id: 'Imp_gen_Pol',
    validators: ['lettersOnly'],
    mandatory: true,
  },
  {
    label: 'POD',
    type: 'autocomplete',
    id: 'Imp_gen_Pod',
    validators: ['lettersOnly'],
    mandatory: true,
  },
  {
    label: 'FPOD',
    type: 'autocomplete',
    id: 'Imp_gen_Fpod',
    validators: ['lettersOnly'],
  },
  {
    label: 'Item Description',
    type: 'textarea',
    id: 'Imp_gen_ItemDesc',
    mandatory: true,
  },
  {
    label: 'Type of Commodity',
    type: 'select',
    id: 'Imp_gen_CommodityType',
    options: ['Non DG', 'DG'],
  },
  {
    label: 'Carrier Name',
    type: 'autocomplete',
    id: 'Imp_gen_ShiplineName',
    validators: ['lettersOnly'],
  },
  {
    label: 'Empty Yard Name',
    type: 'autocomplete',
    id: 'Imp_gen_EmptyName',
    validators: ['lettersOnly'],
  },
  {
    label: 'TotalDay of Transit',
    type: 'text',
    id: 'Imp_gen_TotTrans',
    validators: ['numbersOnly'],
  },
  {
    label: 'Free Days',
    type: 'text',
    id: 'Imp_gen_FreeDays',
    validators: ['numbersOnly'],
  },
  {
    label: 'Container Booking No',
    type: 'text',
    id: 'Imp_gen_ContBokNo',
  },
  {
    label: 'Remark',
    type: 'text',
    id: 'Imp_gen_Remark',
  },
];

export const IMP_OPERATION_FIELDS = [
  { label: 'Gate In Date', type: 'date', id: 'Imp_Oper_GateInDate' },
  { label: 'OnBoard Date', type: 'date', id: 'Imp_Oper_OnBoardDate' },
  { label: 'Departure Date', type: 'date', id: 'Imp_Oper_DepatureDate' },
  { label: 'Pre Alert Date', type: 'date', id: 'Imp_Oper_PreAlertDate' },
  { label: 'Delivery Date', type: 'date', id: 'Imp_Oper_DeliveryDate' },
];

export const IMP_BLIGM_FIELDS = [
  {
    label: 'MBL NO',
    type: 'text',
    id: 'Imp_Bligm_Mblno',
  },
];
export const IMP_INVOICE_FIELDS = [
  {
    label: 'Invoice No',
    type: 'text',
    id: 'Imp_inv_InvoiceNo',
    mandatory: true,
  },
  {
    label: 'Invoice Date',
    type: 'date',
    id: 'Imp_inv_InvoiceDate',
    mandatory: true,
  },
  {
    label: 'Invoice Value',
    type: 'text',
    id: 'Imp_inv_InvoiceValue',
    validators: ['numbersOnly'],
  },
  {
    label: 'Currency',
    type: 'autocomplete',
    id: 'Imp_inv_Currency',
    validators: ['lettersOnly'],
  },
  {
    label: 'Ex-Rate',
    type: 'text',
    id: 'Imp_inv_ExRate',
    validators: ['numbersOnly'],
  },
  {
    label: 'Terms',
    type: 'autocomplete',
    id: 'Imp_inv_Terms',
    validators: ['lettersOnly'],
  },
  {
    label: 'FOB Value',
    type: 'text',
    id: 'Imp_inv_FobValue',
    validators: ['numbersOnly'],
  },
  {
    label: 'No of Packages',
    type: 'text',
    id: 'Imp_inv_NoOfpackage',
    validators: ['numbersOnly'],
  },
  {
    label: 'Type Of Packages',
    type: 'autocomplete',
    id: 'Imp_inv_TypeOfPackage',
    validators: ['lettersOnly'],
  },
  {
    label: 'Gross Weight',
    type: 'text',
    id: 'Imp_inv_GrossWeight',
    validators: ['numbersOnly'],
  },
  {
    label: 'Net Weight',
    type: 'text',
    id: 'Imp_inv_NetWeight',
    validators: ['numbersOnly'],
  },
  {
    label: 'CBM',
    type: 'text',
    id: 'Imp_inv_Cbm',
    validators: ['numbersOnly'],
  },
  {
    label: 'Unit Type',
    type: 'autocomplete',
    id: 'Imp_inv_UnitType',
    validators: ['lettersOnly'],
  },
];

export const IMP_CONTAINER_FIELDS = [
  {
    label: 'Container Size',
    type: 'autocomplete',
    id: 'Imp_cont_ContainerSize',
    mandatory: true,
  },
  {
    label: 'Container No',
    type: 'text',
    id: 'Imp_cont_ContainerNo',
    mandatory: true,
  },
  {
    label: 'Line Seal No',
    type: 'text',
    id: 'Imp_cont_LineSealNo',
  },
  {
    label: 'Custom Seal No',
    type: 'text',
    id: 'Imp_cont_CustomsealNo',
  },
];

export const IMP_VESSEL_FIELDS = [
  {
    label: 'POL',
    type: 'autocomplete',
    id: 'Imp_vess_POL',
    validators: ['lettersOnly'],
  },
  {
    label: 'POD',
    type: 'autocomplete',
    id: 'Imp_vess_POD',
    validators: ['lettersOnly'],
  },
  {
    label: 'Vessel Name',
    type: 'autocomplete',
    id: 'Imp_vess_VesselName',
    mandatory: true,
  },
  {
    label: 'Voyage No',
    type: 'text',
    id: 'Imp_vess_VoyageNo',
  },
  { label: 'ETA', type: 'date', id: 'Imp_vess_Eta' },
  { label: 'ETD', type: 'date', id: 'Imp_vess_Etd' },
  {
    label: 'ROT No',
    type: 'text',
    id: 'Imp_vess_RotNo',
  },
  {
    label: 'Via No',
    type: 'text',
    id: 'Imp_vess_ViaNo',
  },
];
