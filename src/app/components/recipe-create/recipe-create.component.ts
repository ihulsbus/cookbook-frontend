import { Component } from '@angular/core';
import { RecipeService, Recipe, InstructionService, Instruction, MetadataService, RecipeMetadata } from '../../lib/api-client/';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import {Button, ButtonDirective, ButtonIcon, ButtonLabel} from "primeng/button";
import {Textarea} from "primeng/textarea";

@Component({
    selector: 'app-recipe-create',
    standalone: true,
    templateUrl: './recipe-create.component.html',
  imports: [
    CommonModule,
    DialogModule,
    FormsModule,
    InputNumberModule,
    ButtonDirective,
    ButtonLabel,
    ButtonIcon,
    Textarea,
    Button,
  ]
})
export class RecipeCreateComponent {

  visible: boolean = false;
  submitted: boolean = false;
  recipe = {} as Recipe;
  metadata = {} as RecipeMetadata;
  instruction = {} as Instruction;
  validationErrors: {} = {};


  constructor(
    private recipeService: RecipeService,
    private instructionService: InstructionService,
    private metadataService: MetadataService,
    private router: Router,
    private messageService: MessageService) {}

  openDialog() {
    this.visible = true
  }
  closeDialog() {
    this.visible = false
  }
  createRecipe() {
    let id: number = 0
    this.recipeService.createRecipe(this.recipe).subscribe(
      (data: Recipe) => {
        this.instruction.id = data.id;
        this.instructionService.createInstruction(data.id!, this.instruction);
        this.onUploadSuccess(data.id!);
      }, this.onUploadError)
  }

  onUploadSuccess(id: string) {

    this.messageService.add({
      severity: 'success', summary: 'Success', detail: 'Recipe created', life: 3000,
    });
    this.router.navigate(['app', 'recipes', id, 'edit'])
  }

  onUploadError() {
    this.messageService.add({
      severity: 'error', summary: 'Error', detail: 'Recipe creation failed', life: 3000,
    });
  }

}
