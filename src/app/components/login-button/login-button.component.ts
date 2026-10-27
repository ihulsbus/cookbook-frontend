import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
    selector: 'app-login-button',
    standalone: true,
    templateUrl: './login-button.component.html',
    styleUrls: ['./login-button.component.css'],
    imports: [
        ButtonModule,
    ]
})
export class LoginButtonComponent {

  constructor(private oidcSecurityService: OidcSecurityService) { }
  loading = false;

  loginWithRedirect(): void {
    this.loading = true;
    this.oidcSecurityService.authorize()
  }

}
