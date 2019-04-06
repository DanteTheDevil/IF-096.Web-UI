import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material';
import { TeachersStorageService } from './services/teachers-storage.service';
import { TeachersService } from './admin-panel/teachers/teachers.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DialogOverviewExampleDialog } from './admin-panel/teachers/teachers-list/dialog/dialog-overview';
import { EditDialogOverviewComponent } from './admin-panel/teachers/teachers-list/dialogs/edit-dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationDialogComponent } from './admin-panel/teachers/teachers-list/teachers-list.component';

@NgModule({
  declarations: [
    AppComponent,
    DialogOverviewExampleDialog,
    EditDialogOverviewComponent,
    ConfirmationDialogComponent
  ],
  entryComponents: [
    DialogOverviewExampleDialog,
    EditDialogOverviewComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthService,
    TeachersStorageService,
    TeachersService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
