import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-customer-details-visits',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './customer-details-visits.component.html',
  styleUrls: ['./customer-details-visits.component.scss']
})
export class CustomerDetailsVisitsComponent implements AfterViewInit {
  @ViewChild('cardsContainer', { static: false }) cardsContainer!: ElementRef;

  visits: any[] = [];
  currentIndex: number = 0;

  constructor(private customerService: CustomerService) {}

  ngAfterViewInit() {
    this.loadVisits();
  }

  loadVisits() {
    this.customerService.getCustomerVisits().subscribe({
      next: (data: any) => {
        this.visits = (data.visits || []).slice(0, 5).map((v: any) => ({
          visitId: v.visitId,
          date: v.visitDate,      // ✅ correct
          purpose: v.purpose,     // ✅ correct
          visitedBy: v.visitedBy, // ✅ correct
          remarks: v.remarks,     // ✅ optional
          repMobile: v.repMobile  // ✅ optional
        }));
      },
      error: () => {
        this.visits = [];
      }
    });
  }



  scrollLeft() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.scrollToCurrentCard();
    }
  }

  scrollRight() {
    if (this.currentIndex < this.visits.length - 1) {
      this.currentIndex++;
      this.scrollToCurrentCard();
    }
  }

  private scrollToCurrentCard() {
    const container = this.cardsContainer.nativeElement;
    const card = container.querySelectorAll('.visit-card')[this.currentIndex];
    if (card) {
      container.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
    }
  }
}
