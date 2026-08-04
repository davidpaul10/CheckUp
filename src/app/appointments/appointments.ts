import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-appointments',
  imports: [FormsModule],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css',
})
export class Appointments {
  checked: boolean = false;
}

