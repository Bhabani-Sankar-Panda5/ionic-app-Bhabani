import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

async ngOnInit() {
  await this.authService.init();

  const hasValidSession = await this.authService.hasValidSession();
  const sessionStatus = await this.authService.validateSession();
  const isOtpRequired = await this.authService.isOtpRequired();
  const hasToken = await this.authService.hasToken();
  const hasTokenNoSession = await this.authService.hasTokenButNoSession();

  // 1️⃣ Same day + valid session → HOME
  if (hasValidSession && sessionStatus === 'VALID' && !isOtpRequired) {
    this.router.navigate(['/home']);
    return;
  }

  // 2️⃣ Same day + token exists BUT session missing → LOGIN
  if (hasTokenNoSession && !isOtpRequired) {
    this.router.navigate(['/login']);
    return;
  }

  // 3️⃣ Token exists BUT new day → EMP ID (OTP decision)
  if (hasToken && isOtpRequired) {
    this.router.navigate(['/login-empid']);
    return;
  }

  // 4️⃣ No token at all → EMP ID
  this.router.navigate(['/login-empid']);
  //this.router.navigate(['/customer-data']);
}






}
