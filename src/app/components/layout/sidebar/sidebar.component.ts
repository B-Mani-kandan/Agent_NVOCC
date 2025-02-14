// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-sidebar',
//   imports: [],
//   templateUrl: './sidebar.component.html',
//   styleUrl: './sidebar.component.css'
// })
// export class SidebarComponent {

// }

import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';

interface MenuItem {
  label: string;
  icon: string;
  isActive?: boolean;
  isExpanded?: boolean;
  badge?: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, FormsModule],
  animations: [
    trigger('submenuAnimation', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('200ms ease-out', style({ height: '*', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ height: '*', opacity: 1 }),
        animate('200ms ease-in', style({ height: 0, opacity: 0 })),
      ]),
    ]),
  ],
})
export class SidebarComponent implements OnInit {
  @Input() menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      isActive: true,
    },
    {
      label: 'User Management',
      icon: 'people',
      children: [
        { label: 'User List', icon: 'list', badge: '99+' },
        { label: 'Roles', icon: 'security' },
        { label: 'Permissions', icon: 'lock' },
      ],
    },
    {
      label: 'Settings',
      icon: 'settings',
      children: [
        { label: 'Account', icon: 'account_circle' },
        { label: 'Preferences', icon: 'tune' },
      ],
    },
    {
      label: 'Analytics',
      icon: 'analytics',
      badge: 'New',
    },
    {
      label: 'Help & Support',
      icon: 'help',
    },
  ];

  isExpanded = true;
  searchTerm = '';
  filteredMenuItems: MenuItem[] = [];
  router = inject(Router);

  ngOnInit() {
    this.filteredMenuItems = [...this.menuItems];
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }

  toggleMenuItem(item: MenuItem) {
    if (item.children?.length) {
      item.isExpanded = !item.isExpanded;
    } else {
      this.selectMenuItem(item);
    }
  }

  selectMenuItem(item: MenuItem) {
    this.menuItems.forEach((menuItem) => {
      menuItem.isActive = false;
      menuItem.children?.forEach((child) => (child.isActive = false));
    });
    item.isActive = true;
  }

  filterMenuItems() {
    if (!this.searchTerm) {
      this.filteredMenuItems = [...this.menuItems];
      return;
    }

    this.filteredMenuItems = this.menuItems.filter(
      (item) =>
        item.label.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.children?.some((child) =>
          child.label.toLowerCase().includes(this.searchTerm.toLowerCase())
        )
    );
  }
}
