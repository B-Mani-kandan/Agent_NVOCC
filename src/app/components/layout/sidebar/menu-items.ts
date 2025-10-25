export interface MenuItem {
  id: number;
  position: number;
  label: string;
  icon: string;
  route?: string;
  isActive?: boolean;
  isExpanded?: boolean;
  badge?: string;
  children?: MenuItem[];
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 1,
    position: 1,
    label: 'Dashboard',
    icon: 'ri-dashboard-line',
    route: '/dashboard',
    isActive: true,
  },
  {
    id: 2,
    position: 2,
    label: 'Masters',
    route: '/layout',
    icon: 'ri-user-line',
    children: [
      {
        id: 3,
        position: 1,
        label: 'Shipper Master',
        route: 'master/Shipper-master',
        icon: 'ri-truck-line',
      },
      {
        id: 4,
        position: 2,
        label: 'Consignee Master',
        route: 'master/consignee-master',
        icon: 'ri-hand-coin-fill',
      },
      {
        id: 5,
        position: 3,
        label: 'Common Master',
        route: 'master/common-master',
        icon: 'ri-list-settings-line',
      },
      {
        id: 6,
        position: 4,
        label: 'Vessel Master',
        route: 'master/vessel-master',
        icon: 'ri-ship-2-fill',
      },
      {
        id: 7,
        position: 5,
        label: 'Mail Setting',
        route: 'master/mail-setting',
        icon: 'ri-mail-settings-line',
      },
    ],
  },
  {
    id: 8,
    position: 3,
    label: 'Export',
    route: '/layout',
    icon: 'ri-upload-2-line',
    children: [
      {
        id: 9,
        position: 1,
        label: 'Export Sea Planning',
        route: 'export/export-sea-planning',
        icon: 'ri-ship-line',
      },
      {
        id: 10,
        position: 2,
        label: 'Container Booking',
        route: 'export/container-booking',
        icon: 'ri-truck-line',
      },
      {
        id: 11,
        position: 3,
        label: 'HBL Draft',
        route: 'export/hbl-draft',
        icon: 'ri-file-list-3-line',
      },
      {
        id: 12,
        position: 4,
        label: 'Pre Alert Mail',
        route: 'export/pre-alert-mail',
        icon: 'ri-mail-send-line',
      },
    ],
  },
  {
    id: 13,
    position: 3,
    label: 'Import',
    route: '/layout',
    icon: 'ri-download-2-line',
    children: [
      {
        id: 14,
        position: 1,
        label: 'Import Sea Planning',
        route: 'import/import-sea-planning',
        icon: 'ri-sailboat-line',
      },
    ],
  },
];
