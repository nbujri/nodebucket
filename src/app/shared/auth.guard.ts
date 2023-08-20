/**
 * title: auth.guard.ts
 * author: ngi bujri
 * date: august 16 2023
 * description: auth guard
 */

import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export const authGuard: CanActivateFn = (route, state) => {
  const cookie = inject(CookieService);

  if (cookie.get('session_user')) {
    console.log('You are logged in and have a valid session cookie');
    return true;
  } else {
    console.log('You must be logged in to access this page!');
    const router = inject(Router);
    // navigate user to sign in page if not logged in
    router.navigate(['/security/signin'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
};
