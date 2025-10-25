export const GENERAL_FIELDS = [
  {
    label: 'Vessel Name',
    type: 'text',
    id: 'vessel_Gen_VesselName',
    mandatory: true,
    validators: ['lettersNumbersCommaDot'],
  },
  {
    label: 'Vessel Code',
    type: 'text',
    id: 'vessel_Gen_VesselCode',
    validators: ['lettersNumbersCommaDot'],
  },
  {
    label: 'Imo Code',
    type: 'text',
    id: 'vessel_Gen_ImoCode',
    validators: ['lettersNumbersCommaDot'],
  },
];
