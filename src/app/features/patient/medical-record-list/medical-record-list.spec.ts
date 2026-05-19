import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalRecordList } from './medical-record-list';

describe('MedicalRecordList', () => {
  let component: MedicalRecordList;
  let fixture: ComponentFixture<MedicalRecordList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalRecordList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalRecordList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
