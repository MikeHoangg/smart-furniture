import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatIconRegistry, MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {ApiService} from "../api.service";
import {DomSanitizer} from "@angular/platform-browser";
import {EditProfileComponent} from "../edit-profile/edit-profile.component";
import {OptionsComponent} from "../options/options.component";
import {FurnitureComponent} from "../furniture/furniture.component";
import {ActivatedRoute, Router} from "@angular/router";
import {StripeComponent} from "../stripe/stripe.component";
import {ApplyOptionsComponent} from "../apply-options/apply-options.component";

export interface furniture {
  id: number;
  code: string;
  manufacturer: string;
  type: string;
  owner: any;
}

export interface options {
  id: number;
  type: string;
  name: string;
  height: number;
  length: number;
  width: number;
  incline: number;
  rigidity: string;
  temperature: number;
  massage: string;
}

export interface notification {
  id: number;
  content: string;
  date: string;
  pending: boolean;
  receiver: number;
  sender: number;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  data: any;
  error: any;
  ownedFurnitureDisplayedColumns: string[] = ['code', 'manufacturer', 'type', 'actions', 'settings'];
  furnitureDisplayedColumns: string[] = ['code', 'manufacturer', 'type', 'owner', 'actions', 'settings'];
  optionsDisplayedColumns: string[] = ['type', 'name', 'height', 'length',
    'width', 'incline', 'rigidity', 'temperature', 'massage', 'actions'];
  notificationDisplayedColumns: string[] = ['sender', 'date', 'content', 'actions'];
  ownedFurnitureDataSource: MatTableDataSource<furniture>;
  optionsDataSource: MatTableDataSource<options>;
  notificationsDataSource: MatTableDataSource<notification>;
  allowedFurnitureDataSource: MatTableDataSource<furniture>;
  currentFurnitureDataSource: MatTableDataSource<furniture>;
  prime_types: string[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dialog: MatDialog,
              private api: ApiService,
              private route: ActivatedRoute,
              private router: Router,
              iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('edit',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/baseline-edit-24px.svg'));
    iconRegistry.addSvgIcon('add',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/baseline-add-24px.svg'));
    iconRegistry.addSvgIcon('prime',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/baseline-stars-24px.svg'));
    iconRegistry.addSvgIcon('rate',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/baseline-star_rate-18px.svg'));
    iconRegistry.addSvgIcon('allow',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/baseline-check_circle-24px.svg'));
    iconRegistry.addSvgIcon('disallow',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/baseline-cancel-24px.svg'));
    iconRegistry.addSvgIcon('settings',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/baseline-settings-20px.svg'));
    iconRegistry.addSvgIcon('delete',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/baseline-delete-24px.svg'));
    for (let type of this.api.furnitureTypes) {
      if (type.prime_actions)
        this.prime_types.push(type.name)
    }
  }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    let id = this.route.snapshot.paramMap.get('id');
    if (this.api.currentUser != null && id == null) {
      this.data = this.api.currentUser;
      this.getTables();
    } else if (this.api.currentUser != null && id == this.api.currentUser.id) {
      this.router.navigateByUrl(`/profile`);
    } else {
      this.api.getObj('users', id).subscribe((response: any) => {
        console.log(response);
        if (response) {
          this.error = null;
          this.data = response;
          this.getTables()
        } else {
          this.error = this.api.errorLog.pop();
        }
      });
    }
  }

  isOwner() {
    return this.api.currentUser ? this.api.currentUser.id == this.data.id : false;
  }

  isFurnitureOwner(id) {
    if (this.api.currentUser)
      for (let furniture of this.data.furniture_set)
        if (furniture.id === id && furniture.owner.id === this.api.currentUser.id)
          return true;
    return false;
  }

  getTables() {
    this.optionsDataSource = new MatTableDataSource(this.data.options_set);
    this.optionsDataSource.paginator = this.paginator;
    this.optionsDataSource.sort = this.sort;

    this.ownedFurnitureDataSource = new MatTableDataSource(this.data.owned_furniture);
    this.ownedFurnitureDataSource.paginator = this.paginator;
    this.ownedFurnitureDataSource.sort = this.sort;

    this.notificationsDataSource = new MatTableDataSource(this.data.notification_set);
    this.notificationsDataSource.paginator = this.paginator;
    this.notificationsDataSource.sort = this.sort;

    this.allowedFurnitureDataSource = new MatTableDataSource(this.data.allowed_furniture);
    this.allowedFurnitureDataSource.paginator = this.paginator;
    this.allowedFurnitureDataSource.sort = this.sort;

    this.currentFurnitureDataSource = new MatTableDataSource(this.data.current_furniture);
    this.currentFurnitureDataSource.paginator = this.paginator;
    this.currentFurnitureDataSource.sort = this.sort;
  }

  applyFurnitureFilter(filterValue: string) {
    this.ownedFurnitureDataSource.filter = filterValue.trim().toLowerCase();
    if (this.ownedFurnitureDataSource.paginator)
      this.ownedFurnitureDataSource.paginator.firstPage();
  }

  applyCurrentFurnitureFilter(filterValue: string) {
    this.currentFurnitureDataSource.filter = filterValue.trim().toLowerCase();
    if (this.currentFurnitureDataSource.paginator)
      this.currentFurnitureDataSource.paginator.firstPage();
  }

  applyAllowedFurnitureFilter(filterValue: string) {
    this.allowedFurnitureDataSource.filter = filterValue.trim().toLowerCase();
    if (this.allowedFurnitureDataSource.paginator)
      this.allowedFurnitureDataSource.paginator.firstPage();
  }

  applyNotificationsFilter(filterValue: string) {
    this.notificationsDataSource.filter = filterValue.trim().toLowerCase();
    if (this.notificationsDataSource.paginator)
      this.notificationsDataSource.paginator.firstPage();
  }

  applyOptionsFilter(filterValue: string) {
    this.optionsDataSource.filter = filterValue.trim().toLowerCase();
    if (this.optionsDataSource.paginator)
      this.optionsDataSource.paginator.firstPage();
  }

  isNotPrime() {
    return true;
  }

  //TODO add/edit options + furniture, stripe dialog
  deleteObject(list, id) {
    this.api.deleteObj(list, id).subscribe((response: any) => {
      console.log(response);
    });
  }


  openDialog(name: string, id = null): void {
    let dialogRef;
    if (name === 'editProfile') {
      dialogRef = this.dialog.open(EditProfileComponent);
      this.closedDialog(dialogRef);
    } else if (name === 'addOptions') {
      dialogRef = this.dialog.open(OptionsComponent);
      this.closedDialog(dialogRef);
    } else if (name === 'addFurniture') {
      dialogRef = this.dialog.open(FurnitureComponent);
      this.closedDialog(dialogRef);
    } else if (name === 'upgradePrime') {
      dialogRef = this.dialog.open(StripeComponent);
      this.closedDialog(dialogRef);
    } else if (name === 'editFurniture') {
      this.api.getObj('furniture', id).subscribe((response: any) => {
        console.log(response);
        if (response) {
          dialogRef = this.dialog.open(FurnitureComponent, {data: response});
          this.closedDialog(dialogRef);
        }
      });
    } else if (name === 'editOptions') {
      this.api.getObj('options', id).subscribe((response: any) => {
        console.log(response);
        if (response) {
          dialogRef = this.dialog.open(OptionsComponent, {data: response});
          this.closedDialog(dialogRef);
        }
      });
    } else if (name === 'settings') {
      this.api.getObj('furniture', id).subscribe((response: any) => {
        console.log(response);
        if (response) {
          dialogRef = this.dialog.open(ApplyOptionsComponent, {data: response});
          this.closedDialog(dialogRef);
        }
      });
    }
  }

  closedDialog(dialogRef) {
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.getCurrentUser().subscribe((response: any) => {
          console.log(response);
          if (response) {
            this.api.currentUser = response;
            this.data = this.api.currentUser;
            this.ownedFurnitureDataSource = new MatTableDataSource(this.api.currentUser.owned_furniture);
            this.optionsDataSource = new MatTableDataSource(this.api.currentUser.options_set);
          }
        });
      }
    });
  }
}
