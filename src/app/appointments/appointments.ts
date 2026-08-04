import { Component, ElementRef, Renderer2, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Appointment {
  id: string;
  labName: string;
  sede: string;
  city: string;
  dateLabel: string;
  timeLabel: string;
  reason: string;
  instructions: string;
  status: 'checked-in' | 'pending';
}

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css'
})
export class Appointments implements AfterViewInit, OnDestroy {
  @ViewChild('modalsRoot') modalsRoot!: ElementRef<HTMLDivElement>;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    // Mueve los modales fuera del árbol del componente, directo al <body>,
    // para que su z-index compita al nivel más alto posible.
    this.renderer.appendChild(document.body, this.modalsRoot.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.modalsRoot?.nativeElement?.parentNode) {
      this.modalsRoot.nativeElement.parentNode.removeChild(this.modalsRoot.nativeElement);
    }
  }

  appointments: Appointment[] = [
    {
      id: 'lab-hoy',
      labName: 'Laboratorio San José',
      sede: 'Sucursal Central',
      city: 'Quito',
      dateLabel: 'Hoy',
      timeLabel: '10:30 AM',
      reason: 'Examen de Rutina',
      instructions: 'Presentarse en ayunas de 8 horas. Muestra este código QR en el lector express de recepción para saltarte el papeleo manual.',
      status: 'checked-in'
    },
    {
      id: 'clinica-28jul',
      labName: 'Clínica de la Mujer',
      sede: 'Sede Eloy Alfaro',
      city: 'Quito',
      dateLabel: '28 Jul 2026',
      timeLabel: '09:00 AM',
      reason: 'Chequeo Preventivo',
      instructions: 'Llegar 10 minutos antes con documento de identidad original.',
      status: 'pending'
    }
  ];

  selectedIndex = 0;
  showManageModal = false;

  get selected(): Appointment {
    return this.appointments[this.selectedIndex];
  }

  selectTab(index: number): void {
    this.selectedIndex = index;
  }

  openManageModal(): void {
    this.showManageModal = true;
  }

  closeManageModal(): void {
    this.showManageModal = false;
  }

  saveReschedule(): void {
    // TODO: conectar con backend cuando exista
    this.closeManageModal();
  }

  cancelAppointment(): void {
    // TODO: conectar con backend cuando exista
    this.closeManageModal();
  }

  saveToGallery(): void {
    // TODO: implementar descarga/captura del QR
  }

  // --- Agendamiento Express (nueva cita / familiar) ---
  showBookingModal = false;

  examTypes = ['Examen de Rutina', 'Perfil Lipídico', 'Hemograma Completo', 'Prueba de Glucosa'];
  availabilityOptions = ['Hoy', 'Mañana', 'En 3 días'];
  timeSlots = ['08:00 AM', '09:30 AM', '10:30 AM', '11:45 AM', '02:00 PM', '04:30 PM'];

  selectedExamType = this.examTypes[0];
  selectedAvailability = this.availabilityOptions[0];
  selectedTimeSlot = this.timeSlots[0];

  openBookingModal(): void {
    this.showBookingModal = true;
  }

  closeBookingModal(): void {
    this.showBookingModal = false;
  }

  selectExamType(exam: string): void {
    this.selectedExamType = exam;
  }

  selectAvailability(option: string): void {
    this.selectedAvailability = option;
  }

  selectTimeSlot(slot: string): void {
    this.selectedTimeSlot = slot;
  }

  confirmBooking(): void {
    const newAppointment: Appointment = {
      id: `familiar-${Date.now()}`,
      labName: this.selected.labName,
      sede: this.selected.sede,
      city: this.selected.city,
      dateLabel: this.selectedAvailability,
      timeLabel: this.selectedTimeSlot,
      reason: this.selectedExamType,
      instructions: 'Presentarse en ayunas de 8 horas. Muestra este código QR en el lector express de recepción para saltarte el papeleo manual.',
      status: 'checked-in'
    };

    this.appointments.push(newAppointment);
    this.selectedIndex = this.appointments.length - 1;
    this.closeBookingModal();
  }
}