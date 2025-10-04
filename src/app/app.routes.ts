import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout/layout.component';
import { authGuard } from './guard/auth.guard';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { ExportSeaPlanningComponent } from './components/pages/export-sea-planning/export-sea-planning.component';
import { ImportSeaPlanningComponent } from './components/pages/import-sea-planning/import-sea-planning.component';
import { ContainerBookingComponent } from './components/pages/container-booking/container-booking.component';
import { HblDraftComponent } from './components/pages/hbl-draft/hbl-draft.component';
import { ClientMasterComponent } from './components/pages/Masters/client-master/client-master.component';
import { ShipperMasterComponent } from './components/pages/Masters/shipper-master/shipper-master.component';
import { ConsigneeMasterComponent } from './components/pages/Masters/consignee-master/consignee-master.component';
import { CommonMasterComponent } from './components/pages/Masters/common-master/common-master.component';
import { VesselMasterComponent } from './components/pages/Masters/vessel-master/vessel-master.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'export/export-sea-planning',
        component: ExportSeaPlanningComponent,
      },
      {
        path: 'import/import-sea-planning',
        component: ImportSeaPlanningComponent,
      },
      {
        path: 'export/container-booking',
        component: ContainerBookingComponent,
      },
      {
        path: 'export/hbl-draft',
        component: HblDraftComponent,
      },
      {
        path: 'master/client-master',
        component: ClientMasterComponent,
      },
      {
        path: 'master/Shipper-master',
        component: ShipperMasterComponent,
      },
      {
        path: 'master/consignee-master',
        component: ConsigneeMasterComponent,
      },
      {
        path: 'master/common-master',
        component: CommonMasterComponent,
      },
      {
        path: 'master/vessel-master',
        component: VesselMasterComponent,
      },
    ],
  },
];
