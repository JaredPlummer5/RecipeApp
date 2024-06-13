import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../eviorment';
@Injectable({
  providedIn: 'root'
})
export class SpoonacularService {
  private apiUrl = 'https://api.spoonacular.com/recipes';
  private apiKey = environment.apiKey1 || environment.apiKey2;

  private dataSubject = new BehaviorSubject<any[]>([]);
  public data$ = this.dataSubject.asObservable();

  private popularRecipesSubject = new BehaviorSubject<any[]>([]);
  public popularRecipes$ = this.popularRecipesSubject.asObservable();

  private suggestionsSubject = new BehaviorSubject<string[]>([]);
  public suggestions$ = this.suggestionsSubject.asObservable();

  private cache: { [query: string]: any } = {};

  constructor(private http: HttpClient) {}

  searchRecipes(query: string): Observable<any[]> {
    if (this.cache[query]) {
      this.dataSubject.next(this.cache[query]);
      return of(this.cache[query]);
    } else {
      const headers = new HttpHeaders().set('x-api-key', this.apiKey);
      const params = new HttpParams().set('query', query);

      return this.http.get<any>(`${this.apiUrl}/complexSearch`, { headers, params }).pipe(
        map(data => {
          console.log('Received data:', data);
          this.cache[query] = data.results;
          this.dataSubject.next(data.results);
          return data.results;
        }),
        catchError(error => {
          return of([]);
        })
      );
    }
  }

  getPopularRecipes(): void {
    if (this.cache['popular']) {

      this.popularRecipesSubject.next(this.cache['popular']);
    } else {
      const headers = new HttpHeaders().set('x-api-key', this.apiKey);

      this.http.get<any>(`${this.apiUrl}/random`, { headers }).subscribe(
        (data) => {
          this.cache['popular'] = data.recipes;
          this.popularRecipesSubject.next(data.recipes);
        },
        (error) => console.error('Error fetching popular recipes:', error)
      );
    }
  }

  getSuggestions(query: string): void {
    if (this.cache[`suggestions-${query}`]) {
      this.suggestionsSubject.next(this.cache[`suggestions-${query}`]);
    } else {
      const headers = new HttpHeaders().set('x-api-key', this.apiKey);
      const params = new HttpParams().set('query', query);

      this.http.get<any>(`${this.apiUrl}/autocomplete`, { headers, params }).subscribe(
        (data) => {
          const suggestions = data.map((item: any) => item.title);
          this.cache[`suggestions-${query}`] = suggestions;
          this.suggestionsSubject.next(suggestions);
        },
        (error) => console.error('Error fetching suggestions:', error)
      );
    }
  }

  getRecipeDetails(id: number): Observable<any> {
    if (this.cache[`details-${id}`]) {
      return of(this.cache[`details-${id}`]);
    } else {
      const headers = new HttpHeaders().set('x-api-key', this.apiKey);
      return this.http.get<any>(`${this.apiUrl}/${id}/information`, { headers }).pipe(
        map(data => {
          this.cache[`details-${id}`] = data;
          return data;
        }),
        catchError(error => {
          return of(null);
        })
      );
    }
  }
}
