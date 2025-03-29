import { Component, OnInit, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
@Component({
  selector: 'app-topbar',
  imports: [FontAwesomeModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css',
})
export class TopbarComponent implements OnInit {
  UserName: any;
  faArrowRightFromBracket = faRightFromBracket;
  router = inject(Router);
  ngOnInit(): void {
    this.UserName = localStorage.getItem('AgentName');
  }

  LogOut() {
    localStorage.clear();
    this.router.navigateByUrl('/login').then(() => {
      window.location.reload();
    });
  }
}
