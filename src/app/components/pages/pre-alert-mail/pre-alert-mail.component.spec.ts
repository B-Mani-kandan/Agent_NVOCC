import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreAlertMailComponent } from './pre-alert-mail.component';

describe('PreAlertMailComponent', () => {
  let component: PreAlertMailComponent;
  let fixture: ComponentFixture<PreAlertMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreAlertMailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreAlertMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
