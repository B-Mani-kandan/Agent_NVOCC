export const HBL_COMMON_FIELDS = [
  {
    label: 'BL Type',
    type: 'select',
    id: 'common_BLType',
    options: [
      'Sea Way BL',
      'Surrender BL',
      'RFSBL',
      'FCR',
      'Express BL',
      'Original BL',
    ],
  },
  {
    label: 'Job No',
    type: 'text',
    id: 'common_JobNo',
    validators: ['numbersOnly'],
    readonly: true,
  },
  {
    label: 'BL No',
    type: 'text',
    id: 'common_BLNo',
    validators: ['numbersOnly'],
  },
  {
    label: 'Registartion No',
    type: 'text',
    id: 'common_RegistrationNo',
    validators: ['numbersOnly'],
  },
];

export const HBL_GENERAL_FIELDS = [
  {
    label: 'Shipper Name',
    type: 'autocomplete',
    id: 'common_ShipperName',
    validators: ['lettersOnly'],
  },
  {
    label: 'Shipper Address',
    type: 'textarea',
    id: 'common_ShipperAddress',
    validators: ['lettersNumbersCommaDot'],
  },
  {
    label: 'Consignee Name',
    type: 'autocomplete',
    id: 'common_ConsigneeName',
    validators: ['lettersOnly'],
  },
  {
    label: 'Consignee Address',
    type: 'textarea',
    id: 'common_ConsigneeAddress',
    validators: ['lettersNumbersCommaDot'],
  },
  {
    label: 'Notify-1 Name',
    type: 'autocomplete',
    id: 'common_Notify_1Name',
    validators: ['lettersOnly'],
  },
  {
    label: 'Notify-1 Address',
    type: 'textarea',
    id: 'common_Notify_1Address',
    validators: ['lettersNumbersCommaDot'],
  },
  {
    label: 'Notify-2 Name',
    type: 'autocomplete',
    id: 'common_Notify_2Name',
    validators: ['lettersOnly'],
  },
  {
    label: 'Notify-2 Address',
    type: 'textarea',
    id: 'common_Notify_2Address',
    validators: ['lettersNumbersCommaDot'],
  },
  {
    label: 'Destination Agent',
    type: 'autocomplete',
    id: 'common_DestinationAgent',
  },
  {
    label: 'Destination Agent Address',
    type: 'textarea',
    id: 'common_DestinationAgentAddress',
  },
  {
    label: 'Forwarding Agent',
    type: 'autocomplete',
    id: 'common_ForwardingAgent',
  },
  {
    label: 'Forwarding Agent Address',
    type: 'textarea',
    id: 'common_ForwardingAgentAddress',
    validators: ['lettersNumbersCommaDot'],
  },
  {
    label: 'Export Reference',
    type: 'textarea',
    id: 'common_ExportReferance',
  },
  {
    label: 'Consignee Reference',
    type: 'textarea',
    id: 'common_ConsigneeReferance',
  },
  {
    label: 'Point & Country of Orgin',
    type: 'textarea',
    id: 'common_PointOrginGoods',
  },
];

export const HBL_CARGO_FIELDS = [
  {
    label: 'POR',
    type: 'text',
    id: 'common_POR',
  },
  {
    label: 'POR to be Printed',
    type: 'text',
    id: 'common_PORPrinted',
  },
  {
    label: 'POL',
    type: 'autocomplete',
    id: 'common_POL',
  },
  {
    label: 'POL to be Printed',
    type: 'text',
    id: 'common_POLPrinted',
  },
  {
    label: 'POD',
    type: 'autocomplete',
    id: 'common_POD',
  },
  {
    label: 'POD to be Printed',
    type: 'text',
    id: 'common_PODPrinted',
  },
  {
    label: 'FPOD',
    type: 'autocomplete',
    id: 'common_FPOD',
  },
  {
    label: 'FPOD to be Printed',
    type: 'text',
    id: 'common_FPODPrinted',
  },
  {
    label: 'Pre-Carriage',
    type: 'text',
    id: 'common_PreCarriage',
  },
  {
    label: 'Mode Of Transport',
    type: 'text',
    id: 'common_ModOfTransport',
  },
  {
    label: 'Vessel Name',
    type: 'autocomplete',
    id: 'common_VesselName',
    validators: ['lettersOnly'],
  },
  {
    label: 'Voyage No',
    type: 'text',
    id: 'common_VoyageNo',
  },
  {
    label: 'ETD',
    type: 'date',
    id: 'common_ETD',
  },
  {
    label: 'ETA',
    type: 'date',
    id: 'common_ETA',
  },
  {
    label: 'No of Package',
    type: 'text',
    id: 'common_NoofPackage',
  },
  {
    label: 'Package Type',
    type: 'autocomplete',
    id: 'common_PackageType',
    validators: ['lettersOnly'],
  },
  {
    label: 'Gross Weight',
    type: 'text',
    id: 'common_GrossWt',
  },
  {
    label: 'Net Weight',
    type: 'text',
    id: 'common_Netwt',
  },
  {
    label: 'Unit Type',
    type: 'autocomplete',
    id: 'common_UnitType',
  },
  {
    label: 'CBM',
    type: 'text',
    id: 'common_CBM',
  },
  {
    label: 'Invoice No',
    type: 'text',
    id: 'common_InvoiceNo',
  },
  {
    label: 'Invoice Date',
    type: 'date',
    id: 'common_InvoiceDate',
  },
  {
    label: 'Invoice Currency',
    type: 'autocomplete',
    id: 'common_InvoiceCurrency',
  },
  {
    label: 'SB No',
    type: 'text',
    id: 'common_SBNo',
  },
  {
    label: 'SB Date',
    type: 'date',
    id: 'common_SBDate',
  },
  {
    label: 'Container Booking No',
    type: 'text',
    id: 'common_ContBookNo',
  },
  {
    label: 'No Of Containers',
    type: 'text',
    id: 'common_NoOfCont',
  },
  {
    label: 'ContainerNo/Agent sealNo',
    type: 'textarea',
    id: 'common_AgentsealNo',
  },
  {
    label: 'Description',
    type: 'textarea',
    id: 'common_Description',
  },
  {
    label: 'Marks & No',
    type: 'textarea',
    id: 'common_MarksNo',
  },
  {
    label: 'Clause',
    type: 'textarea',
    id: 'common_Clause',
  },
];

