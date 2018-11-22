import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiUrl: string = 'http://127.0.0.1:8000/en/api/v1/';
  errorLog: Array<object> = [];
  currentUser: any;

  constructor(private httpClient: HttpClient) {
  }

  private handleError<T>(result?: T) {
    return (response: any): Observable<T> => {
      this.errorLog.push(response.error);
      return of(result as T);
    };
  }

  private getHttpOptions() {
    let res = {};
    const cookies = document.cookie.split(';');
    const authRegex = new RegExp('^auth_token=');
    const csrfRegex = new RegExp('^csrftoken=');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (authRegex.test(cookie))
        res['Authorization'] = cookie.substr(11, cookie.length);
    }
    return {headers: new HttpHeaders(res)}
  }

  login(data) {
    return this.httpClient.post(`${this.apiUrl}login/`, data)
      .pipe(catchError(this.handleError()));
  }

  register(data) {
    return this.httpClient.post(`${this.apiUrl}register/`, data)
      .pipe(catchError(this.handleError()));
  }

  logout() {
    return this.httpClient.post(`${this.apiUrl}logout/`, null)
      .pipe(catchError(this.handleError()));
  }

  getCurrentUser() {
    return this.httpClient.get(`${this.apiUrl}user/`, this.getHttpOptions())
      .pipe(catchError(this.handleError()));
  }

  editCurrentUser(data) {
    return this.httpClient.put(`${this.apiUrl}user/`, data, this.getHttpOptions())
      .pipe(catchError(this.handleError()));
  }
}
