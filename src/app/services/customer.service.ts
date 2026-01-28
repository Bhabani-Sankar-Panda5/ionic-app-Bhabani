import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private customerUrl = 'assets/data/customer.json';

  constructor(private http: HttpClient) {}

  getCustomerData(): Observable<any> {
    return this.http.get<any>(this.customerUrl);
  }

  getCustomerComplaints() {
  return this.getCustomerData(); // reuse same JSON
}

getCustomerVisits() {
  return this.getCustomerData(); // reuse same JSON
}

}
