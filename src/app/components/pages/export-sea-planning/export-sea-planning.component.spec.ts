import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportSeaPlanningComponent } from './export-sea-planning.component';

describe('ExportSeaPlanningComponent', () => {
  let component: ExportSeaPlanningComponent;
  let fixture: ComponentFixture<ExportSeaPlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportSeaPlanningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportSeaPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
