import { Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../models/user';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private oidcSecurityService: OidcSecurityService) {}

  // Retrieve user data
  getUserData(): Observable<User | null> {
    return this.oidcSecurityService.userData$.pipe(
      map((userData: any) => {
        if (userData && userData.userData) {
          return {
            sub: userData.userData.sub,
            name: userData.userData.name,
            email: userData.userData.email,
            picture: userData.userData.picture,
            ...userData.userData,
          } as User;
        }
        return null
      })
    );
  }

  // Retrieve access token
  getAccessToken(): Observable<string> {
    return this.oidcSecurityService.getAccessToken();
  }
}
