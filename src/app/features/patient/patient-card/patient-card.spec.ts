import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientCard } from './patient-card';

describe('PatientCard', () => {
  let component: PatientCard;
  let fixture: ComponentFixture<PatientCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
