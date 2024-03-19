import { db, errorHandler } from '../utils.js';

export async function getBookName(id) {
  let bookName = new Promise((resolve, reject) => {
    db.get('SELECT name FROM books_list WHERE id = ?', [id], (err, row) => {
      if (err) {
        reject(errorHandler);
      }
      resolve(row.name);
    });
  });

  return bookName;
}
