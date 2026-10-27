import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Ingredient, IngredientService } from '../../lib/api-client';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputText } from "primeng/inputtext";
import { Button } from "primeng/button";

@Component({
    selector: 'app-create-ingredient',
    standalone: true,
    templateUrl: './create-ingredient.component.html',
  imports: [
    CommonModule,
    DialogModule,
    FormsModule,
    InputText,
    Button,
  ]
})
export class CreateIngredientComponent {

  @Output() createdIngredient = new EventEmitter<boolean>();

  visible = false;
  ingredient = {} as Ingredient;
  validationErrors = {};
  isFormValid = false;

  constructor(private readonly restService: IngredientService, public messageService: MessageService) { }

  openDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
    this.ingredient.name = ""
  }

  createIngredient() {
    this.visible = false;
    this.restService.createIngredient(this.ingredient).subscribe({
      next: (v) => this.createSuccess(v),
      error: (e) => this.createFailed(e),

    })
    this.ingredient.name = ""
  }

  createSuccess(data: Ingredient) {
    this.messageService.add({ severity: 'success', summary: 'Created Ingredient', detail: data.name });
    this.createdIngredient.emit(true);
  }

  createFailed(data: Ingredient) {
    this.messageService.add({ severity: 'error', summary: 'Create failed', detail: data.name });
  }
}
