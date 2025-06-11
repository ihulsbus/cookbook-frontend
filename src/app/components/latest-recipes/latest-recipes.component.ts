import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CarouselModule } from 'primeng/carousel';
import { RouterLink } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { ImageService, Recipe, ImageData } from 'src/app/lib/api-client';
import {map} from "rxjs/operators";
import {forkJoin} from "rxjs";

@Component({
    selector: 'app-latest-recipes',
    standalone: true,
    templateUrl: './latest-recipes.component.html',
    styleUrls: ['./latest-recipes.component.scss'],
    imports: [
      CarouselModule,
      RouterLink,
      JsonPipe,
    ]
})
export class LatestRecipesComponent implements OnChanges {

  @Input() recipes: Recipe[] = []

  responsiveOptions: any[] = [
    {
      breakpoint: '992px',
      numVisible: 4,
      numScroll: 4
    },
    {
      breakpoint: '768px',
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: '576px',
      numVisible: 2,
      numScroll: 2
    }
  ];
  cdn = environment.cdn
  loading = false;
  imageMap: Record<string, ImageData> = {};

  constructor(public imageService: ImageService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['recipes']) {
      console.log(this.recipes)
      this.recipes.sort(this.sortByDateDesc)
      this.recipes.splice(6)
      this.loadImages()
    }
  }

  sortByDateDesc(a: any, b: any) {
    return new Date(b.CreatedAt).valueOf() - new Date(a.CreatedAt).valueOf();
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
