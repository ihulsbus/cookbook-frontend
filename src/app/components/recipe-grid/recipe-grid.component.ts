import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {Recipe, RecipeMetadata, ImageService, ImageData} from '../../lib/api-client';
import {Router, RouterLink} from '@angular/router';
import { environment } from 'src/environments/environment';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { RecipeCreateComponent } from '../recipe-create/recipe-create.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { ButtonModule } from 'primeng/button';

export type FullRecipe = Recipe & RecipeMetadata;

@Component({
    selector: 'app-recipe-grid',
    standalone: true,
    templateUrl: './recipe-grid.component.html',
    styleUrls: ['./recipe-grid.component.scss'],
  imports: [
    CardModule,
    ChipModule,
    CommonModule,
    RecipeCreateComponent,
    ButtonModule,
    TagModule,
    PaginatorModule,
    FormsModule,
    RouterLink,
  ]
})
export class RecipesGridComponent implements OnChanges {

  @Input() recipes: FullRecipe[] = []
  api = environment.backend
  cdn = environment.cdn
  loading = false;
  imageMap: Record<string, ImageData> = {};

  layout: "list" | "grid" = "list";
  options: string[] = ["list", "grid"];

  constructor(
    public router: Router,
    private readonly imageService: ImageService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['recipes']) {
      this.loadImages()
    }
  }

  loadImages(): void {
    this.imageMap = {}
    const imageObservables = this.recipes.map(recipe =>
      this.imageService.searchImage('recipe', recipe.id).pipe(
        map(image => ({ recipeId: recipe.id, image }))
      )
    );

    forkJoin(imageObservables).subscribe(imageResults => {
      this.imageMap = imageResults.reduce((acc, { recipeId, image }) => {
        acc[recipeId] = image;
        return acc;
      }, {} as Record<string, ImageData>);

      this.loading = false;
    });
  }
}
