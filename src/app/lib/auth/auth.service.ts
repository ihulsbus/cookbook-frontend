import { Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private oidcSecurityService: OidcSecurityService) {}

  // Retrieve user data (display name and group membership come from the
  // ID token's `name`/`groups` claims - see cookbook/authentik/README.md
  // for how the Authentik provider is configured to include them).
  getUserData(): Observable<User | null> {
    return this.oidcSecurityService.userData$.pipe(
      map((userData: any) => {
        if (userData && userData.userData) {
          return {
            sub: userData.userData.sub,
            name: userData.userData.name,
            email: userData.userData.email,
            picture: userData.userData.picture,
            groups: userData.userData.groups ?? [],
            ...userData.userData,
          } as User;
        }
        return null
      })
    );
  }

  // Convenience check for role-gated UI (e.g. hiding admin-only actions).
  hasGroup(group: string): Observable<boolean> {
    return this.getUserData().pipe(
      map((user) => !!user?.groups?.includes(group))
    );
  }

  // Retrieve access token
  getAccessToken(): Observable<string> {
    return this.oidcSecurityService.getAccessToken();
  }
}
