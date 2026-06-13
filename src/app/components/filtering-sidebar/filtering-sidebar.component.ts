import {Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter} from '@angular/core';
import {Recipe, Category, Tag, TagService, CategoryService, RecipeMetadata} from '../../lib/api-client';
import { fetchAllPages } from '../../lib/pagination';
import { FilterService } from 'primeng/api';
import { MultiSelectModule  } from 'primeng/multiselect';
import { SidebarModule } from 'primeng/sidebar';
import { FormsModule } from '@angular/forms';
import {InputText} from "primeng/inputtext";
import {Button, ButtonDirective, ButtonIcon, ButtonLabel} from "primeng/button"

export type FullRecipe = Recipe & RecipeMetadata;

@Component({
    selector: 'app-filtering-sidebar',
    standalone: true,
    templateUrl: './filtering-sidebar.component.html',
    styleUrls: ['./filtering-sidebar.component.scss'],
  imports: [
    MultiSelectModule,
    FormsModule,
    SidebarModule,
    InputText,
    ButtonDirective,
    ButtonIcon,
    ButtonLabel,
    Button,
  ]
})

export class FilteringSidebarComponent implements OnInit, OnChanges {

  @Input() inputRecipes: FullRecipe[] = [];
  @Output() outputRecipes = new EventEmitter<FullRecipe[]>();

  constructor(
    private tagService: TagService,
    private categoryService: CategoryService,
    private filterService: FilterService
  ) {};

  ngOnInit(): void {
    fetchAllPages<Tag>((page, limit) => this.tagService.getAllTags(page, limit)).subscribe((tags) => {
      this.tags = tags.sort((a, b) => a.name.localeCompare(b.name));
    });

    fetchAllPages<Category>((page, limit) => this.categoryService.getAllCategory(page, limit)).subscribe((categories) => {
      this.categories = categories.sort((a, b) => a.name.localeCompare(b.name));
    });
    this.outputRecipes.emit(this.inputRecipes);

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['inputRecipes']) {
      this.filterRecipes()
    }
  }

  filtersVisible = false;
  tags: Tag[] = [];
  categories: Category[] = [];
  searchText = "";
  selectedCategories: Category[] = [];
  selectedTags: Tag[] = [];
  filteredRecipes: FullRecipe[] = [];

  filterRecipes() {
    this.filteredRecipes = this.inputRecipes.filter(recipe => {
      const matchesTitle = this.filterService.filters['contains'](recipe.name, this.searchText, {});

      const matchesCategories = this.selectedCategories.length > 0
        ? this.selectedCategories.some(selCat =>
          (recipe.categories ?? []).some(cat =>
            this.filterService.filters['equals'](cat.id, selCat.id, {})
          )
        )
        : true;

      const matchesTags = this.selectedTags.length > 0
        ? this.selectedTags.some(selTag =>
          (recipe.tags ?? []).some(tag =>
            this.filterService.filters['equals'](tag.id, selTag.id, {})
          )
        )
        : true;

      return matchesTitle && matchesCategories && matchesTags;
    });
    this.outputRecipes.emit(this.filteredRecipes);
  }
}
