import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../lib/auth/auth.service';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-profile',
    standalone: true,
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
    imports: [
        CardModule,
        CommonModule,
    ]
})
export class ProfileComponent implements OnInit {
  user$!: Observable<User | null>;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user$ = this.authService.getUserData();
  }

}
