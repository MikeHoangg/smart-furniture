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


  constructor(@Inject(MAT_DIALOG_DATA) private furniture_obj: any,
              private dialogRef: MatDialogRef<ApplyOptionsComponent>,
              private api: ApiService,
              public snackBar: MatSnackBar,
              public translate: TranslateService) {
    this.curr_opts = this.getCurrentOptions();
    this.applyOptionsForm = new FormGroup({
      options: new FormControl(this.curr_opts ? this.curr_opts.id : null, [Validators.required]),
      furniture: new FormControl(furniture_obj.id, [Validators.required])
    });
    this.discardOptionsForm = new FormGroup({
      user: new FormControl(api.currentUser ? api.currentUser.id : null, [Validators.required]),
      furniture: new FormControl(furniture_obj.id, [Validators.required])
    });
    this.options = this.getOptions();
    if (api.furnitureTypes)
      for (let t of api.furnitureTypes)
        if (t.prime_actions)
          this.prime_types.push(t.name)
  }

  ngOnInit() {
  }

  getOptions(): any[] {
    let options = [];
    if (this.api.currentUser)
      for (let o of this.api.currentUser.options_set)
        if (this.furniture_obj.type === o.type)
          options.push(o);
    return options;
  }

  getCurrentOptions(): any {
    if (this.api.currentUser)
      for (let o of this.api.currentUser.options_set)
        for (let co of this.furniture_obj.current_options)
          if (o.id == co.id)
            return o;
    return null;
  }

  yes(): void {
    this.no();
    if (this.api.currentUser)
      this.api.createObj('notifications', {
        'sender': this.api.currentUser.id,
        'receiver': this.furniture_obj.owner.id,
        'furniture': this.furniture_obj.id,
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
        if (furniture.id === this.furniture_obj.id && furniture.owner.id === this.api.currentUser.id)
          return true;
    return false;
  }

  disallow(user_id) {
    if (this.isFurnitureOwner())
      this.api.createObj('disallow', {
        'furniture': this.furniture_obj.id,
        'user': user_id,
      }).subscribe((response: any) => {
        if (response) {
          this.api.getObj('furniture', this.furniture_obj.id).subscribe((response: any) => {
            if (response)
              this.furniture_obj = response;
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
      for (let o of this.furniture_obj.current_options)
        res += o[attr];
      res = res / this.furniture_obj.current_options.length;
      return res.toFixed(2);
    } else if (attr == 'massage') {
      let res = {
        'none': 0,
        'slow': 0,
        'medium': 0,
        'rapid': 0
      };
      for (let o of this.furniture_obj.current_options)
        res[o[attr]]++;
      return Object.keys(res).reduce(function (a, b) {
        return res[a] > res[b] ? a : b
      });
    } else if (attr == 'rigidity') {
      let res = {
        'soft': 0,
        'medium': 0,
        'solid': 0
      };
      for (let o of this.furniture_obj.current_options)
        res[o[attr]]++;
      return Object.keys(res).reduce(function (a, b) {
        return res[a] > res[b] ? a : b
      });
    }
  }
}
