import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-customer-details-order',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './customer-details-order.component.html',
  styleUrls: ['./customer-details-order.component.scss']
})
export class CustomerDetailsOrderComponent implements AfterViewInit {
  @ViewChild('cardsContainer', { static: false }) cardsContainer!: ElementRef;

  orders: any[] = [];
  currentIndex: number = 0; // track current visible card index

  constructor(private customerService: CustomerService) {}

  ngAfterViewInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.customerService.getCustomerData().subscribe({
      next: (data: any) => {
        this.orders = data.orders.slice(0, 5).map((o: any) => ({
          orderNumber: o.orderId,
          date: o.orderDate,
          items: o.totalItems,
          amount: o.orderValue,
          status: o.status,
          address: o.shipToAddress
        }));
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
    if (this.currentIndex < this.orders.length - 1) {
      this.currentIndex++;
      this.scrollToCurrentCard();
    }
  }

  private scrollToCurrentCard() {
    const container = this.cardsContainer.nativeElement;
    const card = container.querySelectorAll('.order-card')[this.currentIndex];
    if (card) {
      const cardLeft = card.offsetLeft;
      container.scrollTo({ left: cardLeft, behavior: 'smooth' });
    }
  }
}
