import { Recipe } from './../recipes/recipe.model';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { Http, Response } from '@angular/http';
import { map, catchError } from 'rxjs/operators';

import { AuthService } from './../auth/auth.service';
import { RecipeService } from './../recipes/recipe.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  private DB_RECIPES_URL = 'https://ng-recipe-book-2914a.firebaseio.com/Recipes.json?auth=';

  constructor(private http: Http, private recipeService: RecipeService,
              private authService: AuthService) { }

  storeRecipes() {
    const token = this.authService.getToken();
    return this.http.put(this.DB_RECIPES_URL + token, this.recipeService.getRecipes())
      .pipe(map(
        (response: Response) => {
          return response;
        }
      )).pipe(catchError(error => {
        return throwError('Something went wrong :(');
      }));
  }

  getRecipes() {
    const token = this.authService.getToken();
    this.http.get(this.DB_RECIPES_URL + token).pipe(
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
