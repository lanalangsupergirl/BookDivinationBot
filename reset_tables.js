import { db, errorHandler } from "./utils.js";

db.serialize();
db.run("DROP TABLE IF EXISTS books_list", [], errorHandler);
db.run("DROP TABLE IF EXISTS pages", [], errorHandler);

db.run("CREATE TABLE books_list(id INTEGER PRIMARY KEY, name TEXT NOT NULL)");
db.run(
  "CREATE TABLE pages(id INTEGER PRIMARY KEY, book_id INTEGER NOT NULL, page_number INTEGER NOT NULL, page TEXT NOT NULL)"
);
