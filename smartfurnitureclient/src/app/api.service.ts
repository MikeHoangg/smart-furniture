import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {Observable, of} from "rxjs";
import {StripeScriptTag} from "stripe-angular";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiUrl: string = 'http://127.0.0.1:8000/en/api/v1';
  errorLog: Array<object> = [];
  currentUser: any;
  massageRigidityTypes: any;
  furnitureTypes: any;


  loadUser() {
    return new Promise((resolve, reject) => {
      if (document.cookie.match(/auth_token=(Token \w+)/)) {
        this.getCurrentUser().subscribe((response: any) => {
          resolve();
          console.log(response);
          if (response)
            this.currentUser = response;
        });
      } else
        resolve();
    })
  }

  loadFurnitureTypes() {
    return new Promise((resolve, reject) => {
      this.getList('furniture-types').subscribe((response: any) => {
        console.log(response);
        resolve();
        if (response)
          this.furnitureTypes = response;
      });
    })
  }

  loadMassageRigidityTypes() {
    return new Promise((resolve, reject) => {
      this.getList('massage-rigidity-types').subscribe((response: any) => {
        console.log(response);
        resolve();
        if (response)
          this.massageRigidityTypes = response;
      });
    })
  }

  constructor(private httpClient: HttpClient,
              public stripeTag: StripeScriptTag) {
    this.stripeTag.setPublishableKey("pk_test_0iZ2ciCzQWinzLyvzEzkuWiE")
  }


  private handleError<T>(result?: T) {
    return (response: any): Observable<T> => {
      this.errorLog.push(response.error);
      return of(result as T);
    };
  }

  private getHttpOptions() {
    let res = {};
    let authCookie = document.cookie.match(/auth_token=(Token \w+)/);
    let csrfCookie = document.cookie.match(/csrftoken=(w+)/);
    if (authCookie)
      res['Authorization'] = authCookie[1];
    // if (csrfCookie)
    //   res['X-CSRFTOKEN'] = csrfCookie[1];
    return {headers: new HttpHeaders(res)}
  }

  authorize(action, data = null) {
    return this.httpClient.post(`${this.apiUrl}/${action}/`, data)
      .pipe(catchError(this.handleError()));
  }

  getCurrentUser() {
    return this.httpClient.get(`${this.apiUrl}/user/`, this.getHttpOptions())
      .pipe(catchError(this.handleError()));
  }

  editCurrentUser(data) {
    return this.httpClient.put(`${this.apiUrl}/user/`, data, this.getHttpOptions())
      .pipe(catchError(this.handleError()));
  }

  getList(list) {
    return this.httpClient.get(`${this.apiUrl}/${list}/`, this.getHttpOptions())
      .pipe(catchError(this.handleError()));
  }

  getObj(list, pk) {
    return this.httpClient.get(`${this.apiUrl}/${list}/${pk}/`, this.getHttpOptions())
      .pipe(catchError(this.handleError()));
  }

  editObj(list, pk, data) {
    return this.httpClient.put(`${this.apiUrl}/${list}/${pk}/`, data, this.getHttpOptions())
      .pipe(catchError(this.handleError()));
  }

  createObj(list, data) {
    return this.httpClient.post(`${this.apiUrl}/${list}/`, data, this.getHttpOptions())
      .pipe(catchError(this.handleError()));
  }

  deleteObj(list, id) {
    return this.httpClient.delete(`${this.apiUrl}/${list}/${id}`, this.getHttpOptions())
      .pipe(catchError(this.handleError()));
  }
}
