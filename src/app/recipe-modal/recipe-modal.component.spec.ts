import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeModal } from './recipe-modal.component';

describe('RecipeModalComponent', () => {
  let component: RecipeModal;
  let fixture: ComponentFixture<RecipeModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
