import { db } from '../utils.js';

export async function checkBookIdExists(id) {
  return new Promise((resolve, reject) => {
    db.all('SELECT id FROM books_list', [], (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  })
    .then((value) => {
      let ids = value.map((el) => el.id);

      console.log(ids.indexOf(id));

      if (ids.indexOf(id) === -1) {
        return false;
      } else {
        return true;
      }
    })
    .catch((err) => {
      if (err) {
        console.log(err);
        return;
      }
    });
}
