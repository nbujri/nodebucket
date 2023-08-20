/**
 * title: security.service.ts
 * author: ngi bujri
 * date: august 16 2023
 * description: security service
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  constructor(private http: HttpClient) {}

  // return employee with a matching ID
  findEmployeeById(empId: number) {
    return this.http.get(`/api/employees/${empId}`);
  }
}
