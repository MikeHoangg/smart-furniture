import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {HttpClientModule, HttpClientXsrfModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule, MatInputModule} from "@angular/material";
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatListModule} from '@angular/material/list';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatExpansionModule} from '@angular/material/expansion';

import {ApiService} from "./api.service";
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {HomeComponent} from './home/home.component';
import {ProfileComponent} from './profile/profile.component';
import {EditProfileComponent} from './edit-profile/edit-profile.component';
import {FurnitureListComponent} from './furniture-list/furniture-list.component';
import {FurnitureDetailComponent} from './furniture-detail/furniture-detail.component';
import {FurnitureComponent} from './furniture/furniture.component';
import {OptionsComponent} from './options/options.component';
import {StripeComponent} from './stripe/stripe.component';
import {ApplyOptionsComponent} from './apply-options/apply-options.component';
import {AllowDisallowComponent} from './allow-disallow/allow-disallow.component';
import {ManufacturerComponent} from './manufacturer/manufacturer.component';

import {loadFurnitureTypesProvider, loadMassageRigidityTypesProvider, loadUserProvider} from "./api_load";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    EditProfileComponent,
    FurnitureListComponent,
    FurnitureDetailComponent,
    FurnitureComponent,
    OptionsComponent,
    StripeComponent,
    ApplyOptionsComponent,
    AllowDisallowComponent,
    ManufacturerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'csrftoken',
      headerName: 'X-CSRFTOKEN',
    }),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatListModule,
    MatPaginatorModule,
    MatExpansionModule,
  ],
  exports: [
    LoginComponent,
    RegisterComponent,
    StripeComponent,
    EditProfileComponent,
  ],
  entryComponents: [
    LoginComponent,
    RegisterComponent,
    StripeComponent,
    EditProfileComponent,
  ],
  providers: [ApiService,
    {provide: APP_INITIALIZER, useFactory: loadUserProvider, deps: [ApiService], multi: true},
    {provide: APP_INITIALIZER, useFactory: loadFurnitureTypesProvider, deps: [ApiService], multi: true},
    {provide: APP_INITIALIZER, useFactory: loadMassageRigidityTypesProvider, deps: [ApiService], multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
