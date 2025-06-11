import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import {
  RecipeService,
  Recipe,
  MetadataService,
  RecipeMetadata,
} from '../../lib/api-client';
import { RecipesGridComponent } from 'src/app/components/recipe-grid/recipe-grid.component';
import { FilteringSidebarComponent } from 'src/app/components/filtering-sidebar/filtering-sidebar.component';
import { forkJoin } from 'rxjs';

export interface FullRecipe extends Recipe, RecipeMetadata {}

@Component({
    selector: 'app-recipe-browser',
    standalone: true,
    templateUrl: './recipe-browser.component.html',
    styleUrls: ['./recipe-browser.component.scss'],
  imports: [
    RecipesGridComponent,
    FilteringSidebarComponent,
  ]
})
export class RecipeBrowserComponent implements OnInit {

  filteredRecipes: FullRecipe[] = [];
  fullRecipes: FullRecipe[] = [];

  api: string = environment.backend
  cdn: string = environment.cdn

  constructor(public router: Router, private recipeService: RecipeService, private metadataService: MetadataService) { }

  ngOnInit(): void {
    forkJoin({
      recipes: this.recipeService.getAllRecipes(),
      metadata: this.metadataService.getAllRecipeMetadata()
    }).subscribe(({recipes,metadata}) => {
      const metadataMap = new Map(metadata.map(m => [m.recipe_id, m]));

      this.fullRecipes = recipes.filter(r => metadataMap.has(r.id))
      .map(r => ({
        ...r,
        ...metadataMap.get(r.id)!
      }));
    });
  }


  passRecipes(r: FullRecipe[]) {
    this.filteredRecipes.length = 0
    this.filteredRecipes = [...r]
  }

}
