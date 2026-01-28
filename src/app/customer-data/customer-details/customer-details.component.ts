import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CustomerDetailsOrderComponent } from './customer-details-order/customer-details-order.component';
import { CustomerService } from '../../services/customer.service';
import { CustomerDetailsComplaintsComponent } from './customer-details-complaints/customer-details-complaints.component';
import { CustomerDetailsVisitsComponent } from './customer-details-visits/customer-details-visits.component';


interface Customer {
  name: string;
  mobile: string;
  segment: string;
  email: string;
  address: string;
  lastVisitBy: string;
  lastVisitDate: string;
  lastVisitMobile: string;
}

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    CustomerDetailsOrderComponent,
    CustomerDetailsComplaintsComponent,
    CustomerDetailsVisitsComponent
  ],
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
})
export class CustomerDetailsComponent implements OnInit {

  selectedTab: 'orders' | 'complaints' | 'visits' = 'orders';

  customer!: Customer;

  constructor(
    private navCtrl: NavController,
    private customerService: CustomerService
  ) {}

  ngOnInit() {
    this.loadCustomerDetails();
  }

  loadCustomerDetails() {
    this.customerService.getCustomerData().subscribe({
      next: (data) => {
        const selectedCustomer = data.customer[0]; // 👈 first customer for now

        this.customer = {
          name: selectedCustomer.name,
          mobile: selectedCustomer.mobile,
          segment: selectedCustomer.segment,
          email: selectedCustomer.email,
          address: selectedCustomer.address.billing,
          lastVisitBy: data.salesRep.name,
          lastVisitDate: data.lastVisit.visitDate,
          lastVisitMobile: data.salesRep.mobile
        };
      },
      error: (err) => {
        console.error('Failed to load customer details', err);
      }
    });
  }

  goBack() {
    this.navCtrl.back();
  }
}
