import { db } from '../utils.js';

export async function getPageText(id, page_num) {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT page FROM pages WHERE book_id = ? AND page_number = ?',
      [id, page_num],
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(row);
      },
    );
  }).then((value) => {
      return value.page
    })
    .catch((err) => {
      if (err) {
        console.log(err);
        return;
      }
    });
}
