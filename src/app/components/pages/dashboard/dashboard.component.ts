import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true, // If using standalone components
  imports: [CommonModule], // Import CommonModule
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  appointments = [
    {
      time: '18:15 - 19:00',
      patient: 'Dianne Russell',
      insurance: 'health',
      test: 'Upper Abdomen General',
      technician: 'Kristin',
      location: '4517 Washington Ave, Manchester',
      status: 'Scheduled',
    },
    {
      time: '17:45 - 18:00',
      patient: 'Bessie Cooper',
      insurance: 'long-term disability',
      test: 'Gynecologic Disorders',
      technician: 'Kristin',
      location: '2715 Ash Dr, San Jose',
      status: 'Not confirmed',
    },
  ];
}
