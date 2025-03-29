import { Component, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-export-sea-planning',
  imports: [MatTabsModule, MatIconModule],
  templateUrl: './export-sea-planning.component.html',
  //styleUrl: './export-sea-planning.component.css',
  styleUrls: ['./export-sea-planning.component.scss'],

  encapsulation: ViewEncapsulation.None,
})
export class ExportSeaPlanningComponent {}
