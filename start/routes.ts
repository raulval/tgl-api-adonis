/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from "@ioc:Adonis/Core/Route";

Route.post("/login", "AuthController.login");
Route.get("/cart_games", "CartController.index");

Route.group(() => {
  Route.post("/create", "UsersController.create");

  Route.group(() => {
    Route.get("/my-account", "UsersController.index");
    Route.put("/update", "UsersController.update");
    Route.delete("/delete", "UsersController.delete");
    Route.post("/pay-credits", "UsersController.payCredits");
  }).middleware("auth");
}).prefix("/user");

Route.group(() => {
  Route.post("/create-game", "GamesController.create");
  Route.delete("/delete-game/:gameId", "GamesController.delete");
  Route.put("/update-game/:gameId", "GamesController.update");
  Route.post("/create-league", "LeaguesController.create");
  Route.delete("/delete-league/:leagueId", "LeaguesController.delete");
  Route.put("/update-league/:leagueId", "LeaguesController.update");
  Route.put("/promote-user/:id", "AdminController.promoteUser");
  Route.delete("/delete-user/:id", "AdminController.deleteUser");
  Route.get("/all-users", "AdminController.index");
})
  .middleware("auth")
  .prefix("/admin")
  .middleware("adminVerify");

Route.group(() => {
  Route.post("/new-bet/", "BetsController.create");
  Route.delete("/delete-bet/:betId", "BetsController.delete");
  Route.put("/update-bet/:gameId/:betId", "BetsController.update");
  Route.get("/all-bets", "BetsController.index");
})
  .middleware("auth")
  .prefix("/bet");

Route.group(() => {
  Route.get("/lottery/:lottery", "LotteryConsumersController.getResults");
})
  .middleware("auth")
  .prefix("/results");

Route.group(() => {
  Route.get("/matches", "SportsConsumersController.getMatches");
  Route.get("/leagues", "LeaguesController.index");
})
  .middleware("auth")
  .prefix("/sports");

Route.group(() => {
  Route.post("/", "ResetPasswordController.store");
  Route.post("/:token", "ResetPasswordController.update");
}).prefix("/reset");
