import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from "@angular/router";
import { IAppointment } from '../../../core/models/appointment';
import { IUser } from '../../../core/models/user';
import { AppointmentService } from '../../../core/service/appointment-service';
import { AuthService } from '../../../core/service/auth-service';
import { AppointmentCard } from "../appointment-card/appointment-card";
import { PatientService } from '../../../core/service/patient-service';
import { DoctorService } from '../../../core/service/doctor-service';
import { IDoctor } from '../../../core/models/doctor';
import { forkJoin } from 'rxjs';
import { Chart, ChartConfiguration, ChartData, ChartType, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule, AppointmentCard, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  allappointments: IAppointment[] = [];
  allDoctors: IDoctor[] = [];

  pastAppointments: IAppointment[] = [];
  upcomingAppointments: IAppointment[] = [];
  todayAppointments: IAppointment[] = [];
  user?: IUser;
  totalAppointmentsCount = 0;
  stats = {
    totalDoctors: 0,
    newDoctors: 0,
    totalPatients: 0,
    newPatients: 0,
    totalAppointments: 0,
    newAppointments: 0,

    cancelled: 0,
    rescheduled: 0,
    completed: 0,
    ongoing: 0
  };

  topDoctors: any[] = [];
  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private doctorService: DoctorService,
    private patientService: PatientService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData() {
    this.authService.user$.subscribe({
      next: (user) => {
        if (user) {
          this.user = user as IUser;
          this.appointmentService.getAll().subscribe({
            next: (data) => {
              this.allappointments = data;
              this.totalAppointmentsCount = data.length;

              this.pastAppointments =
                this.appointmentService.getPastAppointments(data);

              this.upcomingAppointments =
                this.appointmentService.getUpcomingAppointments(data);

              this.todayAppointments =
                this.appointmentService.getTodayAppointments(data);
            }
          });
        }
      }
    });

    forkJoin({
      doctors: this.doctorService.getAllDoctors(),
      patients: this.patientService.getAll(),
      appointments: this.appointmentService.getAll()
    }).subscribe(({ doctors, patients, appointments }: {
      doctors: IDoctor[],
      patients: IUser[],
      appointments: IAppointment[]
    }) => {
      this.allappointments = appointments;
      this.allDoctors = doctors;
      this.calculateTopDoctors();
      this.prepareChartData(appointments);
      this.stats.totalDoctors = doctors.length;
      this.stats.totalPatients = patients.length;
      this.stats.totalAppointments = appointments.length;

      this.stats.newDoctors = this.doctorService.getNumberOfDoctorInLastMonth(doctors).length;
      this.stats.newPatients = this.patientService.getNumberOfPatientInLastMonth(patients).length;
      this.stats.newAppointments = this.appointmentService.getNumberOfAppointmentInLastMonth(appointments).length;
    });
  }

  calculateTopDoctors() {
    const counts = this.allappointments.reduce((acc: any, app) => {
      acc[app.doctorId] = (acc[app.doctorId] || 0) + 1;
      return acc;
    }, {});

    this.topDoctors = this.allDoctors
      .map(doctor => ({
        name: doctor.name,
        image: doctor.avatar || '',
        specialty: doctor.specialization,
        count: counts[doctor.id!] || 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: { stacked: true },
      y: { stacked: true, beginAtZero: true }
    },
    plugins: {
      legend: { display: true, position: 'bottom' }
    }
  };

  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      { data: [], label: 'Completed', backgroundColor: '#2ecc71' },
      { data: [], label: 'Ongoing', backgroundColor: '#3498db' },
      { data: [], label: 'Rescheduled', backgroundColor: '#9b59b6' },
      { data: [], label: 'Cancelled', backgroundColor: '#e74c3c' }
    ]
  };

  private prepareChartData(appointments: IAppointment[]) {
    this.stats.completed = 0;
    this.stats.ongoing = 0;
    this.stats.rescheduled = 0;
    this.stats.cancelled = 0;

    const completed = new Array(12).fill(0);
    const ongoing = new Array(12).fill(0);
    const rescheduled = new Array(12).fill(0);
    const cancelled = new Array(12).fill(0);

    appointments.forEach(app => {
      const month = new Date(app.date).getMonth();

      if (app.status === 'completed') {
        completed[month]++;
        this.stats.completed++;
      } else if (app.status === 'confirmed') {
        ongoing[month]++;
        this.stats.ongoing++;
      } else if (app.status === 'pending') {
        rescheduled[month]++;
        this.stats.rescheduled++;
      } else if (app.status === 'cancelled') {
        cancelled[month]++;
        this.stats.cancelled++;
      }
    });

    this.barChartData.datasets[0].data = completed;
    this.barChartData.datasets[1].data = ongoing;
    this.barChartData.datasets[2].data = rescheduled;
    this.barChartData.datasets[3].data = cancelled;

    this.barChartData = { ...this.barChartData };
  }

}
