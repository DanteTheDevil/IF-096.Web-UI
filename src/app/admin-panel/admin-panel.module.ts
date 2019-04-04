import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminPanelRoutingModule } from './admin-panel-routing.module';
import * as adminPanelComponent from './admin-panel/admin-panel.component';


import { TeachersComponent } from './teachers/teachers.component';
import { MaterialModule } from '../material';
import { TeachersListComponent } from './teachers/teachers-list/teachers-list.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TeacherEditComponent } from './teachers/teacher-edit/teacher-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogEntryComponent } from './teachers/teachers-list/dialog/dialog-overview';
import { SubjectsComponent } from './admin-panel/subjects/subjects.component';

@NgModule({
  declarations: [
    adminPanelComponent.AdminPanelComponent,
    TeachersComponent,
    TeachersListComponent,
    TeacherEditComponent,
    DialogEntryComponent,
    SubjectsComponent
  ],
  imports: [
    CommonModule,
    AdminPanelRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule

  ]
})
export class AdminPanelModule {}
