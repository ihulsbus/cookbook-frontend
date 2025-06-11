import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginButtonComponent } from 'src/app/components/login-button/login-button.component';
import { Card } from 'primeng/card';
import {Button} from "primeng/button";
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-splashscreen-content',
  standalone: true,
  templateUrl: './splashscreen-content.component.html',
  styleUrls: ['./splashscreen-content.component.scss'],
  imports: [
    LoginButtonComponent,
    Card,
    Button,
    TooltipModule,
  ]
})
export class SplashscreenContentComponent {

  cdn = environment.cdn

  registrationTooltip = "Registration is currently disabled."

}
