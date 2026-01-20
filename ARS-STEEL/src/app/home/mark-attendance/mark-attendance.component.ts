import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-mark-attendance',
  templateUrl: './mark-attendance.component.html',
  styleUrls: ['./mark-attendance.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MarkAttendanceComponent implements OnInit {

  // View State
  isFormOpen: boolean = false;
  currentDateTime: string = '';

  // Form Data
  transportMode: string = '';
  
  // Private Data
  vehicleType: string = '';
  odometerReading: any = ''; // using any to allow empty string initially
  odometerPhoto: File | null = null;

  // Public Data
  publicTransportType: string = '';
  ticketFile: File | null = null;

  constructor() { }

  ngOnInit() {
    this.updateDateTime();
  }

  updateDateTime() {
    const now = new Date();
    // Matching the format: "16 January 2026 - 04:44 PM"
    const datePart = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const timePart = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    this.currentDateTime = `${datePart} - ${timePart}`;
  }

  openCheckIn() {
    this.isFormOpen = true;
  }

  goBack() {
    this.isFormOpen = false;
    this.resetForm();
  }

  // Handle File Inputs with Strict Validation
  onFileSelected(event: any, type: 'private' | 'public') {
    const file = event.target.files[0];
    
    if (file) {
      // 1. Define allowed MIME types
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

      // 2. Validate file type
      if (!allowedTypes.includes(file.type)) {
        alert('Invalid file type. Please upload only JPG or PNG images.');
        
        // Clear the input so the user can try again
        event.target.value = ''; 
        
        // Reset the specific model variable just in case
        if (type === 'private') this.odometerPhoto = null;
        else this.ticketFile = null;
        
        return;
      }

      // 3. If valid, assign the file
      if (type === 'private') {
        this.odometerPhoto = file;
      } else {
        this.ticketFile = file;
      }
    }
  }

  // Logic to change button color
  get isFormValid(): boolean {
    if (this.transportMode === 'private') {
      return !!(this.vehicleType && this.odometerReading && this.odometerPhoto);
    } else if (this.transportMode === 'public') {
      return !!(this.publicTransportType && this.ticketFile);
    }
    return false;
  }

  onCheckIn() {
    if (this.isFormValid) {
      console.log('Success! Checking in...');
      // API Call goes here
      // You can access the data via: this.transportMode, this.odometerPhoto, etc.
    }
  }

  resetForm() {
    this.transportMode = '';
    this.vehicleType = '';
    this.odometerReading = '';
    this.odometerPhoto = null;
    this.publicTransportType = '';
    this.ticketFile = null;
  }
}