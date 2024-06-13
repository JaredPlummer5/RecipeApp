import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpoonacularService } from '../spoonacular.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RecipeModal } from '../recipe-modal/recipe-modal.component';

@Component({
  selector: 'app-recipe-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RecipeModal],
  templateUrl: './recipe-search.component.html',
  styleUrls: ['./recipe-search.component.sass']
})
export class RecipeSearchComponent implements OnInit {
  query: string = '';
  recipes: any[] = [];
  popularRecipes: any[] = [];
  suggestions: string[] = [];
  loading: boolean = false;
  error: string | null = null;
  selectedRecipe: any = null;
  showDetails: boolean = false;

  private searchTerms = new Subject<string>();
  private suggestionTerms = new Subject<string>();

  constructor(private spoonacularService: SpoonacularService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.getPopularRecipes();

    this.spoonacularService.data$.subscribe(
      (data) => {
        this.recipes = data || [];
        this.loading = false; // Stop loading once data is received
      },
      (error) => {
        console.error('Error:', error);
        this.error = 'An error occurred while fetching recipes.';
        this.loading = false; // Stop loading in case of error
      }
    );

    this.spoonacularService.popularRecipes$.subscribe(
      (data) => this.popularRecipes = data || [],
      (error) => console.error('Error:', error)
    );

    this.spoonacularService.suggestions$.subscribe(
      (data) => this.suggestions = data || [],
      (error) => console.error('Error:', error)
    );

    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => {
        this.loading = true;
        this.error = null;
        return this.spoonacularService.searchRecipes(term);
      })
    ).subscribe(
      (data) => {
        this.recipes = data || [];
        this.loading = false;
      },
      (error) => {
        console.error('Error:', error);
        this.error = 'An error occurred while fetching recipes.';
        this.loading = false;
      }
    );

    this.suggestionTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => {
        this.spoonacularService.getSuggestions(term);
        return this.spoonacularService.suggestions$;
      })
    ).subscribe(
      (data) => this.suggestions = data || [],
      (error) => console.error('Error:', error)
    );
  }

  onInput(): void {
    if (this.query.length > 2) {
      this.suggestionTerms.next(this.query);
    } else {
      this.suggestions = [];
    }
  }

  useSuggestion(suggestion: string): void {
    this.query = suggestion;
    this.searchRecipes();
  }

  searchRecipes(): void {
    this.loading = true;
    this.error = null;
    this.searchTerms.next(this.query);
  }

  getPopularRecipes(): void {
    this.spoonacularService.getPopularRecipes();
  }

  showRecipeDetails(recipeId: number): void {
    this.spoonacularService.getRecipeDetails(recipeId).subscribe(
      (data) => {
        this.selectedRecipe = data;
        this.showDetails = true;
      },
      (error) => {
        console.error('Error fetching recipe details:', error);
        this.error = 'An error occurred while fetching recipe details.';
      }
    );
  }

  sanitizeHtml(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  closeModal(): void {
    this.showDetails = false;
    this.selectedRecipe = null; // Reset the selected recipe to ensure the modal is reinitialized correctly
  }
}
