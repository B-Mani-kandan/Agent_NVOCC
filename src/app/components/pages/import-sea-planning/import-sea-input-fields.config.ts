export const COMMON_FIELDS = [
  {
    label: 'Job No',
    type: 'text',
    id: 'Imp_gen_JobNo',
    validators: ['numbersOnly'],
    readonly: true,
  },
];

export const IMP_GENERAL_FIELDS = [
  {
    label: 'Job Date',
    type: 'date',
    id: 'Imp_gen_JobDate',
  },
  {
    label: 'POL',
    type: 'autocomplete',
    id: 'Imp_gen_Pol',
    mandatory: true,
  },
  {
    label: 'POD',
    type: 'autocomplete',
    id: 'Imp_gen_Pod',
    mandatory: true,
  },
  {
    label: 'FPOD',
    type: 'autocomplete',
    id: 'Imp_gen_Fpod',
  },
  {
    label: 'Item Description',
    type: 'textarea',
    id: 'Imp_gen_ItemDesc',
    mandatory: true,
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
    label: 'Container Booking No',
    type: 'text',
    id: 'Imp_gen_ContBokNo',
  },
  {
    label: 'MBL NO',
    type: 'text',
    id: 'Imp_gen_MblNo',
  },
  {
    label: 'MBL Date',
    type: 'date',
    id: 'Imp_gen_MblDate',
  },
  {
    label: 'HBL NO',
    type: 'text',
    id: 'Imp_gen_HblNo',
  },
  {
    label: 'HBL Date',
    type: 'date',
    id: 'Imp_gen_HblDate',
  },
  {
    label: 'Inward Date',
    type: 'date',
    id: 'Imp_gen_InwardDate',
  },
  {
    label: 'DO Date',
    type: 'date',
    id: 'Imp_gen_DODate',
  },
  {
    label: 'Remark',
    type: 'textarea',
    id: 'Imp_gen_Remark',
  },
];

export const IMP_PRINT_FIELDS = [
  {
    label: 'Client Name',
    type: 'autocomplete',
    id: 'Imp_gen_ClientName',
    validators: ['lettersOnly'],
  },
  {
    label: 'Shipper Name',
    type: 'autocomplete',
    id: 'Imp_gen_ShipperName',
    validators: ['lettersOnly'],
  },
  {
    label: 'Shipper Address',
    type: 'textarea',
    id: 'Imp_gen_ShipperAddress',
    validators: ['lettersNumbersCommaDot'],
  },
  {
    label: 'Consignee Name',
    type: 'autocomplete',
    id: 'Imp_gen_Consignee',
    validators: ['lettersOnly'],
  },
  {
    label: 'Consignee Address',
    type: 'textarea',
    id: 'Imp_gen_ConsigneeAddress',
    validators: ['lettersNumbersCommaDot'],
  },
  {
    label: 'CHA',
    type: 'autocomplete',
    id: 'Imp_gen_CHAName',
  },
  {
    label: 'DeStuffing Place',
    type: 'autocomplete',
    id: 'Imp_gen_DeStuff',
  },
  {
    label: 'CAN No',
    type: 'text',
    id: 'Imp_gen_CANNo',
  },
  {
    label: 'CAN Date',
    type: 'date',
    id: 'Imp_gen_CANDate',
  },
  {
    label: 'Invoice No',
    type: 'text',
    id: 'Imp_gen_InvoiceNo',
  },
  {
    label: 'Invoice Date',
    type: 'date',
    id: 'Imp_gen_InvoiceDate',
  },
  {
    label: 'IGM No',
    type: 'text',
    id: 'Imp_gen_IGMNo',
  },
  {
    label: 'IGM Date',
    type: 'date',
    id: 'Imp_gen_IGMDate',
  },
  {
    label: 'Line No',
    type: 'text',
    id: 'Imp_gen_LineItemNo',
  },
  {
    label: 'Sub Line No',
    type: 'text',
    id: 'Imp_gen_SubLineNo',
  },
  {
    label: 'Gross Weight',
    type: 'text',
    id: 'Imp_gen_GrossWt',
    validators: ['numbersOnly'],
  },
  {
    label: 'CBM',
    type: 'text',
    id: 'Imp_gen_CBM',
    validators: ['numbersOnly'],
  },
  {
    label: 'No of Package',
    type: 'text',
    id: 'Imp_gen_NoOfPackage',
    validators: ['numbersOnly'],
  },
  {
    label: 'Package Type',
    type: 'autocomplete',
    id: 'Imp_gen_PackageType',
  },
  {
    label: 'Unit Type',
    type: 'autocomplete',
    id: 'Imp_gen_UnitType',
  },
  {
    label: 'Marks & Number',
    type: 'text',
    id: 'Imp_gen_MarksNumber',
  },
  {
    label: 'Payment Terms',
    type: 'textarea',
    id: 'Imp_gen_PaymtTerms',
  },
];

export const IMP_GENERAL_GRID = [
  {
    label: 'Container Size',
    type: 'autocomplete',
    id: 'gen_ContainerSizeGrid',
    method: 'fetchContainerTypeSuggestions',
    payloadType: 'common',
    readonly: true,
  },
  {
    label: 'Container No',
    type: 'text',
    id: 'gen_ContainerNoGrid',
    readonly: true,
  },
];

export const IMP_CONTAINER_FIELDS = [
  {
    label: 'Container Size',
    type: 'select',
    id: 'Imp_cont_ContainerSize',
    mandatory: true,
    options: [],
  },
  {
    label: 'Container No',
    type: 'autocomplete',
    id: 'Imp_cont_ContainerNo',
    mandatory: true,
  },
  {
    label: 'Empty Yard Name',
    type: 'autocomplete',
    id: 'Imp_cont_EmptyName',
    validators: ['lettersOnly'],
  },
  {
    label: 'Empty Yard Address',
    type: 'textarea',
    id: 'Imp_gen_EmptyYardAddress',
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
  {
    label: 'Remarks',
    type: 'textarea',
    id: 'Imp_cont_Remarks',
  },
  {
    label: 'Mark as Empty Returned',
    type: 'checkbox',
    id: 'Imp_cont_MarkAsEmptyReturn',
  },
];

export const IMP_VESSEL_FIELDS = [
  {
    label: 'POL',
    type: 'autocomplete',
    id: 'Imp_vess_POL',
  },
  {
    label: 'POD',
    type: 'autocomplete',
    id: 'Imp_vess_POD',
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
