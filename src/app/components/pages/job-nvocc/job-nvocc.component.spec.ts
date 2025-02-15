import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobNvoccComponent } from './job-nvocc.component';

describe('JobNvoccComponent', () => {
  let component: JobNvoccComponent;
  let fixture: ComponentFixture<JobNvoccComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobNvoccComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JobNvoccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
