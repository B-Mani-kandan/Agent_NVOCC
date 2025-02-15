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
    label: 'Export',
    route: '/layout',
    icon: 'ri-user-line',
    children: [
      {
        id: 3,
        position: 1,
        label: 'Booking',
        route: '/nvocc-booking',
        icon: 'ri-list-check',
      },
    ],
  },
];
