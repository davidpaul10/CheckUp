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
  mapRank: number;
  rating: number;
  distance: string;
  doctor?: string;
  preference?: string;
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

  showNotificationBadge = true;
  showNotificationTooltip = true;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.renderer.appendChild(document.body, this.modalsRoot.nativeElement);

    setTimeout(() => {
      this.showNotificationTooltip = false;
    }, 4000);
  }

  ngOnDestroy(): void {
    if (this.modalsRoot?.nativeElement?.parentNode) {
      this.modalsRoot.nativeElement.parentNode.removeChild(this.modalsRoot.nativeElement);
    }
  }

  toggleNotifications(): void {
    this.showNotificationTooltip = !this.showNotificationTooltip;
    this.showNotificationBadge = false;
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
      status: 'checked-in',
      mapRank: 1,
      rating: 4.8,
      distance: '1.2 km',
      doctor: 'Carlos Mendoza',
      preference: 'Prioritario'
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
      status: 'pending',
      mapRank: 2,
      rating: 4.6,
      distance: '2.5 km',
      doctor: 'Valeria Ruales',
      preference: 'General'
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
    this.closeManageModal();
  }

  cancelAppointment(): void {
    this.closeManageModal();
  }

  saveToGallery(): void {
    // Simulación de descarga de QR
  }

  // --- Función de Ruta Rápida con Maps ---
  openMapRoute(): void {
    const query = encodeURIComponent(`${this.selected.labName} ${this.selected.sede} ${this.selected.city}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  }

  // --- Función de Compartir Cita ---
  shareAppointment(): void {
    const text = `🏥 *Cita Médica / Laboratorio*\n📍 ${this.selected.labName} (${this.selected.sede})\n📅 Fecha: ${this.selected.dateLabel} a las ${this.selected.timeLabel}\n📝 Motivo: ${this.selected.reason}\n📌 Instrucciones: ${this.selected.instructions}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Mi Cita Médica',
        text: text
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      alert('¡Detalles de la cita copiado al portapapeles!');
    }
  }

  // --- Agendamiento Express ---
  showBookingModal = false;

  examTypes = ['Examen de Rutina', 'Perfil Lipídico', 'Hemograma Completo', 'Prueba de Glucosa'];
  doctorList = ['Carlos Mendoza', 'Valeria Ruales', 'Andrés Benítez', 'Sofía Salazar'];
  preferenceOptions = ['Prioritario', 'Trato Preferencial', 'General'];
  availabilityOptions = ['Hoy', 'Mañana', 'En 3 días'];
  timeSlots = ['08:00 AM', '09:30 AM', '10:30 AM', '11:45 AM', '02:00 PM', '04:30 PM'];

  selectedExamType = this.examTypes[0];
  selectedDoctor = this.doctorList[0];
  selectedPreference = this.preferenceOptions[0];
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

  selectDoctor(doc: string): void {
    this.selectedDoctor = doc;
  }

  selectPreference(pref: string): void {
    this.selectedPreference = pref;
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
      status: 'checked-in',
      mapRank: 1,
      rating: 4.8,
      distance: '1.2 km',
      doctor: this.selectedDoctor,
      preference: this.selectedPreference
    };

    this.appointments.push(newAppointment);
    this.selectedIndex = this.appointments.length - 1;
    this.closeBookingModal();
  }
}