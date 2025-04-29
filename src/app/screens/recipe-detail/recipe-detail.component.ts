import { Component, OnInit } from '@angular/core';
import {
  IngredientAmounts,
  Recipe,
  Instruction,
  RecipeService,
  Ingredient,
  InstructionService,
  ImageService,
  AmountService
} from '../../lib/api-client';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { IngredientListComponent } from 'src/app/components/ingredient-list/ingredient-list.component';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {ButtonDirective, ButtonIcon} from "primeng/button";

@Component({
    selector: 'app-recipe-detail',
    standalone: true,
    templateUrl: './recipe-detail.component.html',
    styleUrls: ['./recipe-detail.component.scss'],
  imports: [
    CommonModule,
    RouterLink,
    IngredientListComponent,
    TagModule,
    ChipModule,
    ButtonDirective,
    ButtonIcon,
  ]
})
export class RecipeDetailComponent implements OnInit {
  recipe = {} as Recipe;
  imgUrl = "";
  amounts: IngredientAmounts[] = [];
  instructions = {} as Instruction;
  names = new Map<number, string>();
  ingredients: Ingredient[] = []

  constructor(
    private recipeService: RecipeService,
    private amountService: AmountService,
    private instructionService: InstructionService,
    private imageService: ImageService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.recipeService.getRecipe(params['id']).subscribe((data) => {
        this.recipe = data
      })
      // .then((data) => { this.recipe = data; this.getImgURL(); this.getIngredientNames(this.recipe.Ingredients);});
      this.instructionService.getInstruction(params['id']).subscribe((data) => {
        this.instructions = data
      })
      // then((data) => { this.instructions = data});
      // this.restService.GetAmounts(params['id']).then((data) => { this.amounts = data});
      this.amountService.getRecipeAmounts(params['id']).subscribe((data) => {
        this.amounts = data
      })
    })
  }

  // getIngredientNames(ingredients: Array<Ingredient>) {
  //   for (var ingredient of ingredients) {
  //     this.names.set(ingredient.ID, ingredient.IngredientName);
  //   };

  // }

  getImgURL() {
    this.imageService.searchImage("Recipe", this.recipe.id).subscribe((data) => this.imgUrl = `${environment.cdn}/img/${data.id}.jpg?d=${(new Date()).getTime()}`)
  }
}
