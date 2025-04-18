import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AgentService } from '../../../services/agent.service';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, debounceTime, switchMap } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-job-nvocc',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    FormsModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  templateUrl: './job-nvocc.component.html',
  styleUrl: './job-nvocc.component.css',
})
export class JobNvoccComponent implements OnInit {
  NvoccBookingData: any;
  JobDetails: any = [];
  isShowVisible: boolean = false;
  isLoading: boolean = false;
  router = inject(Router);
  _CommonService = inject(AgentService);
  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>[] = [];
  Mode: any;
  JOBID: any;

  ngOnInit(): void {
    this.GetSearchBookingData();
    this.JobDetails.forEach((detail: any, index: any) => {
      this.filteredOptions[index] = detail.yardControl.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        switchMap((value) => this.fetchYardNames(value))
      );
    });
  }

  fetchYardNames(input: any): Observable<string[]> {
    if (!input.trim()) {
      return new Observable<string[]>((observer) => observer.next([]));
    }
    const companyId = localStorage.getItem('CompanyID');
    const requestPayload = { InputVal: input, CompanyId: companyId };

    return this._CommonService.NVOCC_GetYardName(requestPayload).pipe(
      map((response) => {
        return response.Status === 'Success'
          ? response.GetYardName.map((item: any) => item.AccountName)
          : [];
      })
    );
  }

  GetSearchBookingData(): void {
    this.isLoading = true;
    const companyId = localStorage.getItem('CompanyID');
    const AgentId = localStorage.getItem('AgentID');
    const jsonData = { CompanyID: companyId, NvoccAgentID: AgentId };

    this._CommonService.Nvocc_Booking(jsonData).subscribe(
      (response) => {
        this.NvoccBookingData = response;
        if (this.NvoccBookingData?.Nvocc_Booking?.length > 0) {
        } else {
          //this._notify.addToast('error', 'Error', 'No data available.');
        }
        this.isLoading = false;
      },
      (error) => {
        //this._notify.addToast('error', 'Error', 'Failed to fetch data.');
        this.isLoading = false;
      }
    );
  }

  GetBookingJobData(JobID: any): void {
    this.isLoading = true;
    this.JOBID = JobID;
    const companyId = localStorage.getItem('CompanyID');
    const jsonData = { CompanyID: companyId, JobID: JobID };

    this._CommonService.Nvocc_JobBooking(jsonData).subscribe(
      (response) => {
        if (response?.Nvocc_Export_EmptyYard?.length > 0) {
          this.JobDetails = response.Nvocc_Export_EmptyYard.map(
            (detail: any) => {
              const yardControl = new FormControl('');
              return {
                ...detail,
                isSelected: false,
                yardControl: yardControl,
                emptyDateControl: new FormControl(''),
                filteredOptions: yardControl.valueChanges.pipe(
                  startWith(''),
                  debounceTime(300),
                  switchMap((value) => this.fetchYardNames(value))
                ),
              };
            }
          );
        } else {
          //this._notify.addToast('error', 'Error', 'No job details found.');
          this.JobDetails = [];
        }
        this.isLoading = false;
      },
      (error) => {
        //this._notify.addToast('error', 'Error', 'Failed to fetch job details.');
        this.isLoading = false;
      }
    );
  }

  onJobSelect(JobID: any): void {
    this.isShowVisible = true;
    this.GetBookingJobData(JobID);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  SaveOceanRate(): void {
    const companyId = localStorage.getItem('CompanyID');

    const selectedJobs = this.JobDetails.filter(
      (detail: any) => detail.isSelected
    );

    if (selectedJobs.length === 0) {
      //this._notify.addToast('error', 'Error', 'No job selected.');
      return;
    }

    const requestBody = {
      NVOCC_JobBooking: selectedJobs.map((JobDetails: any) => ({
        C_TrackID: JobDetails.CTrackId,
        ContainerID: JobDetails.NVOCCon_Id,
        ContainerNo: JobDetails.Con_No,
        CompanyId: companyId,
        OwnerID: JobDetails.AllocatedByDoc,
        Size: JobDetails.ShortName,
        SizeID: JobDetails.ContainerTypeID,
        YardName: JobDetails.yardControl.value,
        PlanId: this.JOBID,
        Plan_CId: JobDetails.ContainerID,
        EmptyDate: JobDetails.emptyDateControl.value,
      })),
    };
    console.log('RequestBody:', requestBody);

    this._CommonService.NVOCC_Save_JobBooking(requestBody).subscribe(
      (response: any) => {
        console.log('Success:', response);
        if (response.Status === 'Success') {
          // this._notify.addToast(
          //   'success',
          //   'Success',
          //   'Data Saved Successfully'
          // );
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
              this.router.navigate([this.router.url]);
            });
        } else {
          //this._notify.addToast('error', 'Failed', response.Message);
        }
      },
      (error: any) => {
        console.error('API error:', error);
      }
    );
  }
}
