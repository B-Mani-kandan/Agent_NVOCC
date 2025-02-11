import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../../services/authentication.service';
import CryptoJS from 'crypto-js';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginObj: any = {
    UserName: '',
    Password: '',
  };

  ngOnInit(): void {
    const Token = localStorage.getItem('authToken');
    if (Token != null || Token != '') {
      this.router.navigateByUrl('/layout');
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  private secureKey = 'wHq4RhDiO5zZRLg8xzHBhJ8WZJlpjtLHaPEvX3F1+aQ=';

  agentLogin = inject(AuthenticationService);
  router = inject(Router);

  onLogin() {
    const iv = CryptoJS.lib.WordArray.random(16);
    const encryptedPassword = CryptoJS.AES.encrypt(
      this.loginObj.Password,
      CryptoJS.enc.Base64.parse(this.secureKey),
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    ).toString();

    const ivBase64 = CryptoJS.enc.Base64.stringify(iv);
    const payload = `${ivBase64}:${encryptedPassword}`;

    const loginData = {
      CompanyId: 'FST2223005',
      UserName: this.loginObj.UserName,
      Password: payload,
    };

    this.agentLogin.agentLogin(loginData).subscribe((res: any) => {
      if (res.Status === 'Success') {
        localStorage.setItem('authToken', res.Token);
        this.router.navigateByUrl('/layout');
      }
    });
  }
}
