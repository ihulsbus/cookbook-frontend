# Frontend Code Review

_Review date: 2026-06-13 — Angular 19 standalone app. Line references verified against the working tree at time of review._

Findings are ordered by impact. The **Critical** group is active data loss and should be fixed first — those bugs make the UI look like it works while silently doing nothing.

---

## 🔴 Critical — silent data loss (HTTP calls that never fire)

Angular `HttpClient` returns _cold_ observables: with no `.subscribe()`, **the request is never sent**. Three places do this, so the feature silently does nothing.

| # | Location | Problem |
|---|----------|---------|
| 1 | `src/app/components/create-ingredient/create-ingredient.component.ts:48` | `this.restService.createIngredient(this.ingredient);` is not subscribed. Creating an ingredient does nothing; success/`emit` logic is commented out (lines 49–50), so the parent never refreshes. |
| 2 | `src/app/components/recipe-create/recipe-create.component.ts:56` | `this.instructionService.createInstruction(...)` not subscribed. A new recipe's instructions are never saved. |
| 3 | `src/app/screens/recipe-edit/recipe-edit.component.ts:156–157` | **Both** `putRecipeAmounts(...)` and `updateRecipe(...)` are not subscribed. Editing a recipe saves only the instructions (line 158 is subscribed); the recipe fields and ingredient amounts are silently dropped. Worst offender — the edit screen looks like it works but loses data. |

Related, same area:

- `src/app/components/recipe-create/recipe-create.component.ts:58` — `subscribe(next, this.onUploadError)` passes the method **unbound**, so if an error fires, `this.messageService` is `undefined` and it throws. Also the 2-arg `subscribe(next, err)` form is deprecated; use the object form `{ next, error }`.

---

## 🟠 High — wrong behavior

| # | Location | Problem |
|---|----------|---------|
| 4 | `src/app/components/latest-recipes/latest-recipes.component.ts:57–58` | `sortByDateDesc` reads `a.CreatedAt`/`b.CreatedAt`, which don't exist on `Recipe` (fields are `id, name, description, serving_count`). `new Date(undefined)` → `NaN` → the sort is a no-op, so "latest" isn't sorted by date. Needs a real timestamp field from the backend (related to the known UUID-not-sortable issue). |
| 5 | `src/app/components/latest-recipes/latest-recipes.component.html:8` | `routerLink="/app/recipes/{{recipe.ID}}"` uses `recipe.ID`; the field is lowercase `id`. Every card links to `/app/recipes/undefined`. (`recipe.id` is used correctly two lines down for the image map.) |
| 6 | `src/app/screens/ingredients/ingredients.component.ts:79–93` | `deleteIngredients()` fires N concurrent deletes in a loop, then calls `getIngredients()` **immediately after the loop** (line 93) — before any delete resolves — so the list reloads stale. Should be `forkJoin([...deletes]).subscribe(() => this.getIngredients())`. |
| 7 | `src/app/components/ingredient-editor/ingredient-editor.component.html:79 & 90` | `<span v-if="...">` is Vue syntax, not Angular. Parsed as an unknown attribute and ignored, so the conditional is dead (the span always renders). Should be `*ngIf`. |

---

## 🟡 Medium — leaks, error handling, mutation

- **Subscription leaks**: nothing uses `takeUntilDestroyed()` or the `async` pipe except `profile.component.ts`. Leaking subscribers include:
  - `src/app/app.component.ts` (`checkAuth()` in `ngOnInit`)
  - `src/app/components/header/header.component.ts:72` (router events — accumulates on every navigation)
  - `src/app/components/filtering-sidebar/filtering-sidebar.component.ts`
  - `src/app/components/ingredient-list/ingredient-list.component.ts`
  - `src/app/screens/recipe-edit/recipe-edit.component.ts` & `src/app/screens/recipe-detail/recipe-detail.component.ts` (route-param subscribes)
  - `src/app/screens/home/home.component.ts`
- **No error callbacks** on most `subscribe`/`forkJoin` calls (home, recipe-browser, latest-recipes, recipe-grid) → failures are silent. The home error toast is commented out (`home.component.ts:33–35`).
- **`@Input` mutation**:
  - `src/app/components/latest-recipes/latest-recipes.component.ts:51–52` — `this.recipes.sort(...)` and `.splice(6)` mutate the input array in place.
  - `src/app/screens/recipe-browser/recipe-browser.component.ts:53–54` — awkward `this.filteredRecipes.length = 0; this.filteredRecipes = [...r]`.
  - Mutating inputs breaks down under `OnPush`.
- **Leftover debug**: `console.log(this.recipes)` at `latest-recipes.component.ts:50`, plus a stray `JsonPipe` import there.
- **Dead config**: `src/app/app.config.ts:27` — `darkModeSelector: false || 'none'` always evaluates to `'none'`; the `false ||` is dead.

---

## 🟢 Improvements / structural

- **`FullRecipe` is defined three times** — `filtering-sidebar.component.ts:10`, `recipe-grid.component.ts:16`, `recipe-browser.component.ts:14`. Extract to a shared `src/app/lib/types.ts` and import.
- **Duplicated image-loading**: `latest-recipes` and `recipe-grid` have near-identical `forkJoin(searchImage...)` logic — candidate for a shared helper next to `lib/pagination.ts`.
- **Angular v19 idioms** (modernization, not bugs):
  - All DI is constructor-based; `inject()` is preferred for standalone components.
  - `auth.guard.ts` is a class implementing `CanActivate`; functional `CanActivateFn` is the v19 norm.
  - No `OnPush` change detection anywhere; no signals.
  - `auth.guard.ts:16` — router navigation lives inside a `map` (side effect) instead of `tap`.
- **`app.routes.ts` mixes paradigms**: exports both a `routes` array **and** an `AppRoutingModule` NgModule, and `app.config.ts:36` pulls in `AppRoutingModule` via `importProvidersFrom` while line 19 already does `provideRouter(routes)` — redundant. Drop the module.

---

## ⚪ Missing

- **Tests**: every `*.spec.ts` is the default CLI stub (1 `it` each, "should create"); only `app.component.spec.ts` has 3. Effectively no coverage.
- **Unimplemented screens**: `meal-planner` and `shopping-list` are empty stubs (routed but no logic).
- **No global HTTP error handling** and **no loading / empty states** across list screens.

---

## Suggested fix order

1. **Critical (1–3)** + the unbound `onUploadError` — active data loss; fix first.
2. **High (4–7)** — broken navigation, broken sort, delete race, dead template conditional.
3. **Medium** — subscription-leak sweep (`takeUntilDestroyed` / `async` pipe), error callbacks, stop mutating `@Input`s.
4. **Improvements / Missing** — dedupe `FullRecipe` and image-loading, modernize DI/guards, add tests, implement stub screens.
