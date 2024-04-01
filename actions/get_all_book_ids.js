import { db } from '../utils.js';

export async function getAllBookIds() {
  return new Promise((resolve, reject) => {
    db.all('SELECT id FROM books_list', [], (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  })
    .then((value) => {
      return value.map((el) => el.id);
    })
    .catch((err) => {
      if (err) {
        console.log(err);
        return;
      }
    });
}
