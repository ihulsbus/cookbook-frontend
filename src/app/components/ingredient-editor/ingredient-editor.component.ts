import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Ingredient, IngredientService, IngredientAmounts, Unit, UnitService } from '../../lib/api-client';
import { UntypedFormBuilder } from "@angular/forms";
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateIngredientComponent } from '../create-ingredient/create-ingredient.component';

// class IngredientAmount {
//   RecipeID: string = "";
//   IngredientID: string = "";
//   Quantity: number = 0;
//   UnitID = "";
//   Unit?: Unit;
// }

@Component({
    selector: 'app-ingredient-editor',
    standalone: true,
    templateUrl: './ingredient-editor.component.html',
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        DialogModule,
        DropdownModule,
        InputNumberModule,
        CreateIngredientComponent,
    ]
})
export class IngredientEditorComponent implements OnInit {

  @Input() ingredientAmounts: IngredientAmounts[] = []
  @Output() updateIngredientAmounts = new EventEmitter<IngredientAmounts[]>();

  // dialog states
  ingredientDialog = false;
  deleteIngredientDialog = false;
  deleteIngredientsDialog = false;
  submitted = false;

  newIngredient: IngredientAmounts = {};
  ingredients: Ingredient[] = [];
  selectedIngredients: IngredientAmounts[] = [];
  units: Unit[] = [];
  ingredientNames = new Map<string, string>();
  unitNames = new Map<string, string>();

  constructor(public fb: UntypedFormBuilder, private ingredientService: IngredientService, private unitService: UnitService) {}

  ngOnInit(): void {
    this.getIngredients()
    this.getUnits()
  }

  getIngredients() {
    this.ingredientService.getAllIngredient().subscribe((data) => { this.ingredients = data; this.getIngredientNames(data); })
  }

  getUnits() {
    this.unitService.getAlUnits().subscribe((data) => {
      for (const unit of data) {
        this.unitNames.set(unit.id!, unit.full_name!);
      };
      this.units = data;
    });
  }

  getIngredientNames(ingredients: Ingredient[]) {
    for (const ingredient of ingredients) {
      this.ingredientNames.set(ingredient.id!, ingredient.name!);
    };

  }

  getIngredientName(data: IngredientAmounts) {
    return this.ingredients.find(x => x.id === data.ingredientID)?.name
  }

  clearNewIngredient() {
    this.newIngredient = {};
  }

  openNew() {
    this.clearNewIngredient()
    this.submitted = false;
    this.ingredientDialog = true;
  }

  hideDialog() {
    this.clearNewIngredient()
    this.ingredientDialog = false;
    this.submitted = false;
  }

  confirmDeleteIngredient(ingredientAmount: IngredientAmounts) {
    this.newIngredient = ingredientAmount;
    this.deleteIngredientDialog = true;
  }

  confirmDeleteSelected() {
    this.deleteIngredientsDialog = true;
  }

  editIngredient(ingredient: IngredientAmounts) {
    this.newIngredient = { ...ingredient };
    this.ingredientDialog = true;
  }

  saveIngredient() {
    const i = this.ingredientAmounts.findIndex(
      (x: IngredientAmounts) => x.ingredientID === this.newIngredient.ingredientID,
      );
    if (i > -1) this.ingredientAmounts[i] = this.newIngredient;
    else this.ingredientAmounts.push(this.newIngredient);

    this.submitted = true;
    this.ingredientDialog = false;
    this.clearNewIngredient()
  }

  deleteIngredient() {
    this.updateIngredientAmounts.emit(this.ingredientAmounts.filter((object: IngredientAmounts) => object['ingredientID'] !== this.newIngredient.ingredientID));
    this.deleteIngredientDialog = false;
    this.clearNewIngredient()
  }

  deleteSelectedIngredients() {
    const newArray = this.ingredientAmounts.filter((object: IngredientAmounts) => !this.selectedIngredients.includes(object));
    this.updateIngredientAmounts.emit(newArray);
    this.deleteIngredientsDialog = false;
    this.selectedIngredients = [];
  }
}
