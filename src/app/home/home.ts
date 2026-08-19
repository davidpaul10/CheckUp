
import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  searchQuery: string = '';
  selectedFilter: string = 'todos';

  // Control de estados y notificaciones
  isGlobalLoading: boolean = false;
  isModalOpen: boolean = false;
  isPromoModalOpen: boolean = false;
  isNotificationOpen: boolean = false;
  showWelcomeTooltip: boolean = true;
  hasUnreadNotifications: boolean = true;

  promoTime: string = '07:00 - 08:00';

  notifications = [
    {
      id: 1,
      message: 'Aquí puedes ver tus notificaciones y alertas de tus citas en CheckUp+.',
      time: 'Hace un momento',
      unread: true
    }
  ];
  
  selectedLab: any = null;
  selectedExam: string = 'Examen de Rutina';
  selectedDate: string = 'Hoy';
  selectedTime: string = '08:00 AM';

  labs = [
    {
      id: 1,
      name: 'Laboratorio LabClínica',
      branch: 'Matriz Norte',
      address: 'Av. 6 de Diciembre y Eloy Alfaro',
      distance: '0.8 km',
      specialty: 'Rutina General',
      phone: '02 245 8965',
      rating: '4.9',
      isClosest: true
    },
    {
      id: 2,
      name: 'SYNLAB Ecuador',
      branch: 'Sede República',
      address: 'Av. República de El Salvador',
      distance: '1.4 km',
      specialty: 'Inmunología',
      phone: '02 332 1144',
      rating: '4.8',
      isClosest: false
    },
    {
      id: 3,
      name: 'Interlab',
      branch: 'Sede Naciones Unidas',
      address: 'Av. 10 de Agosto y Naciones Unidas',
      distance: '2.1 km',
      specialty: 'Bioquímica',
      phone: '02 226 7788',
      rating: '4.7',
      isClosest: false
    },
    {
      id: 4,
      name: 'Laboratorio Clínico Biomas',
      branch: 'Sede Eloy Alfaro',
      address: 'Av. Eloy Alfaro 516 y Alemania',
      distance: '1.1 km',
      specialty: 'Hematología',
      phone: '02 254 3322',
      rating: '4.9',
      isClosest: false
    }
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  setFilter(filter: string) {
    this.selectedFilter = filter;
  }

  isUltraClose(distance: string): boolean {
    return distance === '0.8 km';
  }

  get filteredLabs() {
    return this.labs.filter(lab => {
      const matchesSearch = lab.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            lab.specialty.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            lab.address.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      if (this.selectedFilter === 'rutina') {
        return matchesSearch && lab.specialty.toLowerCase().includes('rutina general');
      } else if (this.selectedFilter === 'sedes') {
        return matchesSearch && lab.isClosest;
      }
      
      return matchesSearch;
    });
  }

  getEstimatedPrice(): string {
    switch (this.selectedExam) {
      case 'Examen de Rutina': return '20/30$';
      case 'Perfil Lipídico': return '25/35$';
      case 'Hemograma Completo': return '15/25$';
      case 'Prueba de Glucosa': return '10/18$';
      default: return '20/30$';
    }
  }

  dismissWelcomeTooltip() {
    this.showWelcomeTooltip = false;
    this.cdr.detectChanges();
  }

  toggleNotifications() {
    if (this.showWelcomeTooltip) {
      this.showWelcomeTooltip = false;
    }
    this.isNotificationOpen = !this.isNotificationOpen;
    this.cdr.detectChanges();
  }

  markAsRead() {
    this.hasUnreadNotifications = false;
    this.notifications.forEach(n => n.unread = false);
    this.cdr.detectChanges();
  }

  clearNotifications() {
    this.notifications = [];
    this.hasUnreadNotifications = false;
    this.cdr.detectChanges();
  }

  // Abrir modal de la promoción del mes con loader de simulación
  openPromoModal() {
    if (this.isGlobalLoading) return;

    this.isGlobalLoading = true;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.isGlobalLoading = false;
      this.isPromoModalOpen = true;
      this.cdr.detectChanges();
    }, 800);
  }

  closePromoModal() {
    this.isPromoModalOpen = false;
  }

  confirmPromoAppointment() {
    this.isPromoModalOpen = false;
  }

  handleExpressClick(lab: any) {
    if (this.isGlobalLoading) return;

    this.selectedLab = lab;
    this.isGlobalLoading = true;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.isGlobalLoading = false;
      this.isModalOpen = true;
      this.cdr.detectChanges();
    }, 800);
  }

  closeModal() {
    this.isModalOpen = false;
  }

  confirmAppointment() {
    this.isModalOpen = false;
  }

  // --- VARIABLES Y MÉTODOS DEL MAPA ---
  isMapModalOpen: boolean = false;

  mapSedesList = [
    { name: 'Laboratorio LabClínica', address: 'Av. 6 de Diciembre y Eloy Alfaro', distance: '0.8 km' },
    { name: 'SYNLAB Ecuador', address: 'Av. República de El Salvador', distance: '1.4 km' },
    { name: 'Interlab', address: 'Av. 10 de Agosto y Naciones Unidas', distance: '2.1 km' },
    { name: 'Laboratorio Clínico Biomas', address: 'Av. Eloy Alfaro 516 y Alemania', distance: '1.1 km' }
  ];

  openMapModal() {
    if (this.isGlobalLoading) return;
    this.isMapModalOpen = true;
    this.cdr.detectChanges();
  }

  closeMapModal() {
    this.isMapModalOpen = false;
    this.cdr.detectChanges();
  }
}