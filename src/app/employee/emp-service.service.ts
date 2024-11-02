import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root' // Makes this service available throughout the app
  })
export class EmpServiceService {

    private baseUrl = 'https://employee-app-hxb2.onrender.com'; // Replace with actual API base URL
    username = signal<string | undefined>(undefined);

    http= inject(HttpClient);

    private getToken(): string | null {
        return localStorage.getItem('accessToken'); // Access token key should match the key used to store it
    }
    
    employeeList(): Observable<any> {
        const token = this.getToken(); // Retrieve token from localStorage
    
        // Set Authorization header if token exists
        // const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    
        return this.http.post(`${this.baseUrl}/employees/list/`,{});
    }

    employeeCreate(payload: any): Observable<any> {
      const token = this.getToken(); // Retrieve token from localStorage
    
      // Set Authorization header if token exists
      const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    
      // Send the payload as the body of the POST request
      return this.http.post(`${this.baseUrl}/employees/create/`, payload, { headers });
    }

    employeeUpdate(id:string,payload: any): Observable<any> {
      const token = this.getToken(); // Retrieve token from localStorage
    
      // Set Authorization header if token exists
      const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    
      // Send the payload as the body of the POST request
      return this.http.patch(`${this.baseUrl}/employees/update/?id=${id}`, payload, { headers });
    }

    employeeDelete(id:string): Observable<any> {
      const token = this.getToken(); // Retrieve token from localStorage
    
      // Set Authorization header if token exists
      const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    
      // Send the payload as the body of the POST request
      return this.http.delete(`${this.baseUrl}/employees/delete/?id=${id}`, { headers });
    }

    employeeDetail(id: string): Observable<any> {
      const token = this.getToken(); // Retrieve token from localStorage
      const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    
      return this.http.get(`${this.baseUrl}/employees/single-employee/?id=${id}`, { headers });
    }
}
