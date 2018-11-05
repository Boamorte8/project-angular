import { Recipe } from './../recipes/recipe.model';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';

import { RecipeService } from './../recipes/recipe.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  private DB_RECIPES_URL = 'https://ng-recipe-book-2914a.firebaseio.com/Recipes.json';

  constructor(private http: HttpClient, private recipeService: RecipeService) { }

  storeRecipes() {
    // const token = this.authService.getToken();
    // const headers = new HttpHeaders().set('Authorization', 'Bearer adsfaidofaf');
    // return this.http.put(this.DB_RECIPES_URL, this.recipeService.getRecipes(), {
    //   observe: 'events',
    //   params: new HttpParams().set('auth', token)
    //   // headers: headers
    // });
    // const req = new HttpRequest('PUT', this.DB_RECIPES_URL,
    //                             this.recipeService.getRecipes(), {
    //                               reportProgress: true,
    //                               params: new HttpParams().set('auth', token)
                                // });
    const req = new HttpRequest('PUT', this.DB_RECIPES_URL,
                                this.recipeService.getRecipes(), {
                                  reportProgress: true
                                });
    return this.http.request(req);
  }

  getRecipes() {
    this.http.get<Recipe[]>(this.DB_RECIPES_URL, {
      // params: new HttpParams().set('auth', token)
    }).pipe(
      map((recipes) => {
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
