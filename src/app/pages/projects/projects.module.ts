import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollTrackerDirective } from './scroll-tracker.directive';

import { ProjectsRoutingModule } from './projects-routing.module';
import { UIModule } from '../../shared/ui/ui.module';
import { NgSelectModule } from '@ng-select/ng-select';

import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbTooltipModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';

import { ProjectgridComponent } from './projectgrid/projectgrid.component';
import { ProjectlistComponent } from './projectlist/projectlist.component';
import { OverviewComponent } from './overview/overview.component';
import { CreateComponent } from './create/create.component';
import { FormModule } from '../form/form.module';
import { UserComponent } from './user/user.component'
import { UiSwitchModule } from 'ngx-ui-switch';

@NgModule({
  declarations: [UserComponent,ScrollTrackerDirective,ProjectgridComponent, ProjectlistComponent, OverviewComponent, CreateComponent],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    UIModule,FormModule,ReactiveFormsModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgApexchartsModule,
    DropzoneModule,
    FormsModule,
    NgbDatepickerModule,
    UiSwitchModule,
    NgSelectModule
  ]
})

export class ProjectsModule { }
