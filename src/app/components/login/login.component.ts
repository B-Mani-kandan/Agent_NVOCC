import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { DOCUMENT, isPlatformBrowser, CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { ClientinfoService } from '../../services/clientinfo.service';
import CryptoJS from 'crypto-js';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LoaderComponent } from '../layout/loader/loader.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    CommonModule,
    ToastModule,
    LoaderComponent,
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  fieldTextType: boolean = false;
  siteUrl: any;
  isLoading = false;
  clientViewURL: any;
  loginObj: any = { UserName: '', Password: '' };
  CompanyID: any;
  private secureKey = 'wHq4RhDiO5zZRLg8xzHBhJ8WZJlpjtLHaPEvX3F1+aQ=';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private ClientinfoService: ClientinfoService,
    private agentLogin: AuthenticationService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // if (isPlatformBrowser(this.platformId)) {
    //   const Token = localStorage.getItem('authToken');
    //   if (Token) {
    //     this.router.navigateByUrl('/dashboard');
    //     return;
    //   }
    // }
    this.siteUrl = this.document.location.hostname;
    this.getClientViewURL();
    //this.getClientInfo();
  }

  getClientViewURL() {
    this.ClientinfoService.getClientViewUrl(this.siteUrl).subscribe((data) => {
      if (data.Status === 'Success') {
        this.clientViewURL = data.APIURL;

        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('ClientViewApiUrl', data.APIURL);
        }
        this.getClientInfo(data.APIURL);
      }
    });
  }

  getClientInfo(apiUrl?: string) {
    this.ClientinfoService.getClientInfo(apiUrl || this.siteUrl).subscribe(
      (data) => {
        if (data.Status === 'Success') {
          this.CompanyID = data.CompanyId;

          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('CompanyID', data.CompanyId);
          }
        }
      }
    );
  }

  onLogin() {
    if (!this.loginObj.UserName || !this.loginObj.Password) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation',
        detail: 'Username and Password required',
      });
      return;
    }
    this.isLoading = true;
    const iv = CryptoJS.lib.WordArray.random(16);
    const encryptedPassword = CryptoJS.AES.encrypt(
      this.loginObj.Password,
      CryptoJS.enc.Base64.parse(this.secureKey),
      { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
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
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('authToken', res.Token);
          localStorage.setItem('AgentID', res.AgentID);
          localStorage.setItem('AgentName', res.AgentName);
          localStorage.setItem('BranchId', res.BranchId);
          localStorage.setItem('CompId', res.CompId);
          localStorage.setItem('FinanceYear', res.FinacYear);
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Login Successful',
          detail: 'Redirecting to dashboard...',
        });
        this.isLoading = false;
        setTimeout(() => this.router.navigateByUrl('/dashboard'), 1000);
      } else {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: res.Message || 'Invalid credentials',
        });
      }
    });
  }

  togglePasswordVisibility() {
    this.fieldTextType = !this.fieldTextType;
  }
}
