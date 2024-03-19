import * as fs from 'fs';
import process from 'process';
import { exit } from 'node:process';
import { db, errorHandler } from './utils.js';

db.serialize();
//проверка на наличие аргументов, если нет - exit
if (process.argv[2] === undefined || process.argv[3] === undefined) {
  exit(1);
}

let name = process.argv[2];
let file = process.argv[3];

let book = fs.readFileSync(file, 'utf8').replace(/\n/g, '');

const sentencePerPage = 60;
let pages = [];

let page = '';
let sentencesCnt = 0;

while (true) {
  if (book.length === 0) {
    break;
  }

  if (sentencesCnt === sentencePerPage) {
    pages.push(page.trimStart());
    sentencesCnt = 0;
    page = '';
  }

  // let index = book.indexOf(".");
  let regex = /[(?!.)<]/g;
  let index = book.search(regex);

  if (index === -1) {
    page += book;
    break;
  }

  page += book.substring(0, index + 1);
  sentencesCnt++;
  book = book.substring(index + 1);
}


if (page !== '') {
  pages.push(page.trimStart());
}

new Promise((resolve, reject) => {
  db.run('INSERT INTO books_list(name) VALUES (?)', [name], (err) => {
    if (err) {
      process.stderr.write(err);
      return;
    }
  });

  db.get('SELECT last_insert_rowid() as book_id', [], (err, result) => {
    if (err) {
      reject(err);
      return;
    }

    resolve(result);
  });
}).then((value) => {
  pages.forEach((i, index) => {
    db.run(
      'INSERT INTO pages(book_id, page_number, page) VALUES (?, ?, ?)',
      [value.book_id, index + 1, i],
      (err) => {
        if (err) {
          rej(err);
          return;
        }
      },
    );
  });
});


// node add_book.js Сто_лет_одиночества Markes_sto_let.txt
// node add_book.js Преступление_и_наказание Dostoevskiy.txt
// node add_book.js Учение_Дона_Хуана Castaneda_Uchenie.txt
// node add_book.js Никогде Gaiman_Nikogde.txt
// node add_book.js Пролетая_над_гнездом_кукушки Kesey.txt
// node add_book.js Мор_ученик_Смерти Mort.txt
// node add_book.js Бойцовский_клуб Palahniuk.txt
// node add_book.js Дом_в_котором Dom.txt
// node add_book.js Generation_П Generation_P.txt
// node add_book.js Гарри_Поттер_и_Тайная_Комната garri_potter.txt