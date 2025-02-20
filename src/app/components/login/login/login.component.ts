import { Component, inject, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../../services/authentication.service';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { ToastComponent } from '../../layout/toast/toast.component';
import { ToastService } from '../../../services/toast.service';
import CryptoJS from 'crypto-js';
import { ClientinfoService } from '../../../services/clientinfo.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule, ToastComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  fieldTextType: boolean = false;
  loginObj: any = {
    UserName: '',
    Password: '',
  };
  CompanyID: any;

  private secureKey = 'wHq4RhDiO5zZRLg8xzHBhJ8WZJlpjtLHaPEvX3F1+aQ=';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private toastService: ToastService,
    private ClientinfoService: ClientinfoService
  ) {}

  agentLogin = inject(AuthenticationService);
  router = inject(Router);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const Token = localStorage.getItem('authToken');
      if (Token) {
        this.router.navigateByUrl('/dashboard');
      }
    }
    const siteUrl = this.document.location.hostname;
    this.ClientinfoService.getClientInfo(siteUrl).subscribe(
      (data) => {
        if (data.Status === 'Success') {
          this.CompanyID = data.CompanyId;
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('CompanyID', data.CompanyId);
          }
        } else {
          console.error(data.Message);
        }
      },
      (error) => {
        console.error('Error fetching client info', error);
      }
    );
  }

  onLogin() {
    if (!this.loginObj.UserName || !this.loginObj.Password) {
      this.toastService.addToast(
        'error',
        'Error',
        'Please enter both username and password.'
      );
      return;
    }

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
      CompanyId: this.CompanyID,
      UserName: this.loginObj.UserName,
      Password: payload,
    };

    this.agentLogin.agentLogin(loginData).subscribe((res: any) => {
      if (res.Status === 'Success') {
        localStorage.setItem('authToken', res.Token);
        localStorage.setItem('AgentID', res.AgentID);
        localStorage.setItem('AgentName', res.AgentName);
        this.router.navigateByUrl('/dashboard');
      } else {
        this.toastService.addToast('error', 'Login Failed', res.Message);
      }
    });
  }

  togglePasswordVisibility() {
    this.fieldTextType = !this.fieldTextType;
  }
}
