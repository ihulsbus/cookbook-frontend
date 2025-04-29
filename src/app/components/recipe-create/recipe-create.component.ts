import { Component, OnInit } from '@angular/core';
import { RecipeService, Recipe, InstructionService, Instruction } from '../../lib/api-client/';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import {ButtonDirective, ButtonIcon, ButtonLabel} from "primeng/button";
import {InputTextarea} from "primeng/inputtextarea";
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
    InputTextarea,
    Textarea,
  ]
})
export class RecipeCreateComponent implements OnInit {

  visible: boolean = false;
  submitted: boolean = false;
  recipe = {} as Recipe;
  instruction = {} as Instruction;
  validationErrors: {} = {};


  constructor(private recipeService: RecipeService, private instructionService: InstructionService, private router: Router, private messageService: MessageService) {

  }

  ngOnInit(): void {
    // This is intentionally empty
  }

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
