export interface IMP_AutocompleteFieldConfig {
  field: string;
  method: string;
  payloadType: string;
  formType: string;
}

export const IMP_AUTOCOMPLETE_FIELDS: IMP_AutocompleteFieldConfig[] = [
  {
    field: 'Imp_gen_ClientName',
    method: 'fetchClientSuggestions',
    payloadType: 'client',
    formType: 'imp_GeneralForm',
  },
  {
    field: 'Imp_gen_Shipper',
    method: 'fetchShipperSuggestions',
    payloadType: 'common',
    formType: 'imp_GeneralForm',
  },
  {
    field: 'Imp_gen_Consignee',
    method: 'fetchConsigneeSuggestions',
    payloadType: 'common',
    formType: 'imp_GeneralForm',
  },
  {
    field: 'Imp_gen_Pol',
    method: 'fetchPortSuggestions',
    payloadType: 'common',
    formType: 'imp_GeneralForm',
  },
  {
    field: 'Imp_gen_Pod',
    method: 'fetchPortSuggestions',
    payloadType: 'common',
    formType: 'imp_GeneralForm',
  },
  {
    field: 'Imp_gen_Fpod',
    method: 'fetchPortSuggestions',
    payloadType: 'common',
    formType: 'imp_GeneralForm',
  },
  {
    field: 'Imp_gen_ShiplineName',
    method: 'fetchShippingLineSuggestions',
    payloadType: 'common',
    formType: 'imp_GeneralForm',
  },
  {
    field: 'Imp_gen_EmptyName',
    method: 'fetchEmptyYardNameSuggestions',
    payloadType: 'EmptyYard',
    formType: 'imp_GeneralForm',
  },
  {
    field: 'Imp_inv_Currency',
    method: 'fetchInvCurrencySuggestions',
    payloadType: 'InputVal',
    formType: 'imp_InvoiceForm',
  },
  {
    field: 'Imp_inv_Terms',
    method: 'fetchInvTermsSuggestions',
    payloadType: 'InputVal',
    formType: 'imp_InvoiceForm',
  },
  {
    field: 'Imp_inv_TypeOfPackage',
    method: 'fetchInvTypePackgSuggestions',
    payloadType: 'InputVal',
    formType: 'imp_InvoiceForm',
  },
  {
    field: 'Imp_inv_UnitType',
    method: 'fetchInvUnitSuggestions',
    payloadType: 'InputVal',
    formType: 'imp_InvoiceForm',
  },
  {
    field: 'Imp_inv_SuplierShipper',
    method: 'fetchSupplierNameSuggestions',
    payloadType: 'InputVal',
    formType: 'imp_InvoiceForm',
  },
  {
    field: 'Imp_cont_ContainerSize',
    method: 'fetchContSizeSuggestions',
    payloadType: 'InputVal',
    formType: 'imp_ContainerForm',
  },
  {
    field: 'Imp_vess_POL',
    method: 'fetchPortSuggestions',
    payloadType: 'common',
    formType: 'imp_VesselForm',
  },
  {
    field: 'Imp_vess_POD',
    method: 'fetchPortSuggestions',
    payloadType: 'common',
    formType: 'imp_VesselForm',
  },
  {
    field: 'Imp_vess_VesselName',
    method: 'fetchVesselNameSuggestions',
    payloadType: 'InputVal',
    formType: 'imp_VesselForm',
  },
];
