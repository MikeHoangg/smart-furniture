import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatIconRegistry, MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {ApiService} from "../api.service";
import {DomSanitizer} from "@angular/platform-browser";
import {LoginComponent} from "../login/login.component";
import {RegisterComponent} from "../register/register.component";
import {EditProfileComponent} from "../edit-profile/edit-profile.component";
import {OptionsComponent} from "../options/options.component";
import {FurnitureComponent} from "../furniture/furniture.component";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public data: any;
  furnitureDisplayedColumns: string[] = ['id', 'code', 'manufacturer', 'type'];
  optionsDisplayedColumns: string[] = ['id', 'type', 'name', 'height', 'length',
    'width', 'incline', 'rigidity', 'temperature', 'massage'];
  ownedFurnitureDataSource: any;
  optionsDataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dialog: MatDialog,
              private api: ApiService,
              iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    this.data = api.currentUser;
    iconRegistry.addSvgIcon('edit',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/baseline-edit-24px.svg'));
    iconRegistry.addSvgIcon('add',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/baseline-add-24px.svg'));
    console.log(this.api.currentUser);
    this.ownedFurnitureDataSource = new MatTableDataSource(this.api.currentUser.owned_furniture);
    this.optionsDataSource = new MatTableDataSource(this.api.currentUser.options_set);
    console.log(this.api.currentUser.owned_furniture);
  }

  ngOnInit() {
    this.ownedFurnitureDataSource.paginator = this.paginator;
    this.ownedFurnitureDataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.ownedFurnitureDataSource.filter = filterValue.trim().toLowerCase();

    if (this.ownedFurnitureDataSource.paginator) {
      this.ownedFurnitureDataSource.paginator.firstPage();
    }
  }
  //TODO add/edit options + furniture, stripe dialog
  openDialog(name: string): void {
    let dialogRef;
    if (name === 'editProfile')
      dialogRef = this.dialog.open(EditProfileComponent);
    else if (name === 'addOptions')
      dialogRef = this.dialog.open(OptionsComponent);
    else if (name === 'addFurniture')
      dialogRef = this.dialog.open(FurnitureComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.api.getCurrentUser().subscribe((response: any) => {
        console.log(response);
        if (response) {
          this.api.currentUser = response;
          this.ownedFurnitureDataSource = new MatTableDataSource(this.api.currentUser.owned_furniture);
          this.optionsDataSource = new MatTableDataSource(this.api.currentUser.options_set);
        }
      });
    });
  }
}
