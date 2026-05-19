import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalRecordCard } from './medical-record-card';

describe('MedicalRecordCard', () => {
  let component: MedicalRecordCard;
  let fixture: ComponentFixture<MedicalRecordCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalRecordCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalRecordCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
