import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HblDraftComponent } from './hbl-draft.component';

describe('HblDraftComponent', () => {
  let component: HblDraftComponent;
  let fixture: ComponentFixture<HblDraftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HblDraftComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HblDraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
