import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';

// Import your other standalone components
import { ArsMobileAppComponent } from './ars-mobile-app/ars-mobile-app.component';
import { MarkAttendanceComponent } from './mark-attendance/mark-attendance.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ArsMobileAppComponent,
    MarkAttendanceComponent
  ],
  declarations: [HomePage] 
})
export class HomePageModule {}