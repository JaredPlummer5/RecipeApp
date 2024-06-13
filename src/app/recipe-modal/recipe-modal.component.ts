import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recipe-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal fade show" [class.show]="show" [style.display]="show ? 'block' : 'none'">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ recipe?.title }}</h5>
            <button type="button" class="btn-close" (click)="close()" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <img [src]="recipe?.image" alt="{{ recipe?.title }}" class="img-fluid mb-3">
            <p [innerHTML]="sanitizeHtml(recipe?.summary)"></p>
            <h6>Ingredients</h6>
            <ul>
              <li *ngFor="let ingredient of recipe?.extendedIngredients">
                {{ ingredient.original }}
              </li>
            </ul>
            <h6>Instructions</h6>
            <p [innerHTML]="sanitizeHtml(recipe?.instructions)"></p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="close()">Close</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal
      background: rgba(0, 0, 0, 0.5)

    .modal-dialog
      max-width: 800px

  `]
})
export class RecipeModal {
  @Input() recipe: any;
  @Input() show: boolean = false;
  @Output() closeEvent = new EventEmitter<void>();

  constructor(private sanitizer: DomSanitizer) {}

  sanitizeHtml(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  close() {
    this.show = false;
    this.closeEvent.emit();
  }
}
