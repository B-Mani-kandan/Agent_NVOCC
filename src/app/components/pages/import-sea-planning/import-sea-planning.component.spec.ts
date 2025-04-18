import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportSeaPlanningComponent } from './import-sea-planning.component';

describe('ImportSeaPlanningComponent', () => {
  let component: ImportSeaPlanningComponent;
  let fixture: ComponentFixture<ImportSeaPlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportSeaPlanningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportSeaPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
