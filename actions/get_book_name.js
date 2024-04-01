import { db } from '../utils.js';

export async function getBookName(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT name FROM books_list WHERE id = ?', [id], (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(row);
    });
  }).then((value) => {
    return value.name
  })
  .catch((err) => {
    if (err) {
      console.log(err);
      return;
    }
  });
}
