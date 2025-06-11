import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  Instruction,
  Recipe,
  Category,
  Tag,
  IngredientAmounts,
  RecipeService,
  AmountService,
  TagService,
  CategoryService,
  CuisinetypeService,
  MetadataService,
  ImageService,
  InstructionService, RecipeMetadata, CuisineType,
} from '../../lib/api-client';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { IngredientEditorComponent } from 'src/app/components/ingredient-editor/ingredient-editor.component';
import { CommonModule } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { RouterLink } from '@angular/router';
import { EditorModule} from "primeng/editor";
import {Button, ButtonDirective, ButtonIcon, ButtonLabel} from "primeng/button";
import {InputText} from "primeng/inputtext";
import {Textarea} from "primeng/textarea";

@Component({
    selector: 'app-recipe-edit',
    standalone: true,
    templateUrl: './recipe-edit.component.html',
    styleUrls: ['./recipe-edit.component.scss'],
  imports: [
    CommonModule,
    DialogModule,
    EditorModule,
    FormsModule,
    FileUploadModule,
    IngredientEditorComponent,
    InputNumberModule,
    RouterLink,
    SelectModule,
    MultiSelectModule,
    ButtonDirective,
    ButtonIcon,
    InputText,
    Textarea,
    ButtonLabel,
    Button,
  ]
})
export class RecipeEditComponent implements OnInit {

  recipe = {} as Recipe;
  cancelPopup = false;
  confirmPopup = false;
  fileUpload = false;
  api = environment.backend;
  imgUrl = "";
  amounts: IngredientAmounts[] = [];
  instructions = [] as Instruction[];
  names = new Map<number, string>();
  categories: Category[] = [];
  tags: Tag[] = [];
  cuisineTypes: CuisineType[] = [];
  metadata = {} as RecipeMetadata;


  constructor(
    private recipeService: RecipeService,
    private instructionService: InstructionService,
    private amountService: AmountService,
    private tagService: TagService,
    private categoryService: CategoryService,
    private metadataService: MetadataService,
    private cuisineTypeService: CuisinetypeService,
    private imageService: ImageService,
    private messageService: MessageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
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

      this.tagService.getAllTags().subscribe((data) => {
        this.tags = data;
      })

      this.categoryService.getAllCategory().subscribe((data) => {
        this.categories = data;
      })

      this.cuisineTypeService.getAllCuisinetype().subscribe((data) => {
        this.cuisineTypes = data;
      })
    })
  }

  getImgURL() {
    // this.imgUrl = `${environment.cdn}/img/${this.recipe.ImageName}.jpg?d=${(new Date()).getTime()}`;
  }

  // getIngredientNames(ingredients: Array<Ingredient>) {
  //   for (var ingredient of ingredients) {
  //     this.names.set(ingredient.ID, ingredient.IngredientName);
  //   };
  // }

  updateIngredientAmounts(ingredientAmounts: IngredientAmounts[]) {
    this.amounts = ingredientAmounts;
  }

  // updateCategories(categories: Category[]) {
  //
  // }

  // cancelRecipeUpdate() {
  //   this.cancelPopup = true;
  // }

  fileUploadToggle() {
    this.fileUpload = !this.fileUpload;
  }
  saveRecipeUpdate() {
    // if (this.amounts.length == 0 || this.instructions.description.length == 0) {
    //   this.confirmPopup = true;
    // } else {
    //   this.uploadRecipe();
    // }
  }

  uploadRecipe() {
    this.confirmPopup = false;
    this.amountService.putRecipeAmounts(this.recipe.id!, this.amounts);
    this.recipeService.updateRecipe(this.recipe.id!, this.recipe)
    this.instructionService
      .updateInstruction(this.recipe.id!, this.instructions)
      .subscribe({
        error: () => this.saveFailed(),
        complete: () => this.saveSuccess()
      });
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

  addInstruction(): void {
    // Determine the next sequence
    const nextSequence = this.instructions.length + 1;

    // Push a new instruction step with default values
    this.instructions.push({
      sequence: nextSequence,
      description: '',
    } as Instruction);
  }

  deleteInstruction(index: number): void {
    // Remove the step from the array
    this.instructions.splice(index, 1);

    // Recalculate sequences
    this.instructions.forEach((step, i) => {
      step.sequence = i + 1;
    });
  }

}
