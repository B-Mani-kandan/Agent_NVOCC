import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VesselMasterComponent } from './vessel-master.component';

describe('VesselMasterComponent', () => {
  let component: VesselMasterComponent;
  let fixture: ComponentFixture<VesselMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VesselMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VesselMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
