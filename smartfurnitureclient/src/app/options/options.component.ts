import {Component, Input, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material";
import {ApiService} from "../api.service";
import {FormGroup} from "@angular/forms";

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

  constructor(private dialogRef: MatDialogRef<OptionsComponent>,
              private api: ApiService) {
    this.title = this.data ? "Add options" : "Edit options";
  }

  ngOnInit() {
  }

  save(): void {
    if (this.title === "Add options") {
      // TODO add options
    } else {
      // TODO edit options
    }
  }
}
