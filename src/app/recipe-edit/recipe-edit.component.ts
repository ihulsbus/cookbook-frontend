import { Component, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { RestService, IngredientAmount, Recipe } from '../lib/rest/rest.service';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss']
})
export class RecipeEditComponent implements OnInit, OnChanges {

  recipe: Recipe = new Recipe;
  cancelPopup: boolean = false;
  confirmPopup: boolean = false;
  fileUpload: boolean = false;
  api: string = environment.backend;
  imgUrl: string = "";

  constructor(private restService: RestService, private messageService: MessageService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.getImgURL()
    activatedRoute.params.subscribe(params => {
      this.restService.GetSingleRecipe(params['id']).then((data) => { this.recipe = data; });
    })
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  getImgURL() {
    this.activatedRoute.params.subscribe(params => {
      this.imgUrl = `${this.api}/images/${params['id']}/cover.jpg?d=${(new Date()).getTime()}`;
    })
  }

  updateIngredientAmounts(ingredientamounts: IngredientAmount[]) {
    this.recipe.ingredientamounts = ingredientamounts;
  }

  cancelRecipeUpdate() {
    this.cancelPopup = true;
  }

  fileUploadToggle() {
    this.fileUpload = !this.fileUpload;
  }
  saveRecipeUpdate() {
    if (this.recipe.ingredientamounts.length == 0 || this.recipe.method.length == 0) {
      this.confirmPopup = true;
    } else {
      this.uploadRecipe();
    }
  }
  
  uploadRecipe() {
    this.confirmPopup = false;
    this.restService.UpdateRecipe(this.recipe)
    .then(() => this.saveSuccess(), () => this.saveFailed());
  }

  onUploadSuccess() {
    this.getImgURL()
    this.fileUploadToggle()
    this.messageService.add({
      severity: 'success', summary: 'Success', detail: 'Cover image uploaded', life: 3000,
    });
  }

  onUploadError() {
    this.messageService.add({
      severity: 'error', summary: 'Error', detail: 'Cover image upload failed', life: 3000,
    });
  }

  saveSuccess() {
    this.messageService.add({
      severity: 'success', summary: 'Update successful', detail: 'Recipe updated', life: 3000,
    });
    this.router.navigate(['app','recipes', this.recipe.id]);
  }

  saveFailed() {
    this.messageService.add({
      severity: 'error', summary: 'Update failed', detail: 'Recipe update failed', life: 3000,
    });
  }

}
