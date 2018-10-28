import { Recipe } from './../recipes/recipe.model';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { Http, Response } from '@angular/http';
import { map, catchError } from 'rxjs/operators';

import { RecipeService } from './../recipes/recipe.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  private DB_RECIPES_URL = 'https://ng-recipe-book-2914a.firebaseio.com/Recipes.json';

  constructor(private http: Http, private recipeService: RecipeService) { }

  storeRecipes() {
    return this.http.put(this.DB_RECIPES_URL, this.recipeService.getRecipes())
      .pipe(map(
        (response: Response) => {
          return response;
        }
      )).pipe(catchError(error => {
        return throwError('Something went wrong :(');
      }));
  }

  getRecipes() {
    this.http.get(this.DB_RECIPES_URL).pipe(
      map((response: Response) => {
        const recipes: Recipe[] = response.json();
        for (const recipe of recipes) {
          if (!recipe['ingredients']) {
            console.log(recipe);
            recipe['ingredients'] = [];
          }
        }
        return recipes;
      })
    ).subscribe(
      (recipes: Recipe[]) => {
        this.recipeService.setRecipes(recipes);
      }
    );
  }
}
