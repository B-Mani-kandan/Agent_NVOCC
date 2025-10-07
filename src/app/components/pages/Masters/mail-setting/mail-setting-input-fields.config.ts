export const GENERAL_FIELDS = [
  {
    label: 'Agent Name',
    type: 'text',
    id: 'mail_Gen_AgentName',
    readonly: true,
  },
  {
    label: 'Email ID',
    type: 'text',
    id: 'mail_Gen_EmailID',
    validators: ['lettersNumbersCommaDot'],
  },
  {
    label: 'Password',
    type: 'text',
    id: 'mail_Gen_Password',
    validators: ['numbersOnly'],
  },
  {
    label: 'Host Name',
    type: 'text',
    id: 'mail_Gen_HostName',
    validators: ['lettersOnly'],
  },
  {
    label: 'Port No',
    type: 'text',
    id: 'mail_Gen_PortNo',
    validators: ['numbersOnly'],
  },
  {
    label: 'SSL Enabled',
    type: 'checkbox',
    id: 'mail_Gen_SSLEnabled',
  },
  {
    label: 'Logo for Mail',
    type: 'upload',
    id: 'mail_Gen_Logo',
  },
];
