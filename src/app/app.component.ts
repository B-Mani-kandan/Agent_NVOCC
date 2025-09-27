import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    // this.checkExpiry();
    // this.handleTabClose();
  }
  title = 'agent_nvocc';

  private checkExpiry(): void {
    const loginTime = localStorage.getItem('loginTime');
    if (loginTime) {
      const diff = Date.now() - parseInt(loginTime, 10);
      const twelveHours = 12 * 60 * 60 * 1000;

      if (diff > twelveHours) {
        localStorage.clear();
      }
    }
  }

  private handleTabClose(): void {
    window.addEventListener('beforeunload', () => {
      localStorage.clear();
    });
  }
}
