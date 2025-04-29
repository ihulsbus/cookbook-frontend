import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../lib/auth/auth.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { RouterLink } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { CommonModule } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { TabsModule } from 'primeng/tabs';
import { Router, NavigationEnd } from '@angular/router';
import {ButtonDirective, ButtonIcon, ButtonLabel} from "primeng/button";

@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
  imports: [
    CommonModule,
    RouterLink,
    MenuModule,
    TabsModule,
    AvatarModule,
    TieredMenuModule,
    ButtonDirective,
    ButtonIcon,
    ButtonLabel,
  ]
})

export class HeaderComponent implements OnInit {
  user$!: Observable<User | null>;

  admin: boolean = true
  logo: string = `${environment.cdn}/logo/logo_blk.svg`

  mobileMenuOptions: MenuItem[] = [
    { label: 'Recipes', routerLink: ['/app/recipes'] },
    { label: 'Ingredients', routerLink: ['/app/ingredients'] },
    { label: 'Shopping Lists', routerLink: ['/app/shopping'], visible: this.admin },
    { label: 'Mealplanner', routerLink: ['/app/planner'], visible: this.admin },
    { separator: true },
    { label: 'Profile', routerLink: ['/app/profile'] },
    { label: 'Logout', command: (onclick) => { this.oidcSecurityService.logoff(); } },
  ];
  bigMenuOptions: MenuItem[] = [
    { label: 'Home', routerLink: ['/app/home'] },
    { label: 'Recipes', routerLink: ['/app/recipes'] },
    { label: 'Ingredients', routerLink: ['/app/ingredients'] },
    { label: 'Shopping Lists', routerLink: ['/app/shopping'], visible: this.admin },
    { label: 'Mealplanner', routerLink: ['/app/planner'], visible: this.admin },
  ];
  userMenuItems: MenuItem[] = [
    { label: 'Profile', routerLink: ['/app/profile'] },
    { separator: true },
    { label: 'Logout', command: (onclick) => { this.oidcSecurityService.logoff(); } },
  ];

  activeTabIndex = 0;

  constructor(protected authService: AuthService, private oidcSecurityService: OidcSecurityService, private router: Router) {
  }

  ngOnInit(): void {
    this.setActiveTabFromUrl(this.router.url);

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setActiveTabFromUrl(event.urlAfterRedirects);
      }
    });

    this.user$ = this.authService.getUserData();
  }

  setActiveTabFromUrl(url: string): void {
    const matchingIndex = this.bigMenuOptions.findIndex(tab => url.startsWith(tab.routerLink));
    // If no matching tab is found, you can default to the first tab (index 0)
    this.activeTabIndex = matchingIndex !== -1 ? matchingIndex : 0;
  }

  onTabChange(index: number): void {
    this.activeTabIndex = index;
    this.router.navigate([this.bigMenuOptions[index].routerLink]);
  }

}
