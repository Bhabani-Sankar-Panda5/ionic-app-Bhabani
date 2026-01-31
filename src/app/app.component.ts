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

  const hasSession = await this.authService.hasValidSession();
  const isOtpRequired = await this.authService.isOtpRequired();
  const sessionStatus = await this.authService.validateSession();
  const hasTokenButNoSession = await this.authService.hasTokenButNoSession();

  /**
   * 1️⃣ Valid session + same day → HOME
   */
  if (hasSession && sessionStatus === 'VALID' && !isOtpRequired) {
    this.router.navigate(['/home']);
    return;
  }

  /**
   * 2️⃣ Token exists BUT sessionId missing → Username/Password
   * (Multi-device logout / manual session delete)
   */
  if (hasTokenButNoSession) {
    await this.authService.clearSession();
    this.router.navigate(['/login']);
    return;
  }

  /**
   * 3️⃣ Everything else → OTP login
   * - First install
   * - loginDate deleted
   * - loginDate < today
   * - No token
   */
  this.router.navigate(['/login-mobile']);
}




}
