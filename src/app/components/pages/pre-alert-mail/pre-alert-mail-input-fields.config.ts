export const GENERAL_FIELDS = [
  {
    label: 'MBL NO',
    type: 'autocomplete',
    id: 'gen_HblNo',
  },
  {
    id: 'btn_generateMail',
    label: 'Generate Mail',
    type: 'button',
    class: 'btn-primary',
    icon: 'ri-mail-line',
    function: 'onGenerateMail',
  },
  {
    id: 'btn_SendMail',
    label: 'Send Mail',
    type: 'button',
    class: 'btn-success',
    icon: 'ri-mail-send-line',
    function: 'onSendMail',
  },
];
