import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadContainerGridComponent } from './load-container-grid.component';

describe('LoadContainerGridComponent', () => {
  let component: LoadContainerGridComponent;
  let fixture: ComponentFixture<LoadContainerGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadContainerGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadContainerGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
