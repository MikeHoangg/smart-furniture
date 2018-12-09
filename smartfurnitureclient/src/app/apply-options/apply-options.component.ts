import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../api.service";

@Component({
  selector: 'app-apply-options',
  templateUrl: './apply-options.component.html',
  styleUrls: ['./apply-options.component.css']
})
export class ApplyOptionsComponent implements OnInit {
  error: any;
  applyOptionsForm: FormGroup;
  discardOptionsForm: FormGroup;
  options: any;
  curr_opts: any;

  constructor(private dialogRef: MatDialogRef<ApplyOptionsComponent>,
              private api: ApiService,
              @Inject(MAT_DIALOG_DATA) private data: any) {
    this.curr_opts = this.getCurrentOptions();
    this.applyOptionsForm = new FormGroup({
      options: new FormControl(this.curr_opts ? this.curr_opts.pk : null),
      furniture: new FormControl(data.pk)
    });
    this.discardOptionsForm = new FormGroup({
      furniture: new FormControl(data.pk),
      user: new FormControl(api.currentUser.pk)
    });
    this.options = this.getOptions();
  }

  ngOnInit() {
  }

  getOptions() {
    let res = [];
    for (let option of this.api.currentUser.options)
      if (this.data.type === option.type)
        res.push(res);
    return res;
  }

  getCurrentOptions() {
    for (let option of this.api.currentUser.options)
      if (this.data.current_options.includes(option.pk))
        return option;
    return null;
  }

  apply(): void {
    this.api.createObj('apply-options', this.applyOptionsForm.value).subscribe((response: any) => {
      console.log(response);
      if (response) {
        this.error = null;
        this.dialogRef.close(true);
      } else
        this.error = this.api.errorLog.pop();
    });
  }
  discard():void{
     this.api.createObj('discard-options', this.discardOptionsForm.value).subscribe((response: any) => {
      console.log(response);
      if (response) {
        this.error = null;
        this.dialogRef.close(true);
      } else
        this.error = this.api.errorLog.pop();
    });
  }
}
