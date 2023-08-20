/**
 * Title: nav.component.ts
 * Author: Professor Krasso
 * Date: 8/5/23
 */

// imports statements
import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

// AppUser interface
export interface AppUser {
  fullName: string;
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent {
  appUser: AppUser;
  isSignedIn: boolean;

  constructor(private cookieService: CookieService) {
    this.appUser = {} as AppUser;
    this.isSignedIn = this.cookieService.get('session_user') ? true : false;

    if (this.isSignedIn) {
      this.appUser = {
        // set full name of user
        fullName: this.cookieService.get('session_name'),
      };
    }
  }

  // sign user off
  signout() {
    this.cookieService.deleteAll();
    // take user back to home page
    window.location.href = '/';
  }
}
