import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-tab-panel',
  standalone: true,
  imports: [CommonModule, MatTabsModule],
  templateUrl: './tabpanel.component.html',
  styleUrls: ['./tabpanel.component.css'],
})
export class TabPanelComponent implements OnInit {
  @Input() tabs: string[] = [];
  @Input() tabContents: TemplateRef<any>[] = [];
  activeTab: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    if (!this.tabs.length) {
      this.fetchTabsFromBackend();
    }
  }

  fetchTabsFromBackend() {
    this.http.get<string[]>('https://api.example.com/tabs').subscribe({
      next: (data) => {
        this.tabs = data;
      },
      error: (err) => {
        console.error('Error fetching tabs:', err);
        this.tabs = [
          'Your Profile',
          'Business Information',
          'Additional Users',
        ];
      },
    });
  }

  setActiveTab(index: number) {
    this.activeTab = index;
  }
}
