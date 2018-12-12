import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../api.service";
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-apply-options',
  templateUrl: './apply-options.component.html',
  styleUrls: ['./apply-options.component.css']
})
export class ApplyOptionsComponent implements OnInit {
  error: any;
  status: any;
  applyOptionsForm: FormGroup;
  discardOptionsForm: FormGroup;
  options: any;
  curr_opts: any;

  constructor(private dialogRef: MatDialogRef<ApplyOptionsComponent>,
              private api: ApiService, public snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) private data: any) {
    this.curr_opts = this.getCurrentOptions();
    this.applyOptionsForm = new FormGroup({
      options: new FormControl(this.curr_opts ? this.curr_opts.id : null),
      furniture: new FormControl(data.id)
    });
    this.discardOptionsForm = new FormGroup({
      furniture: new FormControl(data.id),
      user: new FormControl(api.currentUser.id)
    });
    this.options = this.getOptions();
  }

  ngOnInit() {
  }

  getOptions() {
    let res = [];
    for (let option of this.api.currentUser.options_set)
      if (this.data.type === option.type)
        res.push(option);
    return res;
  }

  getCurrentOptions() {
    for (let option of this.api.currentUser.options_set)
      for (let curr_opts of this.data.current_options)
        if (option.id == curr_opts.id)
          return option;
    return null;
  }

  yes() {
    this.error = null;
    this.status = null;
    this.api.createObj('', {
      'sender': this.api.currentUser.id,
      'receiver': this.data.owner,
      'content': `User ${this.api.currentUser.username} would like to use ${this.data.type}-${this.data.code}`
    }).subscribe((response: any) => {
        console.log(response);
        if (response)
          this.snackBar.open('Request has been sent', 'Ok', {
            duration: 2000,
          });
      }
    );
  }

  no() {
    this.error = null;
    this.status = null;
  }

  apply(): void {
    console.log(this.applyOptionsForm.value);
    this.api.createObj('apply-options', this.applyOptionsForm.value).subscribe((response: any) => {
      console.log(response);
      if (response) {
        this.error = null;
        this.status = null;
        this.dialogRef.close(true);
      } else
        this.error = this.api.errorLog.pop();
    });
  }

  discard(): void {
    this.api.createObj('discard-options', this.discardOptionsForm.value).subscribe((response: any) => {
      console.log(response);
      if (response) {
        this.error = null;
        this.dialogRef.close(true);
      } else {
        this.error = this.api.errorLog.pop();
        this.status = this.api.statusLog.pop();
      }
    });
  }
}
