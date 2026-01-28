import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit { 

  // --- USER DATA ---
  userName: string = 'Rajesh';

  // --- CAROUSEL DATA ---
  images: string[] = [
    'assets/banner1.jpg', 
    'assets/banner2.jpg',
    'assets/banner3.jpg'
  ];
  currentSlide = 0;

  // --- TRIP CARD DATA ---
  tripCurrentAmount: number = 48000;
  tripTargetAmount: number = 500000;
  tripPercentage: number = 0;

  constructor() {}

  ngOnInit() {
    this.calculateTripProgress();
  }

  calculateTripProgress() {
    if (this.tripTargetAmount > 0) {
      this.tripPercentage = (this.tripCurrentAmount / this.tripTargetAmount) * 100;
      // Cap at 100%
      if (this.tripPercentage > 100) this.tripPercentage = 100;
    }
  }

  // --- CAROUSEL SCROLL LOGIC ---
  onScroll(event: any) {
    const slider = event.target;
    // Calculate current index based on scroll position
    const index = Math.round(slider.scrollLeft / slider.offsetWidth);
    this.currentSlide = index;
  }
}