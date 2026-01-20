import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ars-mobile-app',
  templateUrl: './ars-mobile-app.component.html',
  styleUrls: ['./ars-mobile-app.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ArsMobileAppComponent  implements OnInit {

  
  todayVisits: number = 8;
  completedTasks: number = 12;
  
  totalVisits: number = 18;
  completionRate: number = 78;

  constructor() { }

  ngOnInit() {}
}