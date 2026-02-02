import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { FormsModule } from '@angular/forms';

interface CustomerCard {
  customerId: string;
  name: string;
  address: string;
  personName: string;
  phone: string;
}

@Component({
  selector: 'app-customer-data',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,   // REQUIRED for routerLink
    FormsModule
  ],
  templateUrl: './customer-data.component.html',
  styleUrls: ['./customer-data.component.scss'],
})
export class CustomerDataComponent implements OnInit {

  customers: CustomerCard[] = [];
  searchText: string = '';
  filteredCustomers: CustomerCard[] = [];

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private customerService: CustomerService
  ) {}

  ngOnInit() {
    this.loadCustomerData();
  }

  loadCustomerData() {
    this.customerService.getCustomerData().subscribe(data => {
      this.customers = data.customer.map((c: any) => ({
        customerId: c.customerId,
        name: c.name,
        address: c.address.billing,
        personName: c.contactPerson,
        phone: c.mobile
      }));
      this.filteredCustomers = [...this.customers];
    });
  }

  filterCustomers() {
  const search = this.searchText.toLowerCase().trim();

  if (!search) {
    this.filteredCustomers = [...this.customers];
    return;
  }

  this.filteredCustomers = this.customers.filter(customer =>
    customer.name.toLowerCase().includes(search)
  );
}

  goBack() {
    this.navCtrl.back();
  }

  /** REQUIRED for ngFor stability */
  trackByCustomer(index: number, customer: CustomerCard) {
    return customer.customerId;
  }
}
