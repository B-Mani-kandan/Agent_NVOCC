export interface IMP_AutocompleteFieldConfig {
  field: string;
  method: string;
  payloadType: string;
  formType: string;
}

export const IMP_AUTOCOMPLETE_FIELDS: IMP_AutocompleteFieldConfig[] = [
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
    field: 'Imp_cont_EmptyName',
    method: 'fetchEmptyYardNameSuggestions',
    payloadType: 'EmptyYard',
    formType: 'imp_ContainerForm',
  },
  {
    field: 'Imp_cont_ContainerNo',
    method: 'fetchContNoSuggestions',
    payloadType: 'ContainerNo',
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
  {
    field: 'Imp_gen_ClientName',
    method: 'fetchClientSuggestions',
    payloadType: 'client',
    formType: 'imp_Gen_PrintForm',
  },
  {
    field: 'Imp_gen_ShipperName',
    method: 'fetchShipperNameSuggestions',
    payloadType: 'common',
    formType: 'imp_Gen_PrintForm',
  },
  {
    field: 'Imp_gen_Consignee',
    method: 'fetchConsigneeNameSuggestions',
    payloadType: 'common',
    formType: 'imp_Gen_PrintForm',
  },
  {
    field: 'Imp_gen_CHAName',
    method: 'fetchCHANameSuggestions',
    payloadType: 'common',
    formType: 'imp_Gen_PrintForm',
  },
  {
    field: 'Imp_gen_UnitType',
    method: 'fetchUnitTypeSuggestions',
    payloadType: 'InputVal',
    formType: 'imp_Gen_PrintForm',
  },
  {
    field: 'Imp_gen_PackageType',
    method: 'fetchPackageTypeSuggestions',
    payloadType: 'InputVal',
    formType: 'imp_Gen_PrintForm',
  },
  {
    field: 'Imp_gen_DeStuff',
    method: 'fetchDeStuffPlaceSuggestions',
    payloadType: 'common',
    formType: 'imp_Gen_PrintForm',
  },
];
