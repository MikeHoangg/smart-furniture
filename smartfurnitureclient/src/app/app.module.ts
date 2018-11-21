import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule, HttpClientXsrfModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ApiService} from "./api.service";
import {NgxStripeModule} from "ngx-stripe";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDialogModule} from '@angular/material/dialog';
import {LoginComponent} from './login/login.component';
import {MatButtonModule} from "@angular/material";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'My-Xsrf-Cookie',
      headerName: 'My-Xsrf-Header',
    }),
    BrowserAnimationsModule,
    NgxStripeModule.forRoot('pk_test_0iZ2ciCzQWinzLyvzEzkuWiE'),
    MatToolbarModule,
    MatDialogModule,
    MatButtonModule,
  ],
  exports: [
    LoginComponent,
  ],
  entryComponents: [
    LoginComponent,
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
