import { db, errorHandler } from '../utils.js';

export async function getPageText(id, page_num) {
  let pageText = new Promise((resolve, reject) => {
    db.all('SELECT page FROM pages WHERE book_id = ? AND page_number = ?', [id, page_num], (err, rows) => {
      if (err) {
        reject(errorHandler);
      }
      resolve(rows);
    });
  });

  return pageText;
}
