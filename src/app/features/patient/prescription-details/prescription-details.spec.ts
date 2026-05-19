import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionDetails } from './prescription-details';

describe('PrescriptionDetails', () => {
  let component: PrescriptionDetails;
  let fixture: ComponentFixture<PrescriptionDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrescriptionDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrescriptionDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
