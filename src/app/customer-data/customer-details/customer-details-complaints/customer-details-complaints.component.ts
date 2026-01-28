import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-customer-details-complaints',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './customer-details-complaints.component.html',
  styleUrls: ['./customer-details-complaints.component.scss']
})
export class CustomerDetailsComplaintsComponent implements OnInit {

  @ViewChild('cardsContainer', { static: false }) cardsContainer!: ElementRef;

  complaints: any[] = [];
  currentIndex: number = 0;

  constructor(private customerService: CustomerService) {}

  // ✅ Correct lifecycle hook for tab-based components
  ngOnInit() {
    this.loadComplaints();
  }

  loadComplaints() {
  this.customerService.getCustomerComplaints().subscribe({
    next: (data: any) => {
      this.complaints = (data.complaints || []).slice(0, 5).map((c: any) => ({
        complaintId: c.complaintId,
        date: c.complaintDate,      // ✅ correct
        category: c.category,       // ✅ correct
        status: c.status,           // ✅ correct
        priority: c.priority,       // ✅ new (optional)
        description: c.description, // ✅ new (optional)
        relatedOrderId: c.relatedOrderId // ✅ optional
      }));
    },
    error: () => {
      this.complaints = [];
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
    if (this.currentIndex < this.complaints.length - 1) {
      this.currentIndex++;
      this.scrollToCurrentCard();
    }
  }

  private scrollToCurrentCard() {
    if (!this.cardsContainer) return;

    const container = this.cardsContainer.nativeElement;
    const cards = container.querySelectorAll('.complaint-card');

    if (cards[this.currentIndex]) {
      container.scrollTo({
        left: cards[this.currentIndex].offsetLeft,
        behavior: 'smooth'
      });
    }
  }
}
