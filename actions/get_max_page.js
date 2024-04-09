import { db } from '../utils.js';

export async function getMaxPage(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT MAX(page_number) AS max  FROM pages WHERE book_id = ?', [id], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row);
    });
  })
    .then((value) => {
      return value.max;
    })
    .catch((err) => {
      if (err) {
        console.log(err);
        return;
      }
    });
}
