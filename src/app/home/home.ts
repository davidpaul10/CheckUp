import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Laboratory {
  id: number;
  name: string;
  distance: string;
  address: string;
  specialty: string;
  rating: number;
  image: string;
  phone: string;
  branch: string;
  category: 'rutina' | 'cercanas' | 'todos' | string;
}

interface ExamType {
  id: number;
  name: string;
  selected: boolean;
}

interface TimeSlot {
  time: string;
  selected: boolean;
}

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: 'appointment' | 'promo' | 'info';
}

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  activeFilter = signal<string>('todos');
  searchQuery = signal<string>('');

  showModal = signal<boolean>(false);
  showNotifications = signal<boolean>(false);
  hasUnreadNotifs = signal<boolean>(true);

  selectedLab = signal<Laboratory | null>(null);
  selectedDate = signal<string>('hoy');
  selectedTime = signal<string | null>(null);

  // Loading states
  loadingModal = signal<boolean>(false);   // loading before showing modal
  loadingConfirm = signal<boolean>(false); // spinner when confirming
  showSuccess = signal<boolean>(false);    // success modal after confirm

  notifications: NotificationItem[] = [
    {
      id: 1,
      title: '¡Cita Confirmada!',
      message: 'Tu cita en Laboratorio San José está programada con éxito. Pase QR disponible.',
      time: 'Hace 5 min',
      unread: true,
      type: 'appointment',
    },
    {
      id: 2,
      title: 'Promoción del Mes 🏷️',
      message: 'Aprovecha un 30% de descuento en el Perfil Lipídico Completo este mes.',
      time: 'Hace 1 hora',
      unread: true,
      type: 'promo',
    },
    {
      id: 3,
      title: 'Pase Verde de Salud',
      message: 'Tus resultados anteriores se cargaron correctamente en tu Pase Verde.',
      time: 'Ayer',
      unread: false,
      type: 'info',
    },
    {
      id: 4,
      title: 'Nueva Sede Cercana 📍',
      message: 'Laboratorio San José abrió su nueva sucursal en Av. Amazonas.',
      time: 'Hace 2 días',
      unread: false,
      type: 'info',
    },
  ];

  laboratories: Laboratory[] = [
    {
      id: 1,
      name: 'Laboratorio San José',
      distance: '1.2km',
      address: 'Av. Amazonas N24-102',
      specialty: 'Rutina General & Bioquímica',
      rating: 4.8,
      image: 'assets/lab_san_jose.png',
      phone: '+593 2 234-5678',
      branch: 'Sucursal Central',
      category: 'rutina',
    },
    {
      id: 2,
      name: 'Clínica de la Mujer',
      distance: '2.5km',
      address: 'Av. Eloy Alfaro y Rep. del Salvador',
      specialty: 'Salud Sexual & Especialidades',
      rating: 4.6,
      image: 'assets/clinica_mujer.png',
      phone: '+593 2 345-6789',
      branch: 'Sede Norte',
      category: 'cercanas',
    },
    {
      id: 3,
      name: 'Laboratorios Integrales',
      distance: '3.1km',
      address: 'Av. 6 de Diciembre N25-60',
      specialty: 'Inmunología & Microbiología',
      rating: 4.5,
      image: 'assets/lab_integrales.png',
      phone: '+593 2 456-7890',
      branch: 'Sede Sur',
      category: 'todos',
    },
    {
      id: 4,
      name: 'MedLab Centro',
      distance: '1.8km',
      address: 'Av. América N32-100',
      specialty: 'Rutina General & Hematología',
      rating: 4.7,
      image: 'assets/lab_san_jose.png',
      phone: '+593 2 567-8901',
      branch: 'Sede Centro',
      category: 'rutina',
    },
    {
      id: 5,
      name: 'BioCheck Cumbayá',
      distance: '0.9km',
      address: 'Av. Interoceánica km 10',
      specialty: 'Rutina & Exámenes Express',
      rating: 4.9,
      image: 'assets/clinica_mujer.png',
      phone: '+593 2 678-9012',
      branch: 'Sede Cumbayá',
      category: 'cercanas',
    },
  ];

  examTypes: ExamType[] = [
    { id: 1, name: 'Examen de Rutina', selected: false },
    { id: 2, name: 'Perfil Lipídico', selected: false },
    { id: 3, name: 'Hemograma Completo', selected: false },
    { id: 4, name: 'Prueba de Glucosa', selected: false },
  ];

  timeSlots: TimeSlot[] = [
    { time: '08:00 AM', selected: false },
    { time: '09:30 AM', selected: false },
    { time: '10:30 AM', selected: false },
    { time: '11:45 AM', selected: false },
    { time: '02:00 PM', selected: false },
    { time: '04:30 PM', selected: false },
  ];

  setFilter(filter: string) {
    this.activeFilter.set(filter);
  }

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  toggleNotifications() {
    this.showNotifications.set(!this.showNotifications());
    if (this.showNotifications()) {
      this.hasUnreadNotifs.set(false);
      this.notifications.forEach(n => n.unread = false);
    }
  }

  get filteredLabs(): Laboratory[] {
    const query = this.searchQuery().toLowerCase().trim();
    const filter = this.activeFilter();

    return this.laboratories.filter(lab => {
      // Category filter
      let matchesCategory = true;
      if (filter === 'rutina') {
        matchesCategory = lab.specialty.toLowerCase().includes('rutina') || lab.category === 'rutina';
      } else if (filter === 'cercanas') {
        const distNum = parseFloat(lab.distance);
        matchesCategory = distNum <= 2.5 || lab.category === 'cercanas';
      }

      // Search query filter
      let matchesSearch = true;
      if (query) {
        matchesSearch =
          lab.name.toLowerCase().includes(query) ||
          lab.address.toLowerCase().includes(query) ||
          lab.specialty.toLowerCase().includes(query) ||
          lab.branch.toLowerCase().includes(query);
      }

      return matchesCategory && matchesSearch;
    });
  }

  /** Click en "Agendar Cita Express": muestra loading 1.5s, luego abre modal */
  openModal(lab: Laboratory) {
    this.loadingModal.set(true);
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      this.loadingModal.set(false);
      this.selectedLab.set(lab);
      this.showModal.set(true);
      this.selectedDate.set('hoy');
      this.selectedTime.set(null);
      this.examTypes.forEach(e => (e.selected = false));
      this.timeSlots.forEach(t => (t.selected = false));
    }, 1500);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedLab.set(null);
    this.loadingConfirm.set(false);
    document.body.style.overflow = '';
  }

  selectDate(date: string) {
    this.selectedDate.set(date);
  }

  selectTime(slot: TimeSlot) {
    this.timeSlots.forEach(t => (t.selected = false));
    slot.selected = true;
    this.selectedTime.set(slot.time);
  }

  toggleExam(exam: ExamType) {
    exam.selected = !exam.selected;
  }

  /** Click en "Confirmar Cita": spinner 2s → success modal → cierra todo */
  confirmAppointment() {
    this.loadingConfirm.set(true);

    setTimeout(() => {
      this.loadingConfirm.set(false);
      this.showModal.set(false);
      this.showSuccess.set(true);

      // Cierra el success modal después de 2.5s y regresa al home
      setTimeout(() => {
        this.showSuccess.set(false);
        this.selectedLab.set(null);
        document.body.style.overflow = '';
      }, 2500);
    }, 2000);
  }
}
