import { Component, OnInit } from '@angular/core';
import {
  IngredientAmounts,
  Recipe,
  Instruction,
  RecipeService,
  Ingredient,
  InstructionService,
  ImageService,
  AmountService,
  MetadataService,
  RecipeMetadata
} from '../../lib/api-client';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { IngredientListComponent } from 'src/app/components/ingredient-list/ingredient-list.component';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {Button, ButtonModule} from "primeng/button";
import { ButtonGroupModule } from 'primeng/buttongroup';

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
    ButtonModule,
    Button,
    ButtonGroupModule,
  ]
})
export class RecipeDetailComponent implements OnInit {
  recipe = {} as Recipe;
  imgUrl = "";
  amounts: IngredientAmounts[] = [];
  instructions: Instruction[] = [];
  names = new Map<number, string>();
  ingredients: Ingredient[] = []
  metadata = {} as RecipeMetadata;

  constructor(
    private recipeService: RecipeService,
    private amountService: AmountService,
    private instructionService: InstructionService,
    private imageService: ImageService,
    private metadataService: MetadataService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.recipeService.getRecipe(params['id']).subscribe((data) => {
        this.recipe = data;
      });

      this.metadataService.getRecipeMetadata(params['id']).subscribe((data) => {
        this.metadata = data;
      })

      this.imageService.searchImage("recipe", params['id']).subscribe((data) => {
        this.imgUrl = `https://cbhbe.ams3.cdn.digitaloceanspaces.com/img/${data.id}.jpg`;
      });

      this.instructionService.getInstruction(params['id']).subscribe((data) => {
        this.instructions = data;
      })

      this.amountService.getRecipeAmounts(params['id']).subscribe((data) => {
        this.amounts = data;
      })
    })
  }


  getImgURL() {
    this.imageService.searchImage("Recipe", this.recipe.id).subscribe((data) => this.imgUrl = `${environment.cdn}/img/${data.id}.jpg?d=${(new Date()).getTime()}`)
  }
}
