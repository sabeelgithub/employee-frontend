import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root' // Makes this service available throughout the app
})
export class AuthService {
  
  private baseUrl = 'https://employee-app-hxb2.onrender.com'; // Replace with actual API base URL

  http= inject(HttpClient);
  // Register a new user
  register(data: { email: string, username: string, phone: string, password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/accounts/create/`, data);
  }

  // Login an existing user
  login(data: { username: string, password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/accounts/login/`, data);
  }

  // Logout the current user
  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout`, {});
  }

  // Example for getting user profile (if needed)
  getUserProfile(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.baseUrl}/profile`, { headers });
  }

  changePassword(payload:any): Observable<any> {
    return this.http.post(`${this.baseUrl}/acounts/change-password/`,payload);
  }


  refreshAccessToken(): Observable<any> {
    // Call the refresh token endpoint to get a new access token
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<any>(`${this.baseUrl}/accounts/token/refresh/`, { refresh : refreshToken }).pipe(
      tap((response) => {
        // Update the access token in the local storage
        localStorage.setItem('accessToken', response.data.access_token);
      }),
      catchError((error) => {
        // Handle refresh token error (e.g., redirect to login page)
        console.error('Error refreshing access token:', error);
        return throwError(error);
      })
    );
  }
}
