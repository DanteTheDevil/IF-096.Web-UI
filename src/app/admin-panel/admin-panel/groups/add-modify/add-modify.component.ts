import { Component, Inject } from '@angular/core';

import { Group } from '../../../../models/group-data.model';
import { GroupsService } from '../../../../services/groups.service';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSnackBar,
  MatSnackBarConfig
} from '@angular/material';

@Component({
  selector: 'app-add-modify',
  templateUrl: './add-modify.component.html',
  styleUrls: ['./add-modify.component.scss']
})
export class AddModifyGroupComponent {
  groupBeforeChange = { ...this.data };

  constructor(
    private dialogRef: MatDialogRef<AddModifyGroupComponent>,
    private groupServices: GroupsService,
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  /**
   * Method reports about closing bottom sheet
   */
  abort(): void {
    this.dialogRef.close();
  }

  /**
   * Method saves data about a new or modified class
   */
  save() {
    if ( JSON.stringify(this.groupBeforeChange) === JSON.stringify(this.data) ) {
      this.openSnackBar(
        `Клас ${this.data.className}  ${ this.data.classYear} року. Ви не внесли ніяких змін!`,
        'snack-class-warning'
      );
    } else {
      this.groupServices.addGrup(this.data).subscribe((dataResponse: any) => {
        if (this.data.id && !(dataResponse === undefined)) {
          this.dialogRef.close(dataResponse);
          this.openSnackBar(
            `Клас ${dataResponse.className}  ${dataResponse.classYear} року. Зміни збережено`,
            'snack-class-success'
          );
        } else if (this.data.id === undefined && !(dataResponse === undefined)) {
          this.dialogRef.close(dataResponse);
          this.openSnackBar(
            `Клас ${dataResponse.className}  ${dataResponse.classYear} року створений`,
            'snack-class-success'
          );
        }
      });
    }
  }

  /**
   * Method opens the snack-bar with a message
   * @param message - message which must be displayed
   * @param classMessage - Extra CSS classes to be added to the snack bar container.
   */
  openSnackBar(message: string, classMessage: string) {
    const config = new MatSnackBarConfig();
    config.panelClass = [classMessage];
    config.duration = 3000;
    config.verticalPosition = 'top';
    this.snackBar.open(message, null, config);
  }
}
