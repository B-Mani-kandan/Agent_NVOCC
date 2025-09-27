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
        label: 'Client Master',
        route: 'master/client-master',
        icon: 'ri-service-line',
      },
      {
        id: 4,
        position: 2,
        label: 'Shipper Master',
        route: 'master/Shipper-master',
        icon: 'ri-ship-2-fill',
      },
      {
        id: 5,
        position: 3,
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
    ],
  },
  {
    id: 3,
    position: 3,
    label: 'Export',
    route: '/layout',
    icon: 'ri-upload-2-line',
    children: [
      {
        id: 4,
        position: 1,
        label: 'Export Sea Planning',
        route: '/export-sea-planning',
        icon: 'ri-ship-line',
      },
      {
        id: 5,
        position: 2,
        label: 'Container Booking',
        route: '/container-booking',
        icon: 'ri-truck-line',
      },
      {
        id: 6,
        position: 3,
        label: 'HBL Draft',
        route: '/hbl-draft',
        icon: 'ri-file-list-3-line',
      },
    ],
  },
  {
    id: 4,
    position: 3,
    label: 'Import',
    route: '/layout',
    icon: 'ri-download-2-line',
    children: [
      {
        id: 4,
        position: 1,
        label: 'Import Sea Planning',
        route: '/import-sea-planning',
        icon: 'ri-sailboat-line',
      },
      // {
      //   id: 2,
      //   position: 2,
      //   label: 'Empty Return',
      //   route: '/empty-return',
      //   icon: 'ri-arrow-go-back-line',
      // },
    ],
  },
];
