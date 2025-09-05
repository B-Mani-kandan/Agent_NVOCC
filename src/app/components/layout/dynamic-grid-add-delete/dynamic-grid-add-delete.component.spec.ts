import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicGridAddDeleteComponent } from './dynamic-grid-add-delete.component';

describe('DynamicGridAddDeleteComponent', () => {
  let component: DynamicGridAddDeleteComponent;
  let fixture: ComponentFixture<DynamicGridAddDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicGridAddDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicGridAddDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
