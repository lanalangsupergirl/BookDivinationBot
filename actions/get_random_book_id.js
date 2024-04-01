import { db } from '../utils.js';

export async function getRandomBookId() {
  return new Promise((resolve, reject) => {
    db.all('SELECT id FROM books_list', [], (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  })
    .then((value) => {
      let bookIds = value.map((el) => el.id);
      let randomId = Math.floor(Math.random() * bookIds.length);
      return bookIds[randomId];
    })
    .catch((err) => {
      if (err) {
        console.log(err);
        return;
      }
    });
}
