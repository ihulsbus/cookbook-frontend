import { Component, OnInit } from '@angular/core';
import { Ingredient, IngredientAmount, Instruction, Recipe, RestService } from '../../lib/rest/rest.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe = new Recipe();
  imgUrl: string = "";
  amounts: Array<IngredientAmount> = [];
  instructions: Instruction = new Instruction();
  names = new Map<number, string>();

  constructor(private restService: RestService, private activatedRoute: ActivatedRoute) {
    activatedRoute.params.subscribe(params => {
      this.restService.GetSingleRecipe(params['id']).then((data) => { this.recipe = data; this.getImgURL(); this.getIngredientNames(this.recipe.Ingredients);});
      this.restService.GetInstructions(params['id']).then((data) => { this.instructions = data});
      this.restService.GetAmounts(params['id']).then((data) => { this.amounts = data});
    })
  }

  ngOnInit(): void {
    // This is intentionally empty
  }

  getIngredientNames(ingredients: Array<Ingredient>) {
    for (var ingredient of ingredients) {
      this.names.set(ingredient.ID, ingredient.IngredientName);
    };
    
  }

  getImgURL() {
    this.activatedRoute.params.subscribe(params => {
      this.imgUrl = `${environment.cdn}/img/${this.recipe.ImageName}.jpg?d=${(new Date()).getTime()}`;
    })
  }

}
