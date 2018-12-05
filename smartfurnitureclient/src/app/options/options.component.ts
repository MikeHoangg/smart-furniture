import {Component, Input, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material";
import {ApiService} from "../api.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {
  @Input() data: any;
  title: string;
  error: any;
  optionsForm: FormGroup;
  types: any;
  massage_types: any;
  rigidity_types: any;
  prime_types: any;
  is_prime_type: boolean;

  constructor(private dialogRef: MatDialogRef<OptionsComponent>,
              private api: ApiService) {
    this.title = this.data ? "Add options" : "Edit options";

    this.optionsForm = new FormGroup({
      type: new FormControl(this.data ? this.data.type : 'chair', [Validators.required]),
      name: new FormControl(this.data ? this.data.name : null, [Validators.required, Validators.maxLength(32)]),
      height: new FormControl(this.data ? this.data.height : api.currentUser.height * 3 / 7, [Validators.min(0)]),
      length: new FormControl(this.data ? this.data.length : api.currentUser.height * 2 / 7, [Validators.min(0)]),
      width: new FormControl(this.data ? this.data.width : api.currentUser.height * 2 / 7, [Validators.min(0)]),
      incline: new FormControl(this.data ? this.data.incline : 95, [Validators.max(180), Validators.min(0)]),
      temperature: new FormControl(this.data ? this.data.temperature : 36.6),
      massage: new FormControl(this.data ? this.data.massage : 'none'),
      rigidity: new FormControl(this.data ? this.data.massage : 'medium'),
      creator: new FormControl(api.currentUser.pk),
    });
    this.title = this.data ? "Add furniture" : "Edit furniture";
    this.types = api.furnitureTypes;
    this.rigidity_types = this.massage_types = [];
    for (let type of api.massageRigidityTypes) {
      if (type.type === 'massage')
        this.massage_types.push(type);
      else
        this.rigidity_types.push(type);
    }
    this.prime_types = [];
    for (let type of this.types) {
      if (type.prime_actions)
        this.prime_types.push(type.name)
    }
    this.is_prime_type = this.data ? this.prime_types.includes(this.data.type) : true;
  }

  ngOnInit() {
  }

  save(): void {
    if (this.title === "Add options") {
      this.api.createObj('options', this.optionsForm.value).subscribe((response: any) => {
        console.log(response);
        if (response) {
          this.error = null;
          this.dialogRef.close(true);
        } else
          this.error = this.api.errorLog.pop();
      });
    } else {
      this.api.editObj('options', this.data.pk, this.optionsForm.value).subscribe((response: any) => {
        console.log(response);
        if (response) {
          this.error = null;
          this.dialogRef.close(true);
        } else
          this.error = this.api.errorLog.pop();
      });
    }
  }

  // TODO check if account is prime
  isPrimeAccount() {
    return true;
  }

  onTypeChange() {
    this.is_prime_type = this.prime_types.include(this.optionsForm.value['type']);
    switch (this.optionsForm.value['type']) {
      case 'sofa':
        this.optionsForm.value['height'] = this.api.currentUser.height * 3 / 7;
        this.optionsForm.value['length'] = this.api.currentUser.height * 3 / 7;
        this.optionsForm.value['width'] = this.api.currentUser.height * 3 / 7;
        break;
      case 'bed':
        this.optionsForm.value['height'] = this.api.currentUser.height * 3 / 7;
        this.optionsForm.value['length'] = this.api.currentUser.height * 10 / 7;
        this.optionsForm.value['width'] = this.api.currentUser.height * 9 / 7;
        break;
      case 'chair':
        this.optionsForm.value['height'] = this.api.currentUser.height * 3 / 7;
        this.optionsForm.value['length'] = this.api.currentUser.height * 2 / 7;
        this.optionsForm.value['width'] = this.api.currentUser.height * 2 / 7;
        break;
      case 'table':
        this.optionsForm.value['height'] = this.api.currentUser.height * 4 / 7;
        this.optionsForm.value['length'] = this.api.currentUser.height * 4 / 7;
        this.optionsForm.value['width'] = this.api.currentUser.height * 5 / 7;
        break;
      case 'desk':
        this.optionsForm.value['height'] = this.api.currentUser.height * 4 / 7;
        this.optionsForm.value['length'] = this.api.currentUser.height * 4 / 7;
        this.optionsForm.value['width'] = this.api.currentUser.height * 5 / 7;
        break;
      case 'cupboard':
        this.optionsForm.value['height'] = this.api.currentUser.height * 10 / 7;
        this.optionsForm.value['length'] = this.api.currentUser.height * 3 / 7;
        this.optionsForm.value['width'] = this.api.currentUser.height * 4 / 7;
        break;
      default:
        break;
    }
  }
}
