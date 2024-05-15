import { Injectable } from '@angular/core';
import { LoginRequest } from './loginRequest';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  currentUserData: BehaviorSubject<User> = new BehaviorSubject<User>({
    id: 0,
    email: '',
  });

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<User> {
    return this.http.get<User>('././assets/data.json').pipe(
      tap((userData) => {
        this.currentUserData.next(userData);
        this.currentUserLoginOn.next(true);
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('se ha prducido un error', error.error);
    } else {
      console.error(
        'backend retorno el codigo de estado',
        error.status,
        error.error
      );
    }
    return throwError(
      () => new Error('algo fallo. por favor intente nuevamente')
    );
  }

  get userData(): Observable<User> {
    return this.currentUserData.asObservable();
  }

  get userLoginOn(): Observable<boolean> {
    return this.currentUserLoginOn.asObservable();
  }
}
