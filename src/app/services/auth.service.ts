import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, Subject, interval } from 'rxjs';
import { LoginData } from '../models/login-data';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as JWTDecoder from 'jwt-decode';
import { TokenInfo } from '../models/token-info';
import { ChangePasswordRequest } from '../models/change-password-request';
import { ChangePasswordResponse } from '../models/change-password-response';

@Injectable({
  providedIn: 'root'
})

export class AuthService implements OnDestroy {
  private onDestroy$ = new Subject();
  private changePasswordToken = '';
  constructor(private http: HttpClient, private router: Router) { }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  /**
   * Method logout's user
   */
  public logout(): void {
    localStorage.setItem('token', '');
    this.router.navigate(['/login']);
    this.onDestroy$.next();
  }

  /**
   * Method returns token from localstorage
   * @returns - Current token
   */
  public getToken(): string {
    return localStorage.getItem('token');
  }

  /**
   * Method get token from server and saves to localstorage
   * @param data - This is object with user's username and password
   * @returns - New token
   */
  public login(data: LoginData): Observable<HttpResponse<object|null>> {
    return this.http.post<HttpResponse<object|null>>(`/signin`, data, { observe: 'response' })
      .pipe(
        tap(response => {
          const token: string = response.headers.get('Authorization');
          localStorage.setItem('token', token);
          this.refreshTokenTimer().subscribe();
          this.router.navigate(['']);
        })
      );
  }

  /**
   * Method use current token to get new token
   * @returns - New token
   */
  public refreshToken(): Observable<any> {
    return this.http.get<HttpResponse<object|null>>(`/refresh`, { observe: 'response' })
      .pipe(
        tap(response => {
          const newToken = response.headers.get('Authorization');
          localStorage.setItem('token', newToken);
        }),
        catchError(error => {
          if (error.status.code === 401) {
            this.logout();
          }
          return error;
        })
      );
  }

  /**
   * Method send link to email to reset user's password
   * @param query - Users login or email
   * @returns - Status of recovery process
   */
  public requestPasswordChange(query: string): Observable<ChangePasswordResponse> {
    return this.http.get<ChangePasswordResponse>(`/requestPasswordReset?query=${query}`);
  }

  /**
   * Method resets current password
   * @param password - Users password
   * @param token - Token for change password
   * @returns - New password
   */
  public changePassword(password: string, token: string): Observable<ChangePasswordResponse> {
    const data: ChangePasswordRequest = {
      password,
      token
    };
    return this.http.put<ChangePasswordResponse>(`/resetPassword`, data);
  }

  /**
   * Method creates recursive timeout which refreshes token after delay
   */
  private refreshTokenTimer(): Observable<HttpResponse<object|null>> {
    const delay = 300000;
    return interval(delay)
      .pipe(
        switchMap(() => this.refreshToken()),
        catchError(error => {
          if (error.status.code === 401) {
            this.logout();
          }
          return error;
        }),
        takeUntil(this.onDestroy$)
      );
  }

  /**
   * Method checks if current token is valid and refreshes it to continue current session
   * @returns - New token or nothing
   */
  public checkTokenValidity(): boolean | void {
    if (this.getToken()) {
      const decodedToken: TokenInfo = JWTDecoder(this.getToken());
      const expTime: number = decodedToken.exp;
      if (expTime * 1000 > Date.now()) {
        this.refreshTokenTimer().subscribe();
        return;
      }
    }
    this.logout();
  }

  /**
   * Method gets user's role from token
   * @returns - User role
   */
  public getUserRole(): string | boolean {
    if (this.getToken()) {
      const decodedToken: TokenInfo = JWTDecoder(this.getToken());
      return decodedToken.Roles.authority;
    } else {
      return false;
    }
  }

  /**
   * Method gets user id from decoded token
   * @returns - user id
   */
  public getUserId(): number  {
    const decodedToken: TokenInfo = JWTDecoder(this.getToken());
    return decodedToken.jti;
  }

  /**
   * Method returns token for change password
   * @returns - token
   */
  public getChangePasswordToken(): string {
    return this.changePasswordToken;
  }

  /**
   * Method sets new token to change password token variable
   * @param token - new token
   */
  public setChangePasswordToken(token: string): void {
    this.changePasswordToken = token;
  }
}
