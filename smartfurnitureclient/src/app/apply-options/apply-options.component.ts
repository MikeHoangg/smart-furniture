import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef, MatIconRegistry} from "@angular/material";
import {ApiService} from "../api.service";
import {MatSnackBar} from '@angular/material';
import {TranslateService} from "@ngx-translate/core";
import {DomSanitizer} from "@angular/platform-browser";

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


  constructor(private dialogRef: MatDialogRef<ApplyOptionsComponent>,
              private api: ApiService, public snackBar: MatSnackBar, public translate: TranslateService,
              @Inject(MAT_DIALOG_DATA) private data: any, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('allow',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/baseline-check_circle-24px.svg'));
    iconRegistry.addSvgIcon('disallow',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/baseline-cancel-24px.svg'));
    this.curr_opts = this.getCurrentOptions();
    this.applyOptionsForm = new FormGroup({
      options: new FormControl(this.curr_opts ? this.curr_opts.id : null, [Validators.required]),
      furniture: new FormControl(data.id, [Validators.required])
    });
    this.discardOptionsForm = new FormGroup({
      furniture: new FormControl(data.id, [Validators.required]),
      user: new FormControl(api.currentUser.id, [Validators.required])
    });
    this.options = this.getOptions();
    for (let type of api.furnitureTypes)
      if (type.prime_actions)
        this.prime_types.push(type.name)
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
    console.log(this.data.current_options);
    console.log(this.api.currentUser.options_set);
    for (let option of this.api.currentUser.options_set)
      for (let curr_opts of this.data.current_options)
        if (option.id == curr_opts.id)
          return option;
    return null;
  }

  yes() {
    this.error = null;
    this.status = null;
    this.api.createObj('notifications', {
      'sender': this.api.currentUser.id,
      'receiver': this.data.owner.id,
      'furniture': this.data.id,
    }).subscribe((response: any) => {
        console.log(response);
        if (response)
          this.translate.get('ACTION.SENT').subscribe((res: string) => {
            this.snackBar.open(res, 'OK', {
              duration: 5000,
            });
          });
      }
    );
  }

  no() {
    this.error = null;
    this.status = null;
  }

  apply(): void {
    if (this.applyOptionsForm.valid)
      this.api.createObj('apply-options', this.applyOptionsForm.value).subscribe((response: any) => {
        console.log(response);
        if (response) {
          this.error = null;
          this.status = null;
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
        console.log(response);
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
    if (this.api.currentUser != null)
      for (let furniture of this.api.currentUser.owned_furniture)
        if (furniture.id === this.data.id && furniture.owner.id === this.api.currentUser.id)
          return true;
    return false;
  }

  disallow(user) {
    this.api.createObj('disallow', {
      'furniture': this.data.id,
      'user': user,
    }).subscribe((response: any) => {
      console.log(response);
      if (response) {
        this.api.getObj('furniture', this.data.id).subscribe((response: any) => {
          console.log(response);
          if (response) {
            this.data = response;
          }
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
      for (let option of this.data.current_options)
        res += option[attr];
      return Math.round(res / this.data.current_options.length)
    } else if (attr == 'massage') {
      let res = {
        'none': 0,
        'slow': 0,
        'medium': 0,
        'rapid': 0
      };
      for (let option of this.data.current_options)
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
      for (let option of this.data.current_options)
        res[option[attr]]++;
      return Object.keys(res).reduce(function (a, b) {
        return res[a] > res[b] ? a : b
      });
    }
  }
}
