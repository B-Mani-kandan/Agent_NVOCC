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
    label: 'Importer Name',
    type: 'autocomplete',
    id: 'Imp_gen_Shipper',
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
    label: 'Commodity',
    type: 'textarea',
    id: 'Imp_gen_ItemDesc',
    mandatory: true,
  },
  {
    label: 'Type of Commodity',
    type: 'select',
    id: 'Imp_gen_CommodityType',
    options: ['', 'Non DG', 'DG'],
  },
  {
    label: 'Marks & No',
    type: 'text',
    id: 'Imp_gen_MarksNo',
  },
  {
    label: 'Line / Item No',
    type: 'text',
    id: 'Imp_gen_LineItemNo',
  },
  {
    label: 'Sub Item',
    type: 'text',
    id: 'Imp_gen_SubItem',
  },
  {
    label: 'Carrier Name',
    type: 'autocomplete',
    id: 'Imp_gen_ShiplineName',
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
    label: 'Remark',
    type: 'text',
    id: 'Imp_gen_Remark',
  },
  {
    label: 'Can Date',
    type: 'date',
    id: 'Imp_gen_CanDate',
  },
  {
    label: 'Can No',
    type: 'text',
    id: 'Imp_gen_CanNo',
  },
  {
    label: 'Do Date',
    type: 'date',
    id: 'Imp_gen_DoDate',
  },
  {
    label: 'Do No',
    type: 'text',
    id: 'Imp_gen_DoNo',
  },
  {
    label: 'Do Valid Date',
    type: 'date',
    id: 'Imp_gen_DoValidDate',
  },
  {
    label: 'Inward Date',
    type: 'date',
    id: 'Imp_gen_InwardDate',
  },
  {
    label: 'Empty Yard Name',
    type: 'autocomplete',
    id: 'Imp_gen_EmptyName',
    validators: ['lettersOnly'],
  },
];

export const IMP_BLIGM_FIELDS = [
  {
    label: 'MBL NO',
    type: 'text',
    id: 'Imp_Bligm_Mblno',
  },
  {
    label: 'MBL Date',
    type: 'date',
    id: 'Imp_Bligm_MblDate',
  },
  {
    label: 'MBL Type',
    type: 'select',
    id: 'Imp_Bligm_MBLType',
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
  {
    label: 'Supplier / Shipper Name',
    type: 'autocomplete',
    id: 'Imp_inv_SuplierShipper',
    validators: ['lettersOnly'],
  },
  {
    label: 'Address',
    type: 'text',
    id: 'Imp_inv_Address',
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
    type: 'autocomplete',
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
  {
    label: 'Empty Return Date',
    type: 'date',
    id: 'Imp_cont_EmptyReturnDate',
  },
  {
    label: 'Valid Date',
    type: 'date',
    id: 'Imp_cont_ValidDate',
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
  { label: 'ETD', type: 'date', id: 'Imp_vess_Etd' },
  { label: 'ETA', type: 'date', id: 'Imp_vess_Eta' },
];
