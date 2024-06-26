import { Routes } from '@angular/router';
import { RecipeSearchComponent } from './recipe-search/recipe-search.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

export const routes: Routes = [
  // { path: '', component: AppComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: LandingPageComponent },
  { path: 'search', component: RecipeSearchComponent },
  { path: 'recipe', component: RecipeListComponent },
  { path: '**', redirectTo: '/home' }  // Optional: Redirects any unknown paths to home
];

