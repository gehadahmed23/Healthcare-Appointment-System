import { AuthService } from './../../../core/service/auth-service';
import { MedicalRecord } from '../../../core/models/medical-record';
import { MedicalRecordService } from './../../../core/service/medical-record-service';
import { Component, OnInit } from '@angular/core';
import { MedicalRecordCard } from '../medical-record-card/medical-record-card';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-medical-record-list',
  imports: [MedicalRecordCard],
  templateUrl: './medical-record-list.html',
  styleUrl: './medical-record-list.css',
})
export class MedicalRecordList implements OnInit {

  /**
   *
   */
  medicalList!:MedicalRecord[]
  patientId!:string

  constructor(private MedicalRecordService: MedicalRecordService,private AuthService:AuthService, private route: ActivatedRoute) {

  }
  ngOnInit(): void {


    this.AuthService.user$.subscribe({
      next:(user)=>{
        if(user?.role=='patient')
        {
          this.patientId=user.id
          this.MedicalRecordService.getAllByPatientId(this.patientId).subscribe(
            {
              next:(medicals)=>{
                this.medicalList=medicals
              }
            }
          )
        }
        else if(user?.role=='doctor')
        {
          this.route.paramMap.subscribe(params => {
          this.patientId = params.get('id')!;

          this.MedicalRecordService.getAllByPatientId(this.patientId).subscribe({
            next: (medicals) => {
              this.medicalList = medicals;
              }
            });
          });
        }
      }
    })
  }
}
