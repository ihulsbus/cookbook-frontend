import {Component, inject} from '@angular/core';
import { RecipeService, Recipe} from '../../lib/api-client/';
import {ActivatedRoute, Router} from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import {Button} from "primeng/button";
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
    Textarea,
    Button,
  ]
})
export class RecipeCreateComponent {
  private readonly route = inject(ActivatedRoute);

  visible = false;
  recipe = {} as Recipe;

  constructor(
    private readonly recipeService: RecipeService,
    private readonly router: Router,
    private readonly messageService: MessageService) {}

  openDialog() {
    this.visible = true
  }
  closeDialog() {
    this.visible = false
  }
  createRecipe() {
    this.recipeService.createRecipe(this.recipe).subscribe({
      next: (v) => this.onUploadSuccess(v.id),
      error: (e) => this.onUploadError(e)
    })
  }

  onUploadSuccess(id: string) {
    this.messageService.add({
      severity: 'success', summary: 'Success', detail: 'Recipe created', life: 3000,
    });
    this.router.navigate([id, 'edit'], {relativeTo: this.route})
  }

  onUploadError(e: any) {
    this.messageService.add({
      severity: 'error', summary: 'Error', detail: 'Recipe creation failed:' + e, life: 3000,
    });
  }

}
