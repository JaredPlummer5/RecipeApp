import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpoonacularService } from '../spoonacular.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.sass']
})
export class RecipeListComponent implements OnInit {
  recipes: any[] = [];

  constructor(public spoonacularService: SpoonacularService) {}

  ngOnInit(): void {
    this.spoonacularService.data$.subscribe(
      (data) => this.recipes = data,
      (error) => console.error('Error:', error)
    );
  }
}