export const HBL_FREIGHT_FIELDS = [
  {
    label: 'Date Of Issue',
    type: 'date',
    id: 'common_DateOfIssue',
  },
  {
    label: 'Free Days',
    type: 'text',
    validators: ['numbersOnly'],
    id: 'common_FreeDays',
  },
  {
    label: 'Freight Type',
    type: 'select',
    id: 'common_FreightType',
    options: ['Prepaid', 'Collect'],
  },
  {
    label: 'Inco Terms',
    type: 'autocomplete',
    id: 'common_IncoTerms',
  },
  {
    label: 'Freight Payable At',
    type: 'text',
    id: 'common_FreightPayable',
  },
  {
    label: 'On Board Date',
    type: 'date',
    id: 'common_OnBoardDate',
  },
  {
    label: 'Final',
    type: 'checkbox',
    id: 'common_Final',
  },
  {
    label: 'Remark',
    type: 'textarea',
    id: 'common_Remark',
  },
  {
    label: 'Place',
    type: 'text',
    id: 'common_Place',
  },
  {
    label: 'Place Of Transport',
    type: 'text',
    id: 'common_PlaceOfTransport',
  },
  {
    label: 'Freight Amount',
    type: 'text',
    validators: ['numbersOnly'],
    id: 'common_FreightAmount',
  },
  {
    label: 'SOB',
    type: 'checkbox',
    id: 'common_SOB',
  },
  {
    label: 'No Of Original',
    type: 'text',
    id: 'common_NoOfOriginal',
    validators: ['numbersOnly'],
  },
  {
    label: 'MTD NO',
    type: 'text',
    id: 'common_MTDNO',
  },
  {
    label: 'MBL NO',
    type: 'text',
    id: 'common_MBLNO',
  },
  {
    label: 'Approver',
    type: 'select',
    id: 'common_Approver',
    options: [],
  },
  {
    label: 'RFS',
    type: 'checkbox',
    id: 'common_RFS',
  },
];

export const HBL_FREIGHTGRID_FIELDS = [
  {
    label: 'Charge Name',
    type: 'autocomplete',
    id: 'common_ChargeName',
    method: 'fetchChargeNameSuggestions',
    payloadType: 'common',
  },
  {
    label: 'Freight Ton',
    type: 'text',
    id: 'common_FreightTon',
  },
  {
    label: 'Rate',
    type: 'text',
    id: 'common_Rate',
  },
  {
    label: 'Freight Amount',
    type: 'text',
    id: 'common_FreightAmt',
  },
];

export const HBL_ANNEXUREGRID_FIELDS = [
  {
    label: 'Marks & Number',
    type: 'text',
    id: 'common_MarksNumber',
  },
  {
    label: 'Description of Goods',
    type: 'text',
    id: 'common_DescOfGoods',
  },
  {
    label: 'Net Weight',
    type: 'text',
    id: 'common_NetGridWeight',
  },
  {
    label: 'Gross Weight',
    type: 'text',
    id: 'common_GrossGridWeight',
  },
];

export const HBL_CONTAINERGRID_FIELDS = [
  {
    label: 'Container No',
    type: 'text',
    id: 'common_ContainerNo',
  },
  {
    label: 'Line Seal No',
    type: 'text',
    id: 'common_LineSealNo',
  },
  {
    label: 'Custom Seal No',
    type: 'text',
    id: 'common_CustomSealNo',
  },
  {
    label: 'Container Type',
    type: 'autocomplete',
    id: 'common_ContainerType',
    method: 'fetchContainerTypeSuggestions',
    payloadType: 'common',
  },
  {
    label: 'Gross Weight',
    type: 'text',
    id: 'common_GrossWeight',
  },
  {
    label: 'Net Weight',
    type: 'text',
    id: 'common_NetWeight',
  },
  {
    label: 'Volume',
    type: 'text',
    id: 'common_Volume',
  },
  {
    label: 'WT Type',
    type: 'autocomplete',
    id: 'common_WTType',
    method: 'fetchUnitTypeSuggestions',
    payloadType: 'common',
  },
  {
    label: 'No Of PKGS',
    type: 'text',
    id: 'common_NoOfPKGS',
  },
  {
    label: 'PKG Type',
    type: 'autocomplete',
    id: 'common_PKGType',
    method: 'fetchPackageCodeSuggestions',
    payloadType: 'InputVal',
  },
  {
    label: 'Mode',
    type: 'text',
    id: 'common_Mode',
  },
];
