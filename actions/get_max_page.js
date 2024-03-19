import { db, errorHandler } from '../utils.js';

export async function getMaxPage(id) {
  let maxPage = new Promise((resolve, reject) => {
    db.all('SELECT MAX(page_number) AS max  FROM pages WHERE book_id = ?', [id], (err, rows) => {
      if (err) {
        reject(errorHandler);
      }
      resolve(rows);
    });
  });

  return maxPage;
}
