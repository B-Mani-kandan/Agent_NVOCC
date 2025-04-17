export const GENERAL_FIELDS = [
  { label: 'Job No', type: 'text', id: 'gen_JobNo' },
  {
    label: 'Job Date',
    type: 'date',
    id: 'gen_JobDate',
    value: new Date().toISOString().split('T')[0],
  },
  {
    label: 'Client Name',
    type: 'autocomplete',
    id: 'gen_ClientName',
    mandatory: true,
  },
  { label: 'Shipper/Exporter Name', type: 'autocomplete', id: 'gen_Shipper' },
  { label: 'Consignee Name', type: 'autocomplete', id: 'gen_Consignee' },
  { label: 'POL', type: 'autocomplete', id: 'gen_Pol', mandatory: true },
  { label: 'POD', type: 'autocomplete', id: 'gen_Pod', mandatory: true },
  { label: 'FPOD', type: 'autocomplete', id: 'gen_Fpod' },
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
    options: ['Non DG', 'DG'],
  },
  { label: 'Carrier Name', type: 'autocomplete', id: 'gen_ShiplineName' },
  { label: 'Empty Yard Name', type: 'autocomplete', id: 'gen_EmptyName' },
  { label: 'TotalDay of Transit', type: 'text', id: 'gen_TotTrans' },
  { label: 'Free Days', type: 'text', id: 'gen_FreeDays' },
  { label: 'Container Booking No', type: 'text', id: 'gen_ContBokNo' },
  { label: 'Remark', type: 'text', id: 'gen_Remark' },
];

export const OPERATION_FIELDS = [
  { label: 'Gate In Date', type: 'date', id: 'Oper_GateInDate' },
  { label: 'OnBoard Date', type: 'date', id: 'Oper_OnBoardDate' },
  { label: 'Departure Date', type: 'date', id: 'Oper_DepatureDate' },
  { label: 'Pre Alert Date', type: 'date', id: 'Oper_PreAlertDate' },
  { label: 'Delivery Date', type: 'date', id: 'Oper_DeliveryDate' },
];

export const INVOICE_FIELDS = [
  { label: 'Invoice No', type: 'text', id: 'inv_InvoiceNo', mandatory: true },
  {
    label: 'Invoice Date',
    type: 'date',
    id: 'inv_InvoiceDate',
    mandatory: true,
  },
  { label: 'Invoice Value', type: 'number', id: 'inv_InvoiceValue' },
  { label: 'Currency', type: 'autocomplete', id: 'inv_Currency' },
  { label: 'Ex-Rate', type: 'number', id: 'inv_ExRate' },
  { label: 'Terms', type: 'autocomplete', id: 'inv_Terms' },
  { label: 'FOB Value', type: 'number', id: 'inv_FobValue' },
  { label: 'No of Packages', type: 'number', id: 'inv_NoOfpackage' },
  { label: 'Type Of Packages', type: 'autocomplete', id: 'inv_TypeOfPackage' },
  { label: 'Gross Weight', type: 'number', id: 'inv_GrossWeight' },
  { label: 'Net Weight', type: 'number', id: 'inv_NetWeight' },
  { label: 'CBM', type: 'number', id: 'inv_Cbm' },
  { label: 'Unit Type', type: 'autocomplete', id: 'inv_UnitType' },
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
  { label: 'Line Seal No', type: 'text', id: 'cont_LineSealNo' },
  { label: 'Custom Seal No', type: 'text', id: 'cont_CustomsealNo' },
];

export const VESSEL_FIELDS = [
  { label: 'POL', type: 'autocomplete', id: 'vess_POL' },
  { label: 'POD', type: 'autocomplete', id: 'vess_POD' },
  {
    label: 'Vessel Name',
    type: 'autocomplete',
    id: 'vess_VesselName',
    mandatory: true,
  },
  { label: 'Voyage No', type: 'text', id: 'vess_VoyageNo' },
  { label: 'ETA', type: 'date', id: 'vess_Eta' },
  { label: 'ETD', type: 'date', id: 'vess_Etd' },
  { label: 'ROT No', type: 'text', id: 'vess_RotNo' },
  { label: 'Via No', type: 'text', id: 'vess_ViaNo' },
];
