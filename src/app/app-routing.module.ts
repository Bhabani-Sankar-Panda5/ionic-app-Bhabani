import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  // ✅ DEFAULT PAGE → LOGIN
  {
    path: '',
    redirectTo: 'customer-data',
    pathMatch: 'full',
  },

  // ✅ LOGIN PAGE
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.page')
        .then(m => m.LoginPage),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./auth/forgot-password/forgot-password.page')
        .then(m => m.ForgotPasswordPage)
  },
  {
  path: 'login-otp',
  loadComponent: () =>
    import('./auth/login-otp/login-otp.page').then(m => m.LoginOtpPage)
  },
  {
  path: 'login-mobile',
  loadComponent: () =>
    import('./auth/login-mobile/login-mobile.page').then(m => m.LoginMobilePage)
  },

  // CUSTOMER LIST PAGE
  {
    path: 'customer-data',
    loadComponent: () =>
      import('./customer-data/customer-data.component')
        .then(m => m.CustomerDataComponent),
  },

  // CUSTOMER DETAILS PAGE
  {
    path: 'customer-details',
    loadComponent: () =>
      import('./customer-data/customer-details/customer-details.component')
        .then(m => m.CustomerDetailsComponent),
  },

  // HOME (MODULE BASED)
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then(m => m.HomePageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
