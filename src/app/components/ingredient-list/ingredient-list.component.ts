import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Ingredient, IngredientAmounts } from 'src/app/lib/api-client';
import { CommonModule } from '@angular/common';

// class IngredientAmount {
//   RecipeID: string = "";
//   IngredientID: string = "";
//   Quantity: number = 0;
//   UnitID: string = "";
//   Unit?: Unit;
// }


@Component({
    selector: 'app-ingredient-list',
    standalone: true,
    templateUrl: './ingredient-list.component.html',
    styleUrls: ['./ingredient-list.component.scss'],
    imports: [
        CommonModule,
    ]
})
export class IngredientListComponent implements OnInit, OnChanges {

  @Input() ingredients: Ingredient[] = []
  @Input() amounts: IngredientAmounts[] = []

  names = new Map<string, string>();

  constructor() {}

  ngOnInit(): void {
    this.getIngredientNames(this.ingredients);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ingredients']) {
      this.getIngredientNames(this.ingredients);
    }
  }

  getIngredientNames(ingredients: Ingredient[]) {
    for (const ingredient of ingredients) {
      this.names.set(ingredient.id!, ingredient.name!);
    };

  }

}
