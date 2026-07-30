import { Component, OnInit, OnDestroy, ViewChild, ElementRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-green-pass',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './green-pass.html',
  styleUrl: './green-pass.css',
})
export class GreenPass implements OnInit, OnDestroy {
  // States
  isScannerOpen = signal<boolean>(false);
  isCameraActive = signal<boolean>(false);
  cameraError = signal<string | null>(null);

  // Timer state (11 minutes 44 seconds = 704s)
  remainingSeconds = signal<number>(704);
  timerFormatted = signal<string>('11:44');

  // Verification result modal state
  verificationResult = signal<{
    status: 'success' | 'invalid' | null;
    patientName?: string;
    date?: string;
    code?: string;
  } | null>(null);

  // Toast message
  toastMessage = signal<string | null>(null);

  @ViewChild('videoElement') videoElement?: ElementRef<HTMLVideoElement>;
  private mediaStream: MediaStream | null = null;
  private timerInterval: any = null;

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    this.stopTimer();
    this.stopCamera();
  }

  startTimer() {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      let current = this.remainingSeconds();
      if (current <= 0) {
        current = 900; // Reset to 15:00 when expired
      } else {
        current--;
      }
      this.remainingSeconds.set(current);
      const mins = Math.floor(current / 60);
      const secs = current % 60;
      this.timerFormatted.set(
        `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      );
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  async openScanner() {
    this.isScannerOpen.set(true);
    this.cameraError.set(null);
    await this.initCamera();
  }

  closeScanner() {
    this.stopCamera();
    this.isScannerOpen.set(false);
  }

  async initCamera() {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        this.mediaStream = stream;
        this.isCameraActive.set(true);
        setTimeout(() => {
          if (this.videoElement && this.videoElement.nativeElement) {
            this.videoElement.nativeElement.srcObject = stream;
          }
        }, 150);
      } else {
        this.cameraError.set('Tu navegador no soporta el acceso directo a la cámara.');
        this.isCameraActive.set(false);
      }
    } catch (err: any) {
      console.warn('Camera access issue:', err);
      this.cameraError.set('Acceso a la cámara en modo simulación (sin permiso de vídeo).');
      this.isCameraActive.set(false);
    }
  }

  stopCamera() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    this.isCameraActive.set(false);
  }

  simulateScanSuccess() {
    this.playBeepSound();
    this.closeScanner();
    
    // Show validation popup after scan
    setTimeout(() => {
      this.verificationResult.set({
        status: 'success',
        patientName: 'María García López',
        date: '12 Jul 2026',
        code: 'PV-2026-884920'
      });
    }, 200);
  }

  closeVerificationResult() {
    this.verificationResult.set(null);
  }

  playBeepSound() {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 932; // Beep tone
      gain.gain.value = 0.2;
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.18);
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  }

  downloadPDF() {
    this.showToast('Descargando documento Pase Verde PDF...');
    setTimeout(() => {
      const element = document.createElement('a');
      const file = new Blob([
        `========================================\n` +
        `       CHECKUP - PASE VERDE DE SALUD    \n` +
        `========================================\n\n` +
        `ESTADO: AL DÍA\n` +
        `ÚLTIMO EXAMEN: 12 Jul 2026\n` +
        `CÓDIGO DE VALIDACIÓN: PV-2026-884920\n` +
        `VÁLIDO HASTA: 12 Aug 2026\n\n` +
        `INFORMACIÓN CONFIDENCIAL PROTEGIDA\n` +
        `Este pase certifica que los análisis médicos\n` +
        `se encuentran vigentes y dentro de los rangos de salud.\n`
      ], { type: 'text/plain;charset=utf-8' });
      element.href = URL.createObjectURL(file);
      element.download = 'Pase_Verde_Salud_CheckUp.txt';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 600);
  }

  showToast(msg: string) {
    this.toastMessage.set(msg);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 3200);
  }
}

