import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../api.service";
import {MatSnackBar} from '@angular/material';
import {TranslateService} from "@ngx-translate/core";

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
  prime_types: any[] = [];


  constructor(@Inject(MAT_DIALOG_DATA) private curr_furniture: any,
              private dialogRef: MatDialogRef<ApplyOptionsComponent>,
              private api: ApiService,
              public snackBar: MatSnackBar,
              public translate: TranslateService) {
    this.curr_opts = this.getCurrentOptions();
    this.applyOptionsForm = new FormGroup({
      options: new FormControl(this.curr_opts ? this.curr_opts.id : null, [Validators.required]),
      furniture: new FormControl(curr_furniture.id, [Validators.required])
    });
    this.discardOptionsForm = new FormGroup({
      user: new FormControl(api.currentUser ? api.currentUser.id : null, [Validators.required]),
      furniture: new FormControl(curr_furniture.id, [Validators.required])
    });
    this.options = this.getOptions();
    if (api.furnitureTypes)
      for (let type of api.furnitureTypes)
        if (type.prime_actions)
          this.prime_types.push(type.name)
  }

  ngOnInit() {
  }

  getOptions(): any[] {
    let options = [];
    if (this.api.currentUser)
      for (let option of this.api.currentUser.options_set)
        if (this.curr_furniture.type === option.type)
          options.push(option);
    return options;
  }

  getCurrentOptions(): any {
    if (this.api.currentUser)
      for (let option of this.api.currentUser.options_set)
        for (let curr_opts of this.curr_furniture.current_options)
          if (option.id == curr_opts.id)
            return option;
    return null;
  }

  yes(): void {
    this.no();
    if (this.api.currentUser)
      this.api.createObj('notifications', {
        'sender': this.api.currentUser.id,
        'receiver': this.curr_furniture.owner.id,
        'furniture': this.curr_furniture.id,
      }).subscribe((response: any) => {
          if (response)
            this.translate.get('ACTION.SENT').subscribe((res: string) => {
              this.snackBar.open(res, 'OK', {
                duration: 5000,
              });
            });
        }
      );
  }

  no(): void {
    this.error = null;
    this.status = null;
  }

  apply(): void {
    if (this.applyOptionsForm.valid)
      this.api.createObj('apply-options', this.applyOptionsForm.value).subscribe((response: any) => {
        if (response) {
          this.no();
          this.dialogRef.close(true);
          this.snackBar.open(response.detail, 'OK', {
            duration: 5000,
          });
        } else {
          this.status = this.api.statusLog.pop();
          this.error = this.api.errorLog.pop();
        }
      });
  }

  discard(): void {
    if (this.discardOptionsForm.valid)
      this.api.createObj('discard-options', this.discardOptionsForm.value).subscribe((response: any) => {
        if (response) {
          this.error = null;
          this.dialogRef.close(true);
          this.snackBar.open(response.detail, 'OK', {
            duration: 5000,
          });
        } else {
          this.error = this.api.errorLog.pop();
          this.status = this.api.statusLog.pop();
        }
      });
  }

  isFurnitureOwner() {
    if (this.api.currentUser)
      for (let furniture of this.api.currentUser.owned_furniture)
        if (furniture.id === this.curr_furniture.id && furniture.owner.id === this.api.currentUser.id)
          return true;
    return false;
  }

  disallow(user_id) {
    if (this.isFurnitureOwner())
      this.api.createObj('disallow', {
        'furniture': this.curr_furniture.id,
        'user': user_id,
      }).subscribe((response: any) => {
        if (response) {
          this.api.getObj('furniture', this.curr_furniture.id).subscribe((response: any) => {
            if (response)
              this.curr_furniture = response;
          });
          this.snackBar.open(response.detail, 'OK', {
            duration: 5000,
          });
        }
      });
  }

  getAvg(attr) {
    if (attr != 'massage' && attr != 'rigidity') {
      let res = 0;
      for (let option of this.curr_furniture.current_options)
        res += option[attr];
      return Math.round(res / this.curr_furniture.current_options.length)
    } else if (attr == 'massage') {
      let res = {
        'none': 0,
        'slow': 0,
        'medium': 0,
        'rapid': 0
      };
      for (let option of this.curr_furniture.current_options)
        res[option[attr]]++;
      return Object.keys(res).reduce(function (a, b) {
        return res[a] > res[b] ? a : b
      });
    } else if (attr == 'rigidity') {
      let res = {
        'soft': 0,
        'medium': 0,
        'solid': 0
      };
      for (let option of this.curr_furniture.current_options)
        res[option[attr]]++;
      return Object.keys(res).reduce(function (a, b) {
        return res[a] > res[b] ? a : b
      });
    }
  }
}
