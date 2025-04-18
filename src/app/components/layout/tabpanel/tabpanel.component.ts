import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  Output,
  EventEmitter,
} from '@angular/core';
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
  @Input() disabledTabs: boolean[] = [];
  @Output() tabChanged = new EventEmitter<number>();
  activeTab: number = 0;
  constructor(private http: HttpClient) {}

  ngOnInit() {}

  setActiveTab(index: number) {
    this.activeTab = index;
  }
}
