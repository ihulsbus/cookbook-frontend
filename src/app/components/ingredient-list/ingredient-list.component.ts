import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AmountService, IngredientService, UnitService, IngredientAmounts, Ingredient, Unit} from 'src/app/lib/api-client';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SkeletonModule } from 'primeng/skeleton';

interface HydratedIngredientAmount {
  ingredient: Ingredient;
  quantity: number;
  unit: Unit;
}

@Component({
    selector: 'app-ingredient-list',
    standalone: true,
    templateUrl: './ingredient-list.component.html',
    styleUrls: ['./ingredient-list.component.scss'],
    imports: [
        CommonModule,
        SkeletonModule,
    ]
})

export class IngredientListComponent implements OnChanges {
  amounts: IngredientAmounts[] = [];
  hydratedIngredientAmounts: HydratedIngredientAmount[] = [];
  names = new Map<string, string>();
  loading = true;

  @Input() recipeID = "";


  constructor(
    private amountService: AmountService,
    private ingredientService: IngredientService,
    private unitService: UnitService,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['recipeID'] && this.recipeID != null) {
        this.getAmounts(this.recipeID);
    }
  }

  getAmounts(recipeID: string) {
    this.amountService.getRecipeAmounts(recipeID).subscribe((data) => {
      this.amounts = data
      this.hydrateIngredientAmounts(this.amounts)
      this.loading = false
    })
  }

  hydrateIngredientAmounts(amounts: IngredientAmounts[]) {
    this.unitService.getAllUnits().pipe(
      switchMap((units: Unit[]) => {
        const uniqueIngredientIDs = [...new Set(amounts.map(a => a.ingredientID))];

        const ingredientObservables = uniqueIngredientIDs.map(id =>
          this.ingredientService.getIngredient(id)
        );

        return forkJoin(ingredientObservables).pipe(
          map((ingredients: Ingredient[]) => {
            const ingredientMap = new Map(ingredients.map(i => [i.id, i]));
            const unitMap = new Map(units.map(u => [u.id, u]));

            const hydrated: HydratedIngredientAmount[] = amounts.map(a => ({
              ingredient: ingredientMap.get(a.ingredientID)!,
              quantity: a.quantity,
              unit: unitMap.get(a.unitID)!
            }));

            return hydrated;
          })
        );
      })
    ).subscribe((hydratedAmounts: HydratedIngredientAmount[]) => {
      this.hydratedIngredientAmounts = hydratedAmounts;
    });
  }

}
