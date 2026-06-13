import { Component, OnInit } from '@angular/core';
import { RecipeService, Recipe } from 'src/app/lib/api-client';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../lib/auth/auth.service';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { LatestRecipesComponent } from 'src/app/components/latest-recipes/latest-recipes.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    imports: [
        CommonModule,
        LatestRecipesComponent,
    ]
})
export class HomeComponent implements OnInit {
  allRecipes: Recipe[] = [];
  user$!: Observable<User | null>;

  constructor(private readonly restService: RecipeService, private readonly messageService: MessageService, private readonly authService: AuthService) {}

  welcomeText = ""

  ngOnInit(): void {
    this.user$ = this.authService.getUserData();
    this.restService.getAllRecipes(1, 6).subscribe((response) => {
      this.allRecipes = response.data ?? [];
    });
    // , () => {
    //   this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Unable to retrieve recipes' });
    // });
    this.welcome();
  }

  welcome() {
    const welcomeTypes = ['Good morning', 'Good afternoon', 'Good evening'];
    const hour = new Date().getHours();

    if (hour < 12) this.welcomeText = welcomeTypes[0];
    else if (hour < 18) this.welcomeText = welcomeTypes[1];
    else this.welcomeText = welcomeTypes[2];
  }

}
