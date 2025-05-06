import { Component, OnInit } from '@angular/core';
import { IngredientService, Ingredient } from '../../lib/api-client';
import { MessageService } from 'primeng/api';
import { CreateIngredientComponent } from 'src/app/components/create-ingredient/create-ingredient.component';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import {ButtonDirective, ButtonIcon, ButtonLabel} from "primeng/button";
import { CommonModule } from '@angular/common';
import {InputText} from "primeng/inputtext";

@Component({
    selector: 'app-ingredients',
    standalone: true,
    templateUrl: './ingredients.component.html',
  imports: [
    CreateIngredientComponent,
    TableModule,
    DialogModule,
    CommonModule,
    ButtonDirective,
    ButtonLabel,
    ButtonIcon,
    InputText,
  ]
})
export class IngredientsComponent implements OnInit {
  ingredient = {} as Ingredient;
  ingredients: Ingredient[] = [];
  loading = true;
  filters: object = {};
  deleteIngredientDialog = false;
  deleteIngredientsDialog = false;
  selectedIngredients: Ingredient[] = [];

  constructor(private ingredientService: IngredientService, public messageService: MessageService) { }

  ngOnInit(): void {
    this.getIngredients()
  }

  getEventValue($event: any): string {
    return $event.target.value;
  }

  getIngredients() {
    this.ingredientService.getAllIngredient().subscribe((data) => {
      this.ingredients = data;
      this.loading = false;
    });
  }

  clearFilter(table: any) {
    table.clear();
  }

  confirmDeleteIngredient(ingredient: Ingredient) {
    this.ingredient = ingredient;
    this.deleteIngredientDialog = true;
  }

  confirmDeleteSelected() {
    this.deleteIngredientsDialog = true;
  }
  deleteIngredient() {
    this.ingredientService.deleteIngredient(this.ingredient.id!).subscribe({
      next: () => {
        this.updateSuccess()
        this.deleteIngredientDialog = false;
        this.getIngredients()
      },
      error: () => {
        this.updateFailed()
      }
    });
  }

  deleteIngredients() {
    for (let ingredient of this.selectedIngredients) {
      this.ingredientService.deleteIngredient(ingredient.id!).subscribe({
        next: () => {
          this.updateSuccess()
          this.deleteIngredientDialog = false;
          this.getIngredients()
        },
        error: () => {
          this.updateFailed()
        }
      });
    }
    this.deleteIngredientsDialog = false;
    this.getIngredients()
  }
  updateSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Update successful' });
  }
  updateFailed() {
    this.messageService.add({ severity: 'error', summary: 'Update failed' });
  }

}
