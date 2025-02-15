import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-job-nvocc',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-nvocc.component.html',
  styleUrl: './job-nvocc.component.css',
})
export class JobNvoccComponent {
  router = inject(Router);

  customers = [
    {
      id: '5684236526',
      name: 'Ann Culhane',
      description: 'Lorem ipsum dolor sit amet...',
      status: 'Open',
      rate: 70,
      balance: -270,
      deposit: 500,
    },
    {
      id: '5684236527',
      name: 'Ahmad Rosser',
      description: 'Lorem ipsum dolor sit amet...',
      status: 'Paid',
      rate: 70,
      balance: 270,
      deposit: 500,
    },
    {
      id: '5684236528',
      name: 'Zain Calzoni',
      description: 'Lorem ipsum dolor sit amet...',
      status: 'Open',
      rate: 70,
      balance: -20,
      deposit: 500,
    },
    {
      id: '5684236529',
      name: 'Leo Stanton',
      description: 'Lorem ipsum dolor sit amet...',
      status: 'Inactive',
      rate: 70,
      balance: 600,
      deposit: 500,
    },
    {
      id: '5684236530',
      name: 'Kaiya Vetrovs',
      description: 'Lorem ipsum dolor sit amet...',
      status: 'Open',
      rate: 70,
      balance: -350,
      deposit: 500,
    },
    {
      id: '5684236531',
      name: 'Ryan Westervelt',
      description: 'Lorem ipsum dolor sit amet...',
      status: 'Paid',
      rate: 70,
      balance: -270,
      deposit: 500,
    },
    {
      id: '5684236532',
      name: 'Corey Stanton',
      description: 'Lorem ipsum dolor sit amet...',
      status: 'Due',
      rate: 70,
      balance: 30,
      deposit: 500,
    },
    {
      id: '5684236533',
      name: 'Adison Aminoff',
      description: 'Lorem ipsum dolor sit amet...',
      status: 'Open',
      rate: 70,
      balance: -270,
      deposit: 500,
    },
    {
      id: '5684236534',
      name: 'Alfredo Aminoff',
      description: 'Lorem ipsum dolor sit amet...',
      status: 'Inactive',
      rate: 70,
      balance: 460,
      deposit: 500,
    },
  ];
}
