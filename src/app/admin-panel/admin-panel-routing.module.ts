import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
<<<<<<< HEAD
import {ShellComponent} from '../shell/shell/shell.component';
import {AdminPanelComponent} from './admin-panel/admin-panel.component';
import { TeacherConnectionComponent } from './teacher-connection/teacher-connection.component';

const routes: Routes = [
  {
    path: '',
    component: AdminPanelComponent,
    children: [
      {
        path:'teacher-connection',
        component: TeacherConnectionComponent
      }
    ]
  }
=======
import { ShellComponent } from '../shell/shell/shell.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { TeacherEditComponent } from './teachers/teacher-edit/teacher-edit.component';
import { DialogEntryComponent } from './teachers/teachers-list/dialog/dialog-overview';
import { TeachersListComponent } from './teachers/teachers-list/teachers-list.component';
import { StudentsListComponent } from './students-list/students-list.component';
 
const routes: Routes = [
  {
    path: '',
    component: AdminPanelComponent
  },
  {
    path: 'students',
    component: StudentsListComponent
  },
  { path: 'teachers/new', component: TeacherEditComponent },
  {
    path: 'teachers',
    component: TeachersListComponent,
    children: [
      {
        path: ':id',
        component: DialogEntryComponent
      }
    ]
  },
  { path: 'teachers/:id/edit', component: TeacherEditComponent }

>>>>>>> master
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminPanelRoutingModule {}
