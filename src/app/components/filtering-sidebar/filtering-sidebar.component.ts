import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Recipe, Category, Tag, TagService, CategoryService } from '../../lib/api-client';
// import { RestService } from '../../lib/api-client/rest.service';
import { FilterService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { SidebarModule } from 'primeng/sidebar';
import { FormsModule } from '@angular/forms';
import {InputText} from "primeng/inputtext";
import {ButtonDirective, ButtonIcon, ButtonLabel} from "primeng/button";

@Component({
    selector: 'app-filtering-sidebar',
    standalone: true,
    templateUrl: './filtering-sidebar.component.html',
    styleUrls: ['./filtering-sidebar.component.scss'],
  imports: [
    DropdownModule,
    FormsModule,
    SidebarModule,
    InputText,
    ButtonDirective,
    ButtonIcon,
    ButtonLabel,
  ]
})
export class FilteringSidebarComponent implements OnInit {

  @Input() inputRecipes: Recipe[] = [];
  @Output() outputRecipes = new EventEmitter<Recipe[]>();

  constructor(private tagService: TagService, private categoryService: CategoryService, private filterService: FilterService) { };

  ngOnInit(): void {
    this.tagService.getAllTags().subscribe((data) => {
      this.tags = data;
    });

    this.categoryService.getAllCategory().subscribe((data) => {
      this.categories = data
    });
  }

  title: String = 'Filtering';

  filtersVisible: boolean = false;
  tags: Tag[] = [];
  categories: Category[] = [];
  searchText?: String;
  selectedCategory?: Category;
  selectedTag?: Tag;

  filteredRecipes: Recipe[] = [];

  invokeFilterLogic() {
    let intermediateResult: Recipe[] = [];
    intermediateResult.length = 0;

    this.filteredRecipes.splice(0);

    intermediateResult = this.textFiltered(this.inputRecipes);
    intermediateResult = this.categoryFiltered(intermediateResult);
    intermediateResult = this.tagsFiltered(intermediateResult);

    this.outputRecipes.emit(intermediateResult);
  }

  categoryFiltered(recipes: Recipe[]): Recipe[] {
    let result: Recipe[] = [];

    // if (this.selectedCategory === undefined || this.selectedCategory === null) {
    //   return recipes;
    // };

    // recipes.find((recipe) => {
    //   if (Categories.some((category) => {
    //     return category.CategoryName === this.selectedCategory?.CategoryName;
    //   })) {
    //     result.push(recipe);
    //   };
    // });

    return recipes;
  }

  tagsFiltered(recipes: Recipe[]): Recipe[] {
    let result: Recipe[] = [];

    // if (this.selectedTag === undefined || this.selectedTag === null) {
    //   return recipes;
    // };

    // recipes.find((recipe) => {
    //   if (recipe.Tags?.some((tag) => {
    //     return tag.TagName === this.selectedTag?.TagName;
    //   })) {
    //     result.push(recipe);
    //   };
    // });

    return recipes;
  }

  textFiltered(recipes: Recipe[]): Recipe[] {
    let result: Recipe[] = [];

    // recipes.find((recipe) => {
    //   if (this.filterService.filters.contains(recipe.RecipeName, this.searchText) || this.filterService.filters.contains(recipe.Description, this.searchText)) {
    //     result.push(recipe)
    //   };

    // });

    return recipes;
  }
}
