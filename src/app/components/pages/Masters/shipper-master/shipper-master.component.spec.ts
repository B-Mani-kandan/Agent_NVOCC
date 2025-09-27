import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipperMasterComponent } from './shipper-master.component';

describe('ShipperMasterComponent', () => {
  let component: ShipperMasterComponent;
  let fixture: ComponentFixture<ShipperMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShipperMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipperMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
