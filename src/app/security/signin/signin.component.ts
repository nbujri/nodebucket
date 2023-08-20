/**
 * title: signin.component.ts
 * author; ngi bujri
 * date: august 16 2023
 * description: sign in feature
 */

import { Component } from '@angular/core';
import { SecurityService } from '../security.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

// SessionUser interface
export interface SessionUser {
  empId: number;
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent {
  errorMessage: string;
  sessionUser: SessionUser;
  isLoading: boolean = false;

  // create form group
  signinForm = this.fb.group({
    // make ID required and accept numbers only
    empId: [
      null,
      Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')]),
    ],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cookieService: CookieService,
    private secService: SecurityService,
    private route: ActivatedRoute
  ) {
    // initialize sessionUser and errorMessage
    this.sessionUser = {} as SessionUser;
    this.errorMessage = '';
  }

  // sign in a user
  signin() {
    this.isLoading = true;
    // get ID from form
    const empId = this.signinForm.controls['empId'].value;

    // check if ID is a number
    if (!empId || isNaN(parseInt(empId, 10))) {
      this.errorMessage =
        'The employee ID you entered is invalid, please try again.';
      this.isLoading = false;
      return;
    }

    this.secService.findEmployeeById(empId).subscribe({
      next: (employee: any) => {
        this.sessionUser = employee;
        // set cookie name, value, and expire in 1 day
        this.cookieService.set('session_user', empId, 1);
        this.cookieService.set(
          'session_name',
          `${employee.firstName} ${employee.lastName}`,
          1
        );
        const returnUrl =
          this.route.snapshot.queryParamMap.get('returnUrl') || '/';
        this.isLoading = false;
        this.router.navigate([returnUrl]);
      },
      error: (err) => {
        this.isLoading = false;

        if (err.error.message) {
          this.errorMessage = err.error.message;
          return;
        }
        this.errorMessage = err.message;
      },
    });
  }
}
