import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  inject,
  EventEmitter,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MENU_ITEMS, MenuItem } from './menu-items';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, RouterModule],
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
  @Input() menuItems: MenuItem[] = MENU_ITEMS;

  isExpanded = true;
  searchTerm = '';
  filteredMenuItems: MenuItem[] = [];
  router = inject(Router);

  @Output() sidebarToggled = new EventEmitter<boolean>();

  ngOnInit() {
    this.sortMenuItems();
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
    this.sidebarToggled.emit(this.isExpanded);
  }

  toggleMenuItem(item: MenuItem) {
    if (item.children?.length) {
      item.isExpanded = !item.isExpanded;
    } else {
      this.selectMenuItem(item);
    }
  }

  sortMenuItems() {
    this.menuItems.sort((a, b) => a.position - b.position);
    this.menuItems.forEach((item) => {
      if (item.children) {
        item.children.sort((a, b) => a.position - b.position);
      }
    });
    this.filteredMenuItems = [...this.menuItems];
  }

  selectMenuItem(item: MenuItem) {
    const parent = this.menuItems.find((menu) =>
      menu.children?.some((child) => child.id === item.id)
    );

    // if (parent && parent.label === 'Masters' && item.route) {
    //   const url = this.router.serializeUrl(
    //     this.router.createUrlTree([item.route])
    //   );
    //   window.open(url, '_blank');
    //   return;
    // }

    if (parent && parent.label === 'Masters' && item.route) {
      const url = this.router.serializeUrl(
        this.router.createUrlTree([item.route], {
          queryParams: { noSidebar: true },
        })
      );
      window.open(url, '_blank');
      return;
    }

    if (item.route) {
      this.router.navigate([item.route]);
    }

    this.menuItems.forEach((menuItem) => {
      menuItem.isActive = false;
      menuItem.children?.forEach((child) => (child.isActive = false));
    });
    item.isActive = true;

    const isChildItem = parent !== undefined;
    if (isChildItem) {
      this.isExpanded = false;
      this.sidebarToggled.emit(this.isExpanded);
    }
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
