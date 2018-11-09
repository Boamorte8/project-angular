import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Effect, Actions } from '@ngrx/effects';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as RecipeActions from './recipe.actions';
import { Recipe } from '../recipe.model';
import * as fromRecipe from '../store/recipe.reducers';

@Injectable()
export class RecipeEffects {
  private DB_RECIPES_URL = 'https://ng-recipe-book-2914a.firebaseio.com/Recipes.json';

  @Effect()
  recipeFetch = this.actions$.ofType(RecipeActions.FETCH_RECIPES)
              .pipe(
                switchMap((action: RecipeActions.FetchRecipes) => {
                  return this.http.get<Recipe[]>(this.DB_RECIPES_URL, {
                    // params: new HttpParams().set('auth', token)
                    observe: 'body',
                    responseType: 'json'
                  });
                }),
                map((recipes) => {
                  for (const recipe of recipes) {
                    if (!recipe['ingredients']) {
                      console.log(recipe);
                      recipe['ingredients'] = [];
                    }
                  }
                  return {
                    type: RecipeActions.SET_RECIPES,
                    payload: recipes
                  };
                })
              );

  @Effect({dispatch: false})
  recipeStore = this.actions$.ofType(RecipeActions.STORE_RECIPES)
                .pipe(
                  withLatestFrom(this.store.select('recipes')),
                  switchMap(([action, state]) => {
                    const req = new HttpRequest('PUT', this.DB_RECIPES_URL,
                                state.recipes, {
                                  reportProgress: true
                                });
                    return this.http.request(req);
                  }),
                );

  constructor(private actions$: Actions,
              private http: HttpClient,
              private store: Store<fromRecipe.FeatureState>) {}
}
