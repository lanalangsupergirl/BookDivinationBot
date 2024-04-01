import { Scenes, Markup } from 'telegraf';
import { getBookName } from '../actions/get_book_name.js';
import { getMaxPage } from '../actions/get_max_page.js';
import { getPageText } from '../actions/get_page_text.js';
import { getDivination } from '../actions/get_divination.js';
import { getAllBookIds } from '../actions/get_all_book_ids.js';
import { addBotStatistics } from '../add_bot_statistics.js';

export const divinationScene = new Scenes.WizardScene(
  'start',
  async (ctx) => {
    ctx.scene.session.user = {};

    ctx.scene.session.user.id = ctx.chat.id;

    addBotStatistics(ctx.chat.id);

    ctx.reply('Напиши свой вопрос! Он нигде не сохраняется и виден только тебе');

    return ctx.wizard.next();
  },
  (ctx) => {

    if (ctx.update.message.text === undefined) {
      ctx.wizard.state.question = 'Вы не задали вопрос';
    }

    ctx.wizard.state.question = ctx.update.message.text;

    ctx.replyWithHTML(
      ` <b>Выбери книгу:</b>\n
     1. Габриель Г. Маркес <b>Сто лет одиночества</b>
     2. Достоевский <b>Преступление и наказание</b>
     3. Карлос Кастанеда <b>Учение Дона Хуана</b>
     4. Нил Гейман <b>Никогде</b>
     5. Кен Кизи <b>Пролетая над гнездом кукушки</b>
     6. Терри Пратчетт <b>Мор, ученик Смерти</b>
     7. Чак Паланик <b>Бойцовский клуб</b>
     8. Мариам Петросян <b>Дом, в котором...</b>
     9. Виктор Пелевин <b>Generation П</b>
     10. Джоан Роулинг <b>Гарри Поттер и Тайная комната</b>
     `,
      Markup.keyboard(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], {
        wrap: (btn, index, currentRow) => currentRow.length >= (index + 1) / 2,
      }).oneTime(),
    );

    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.wizard.state.bookId = parseInt(Math.trunc(ctx.message.text));
    console.log(ctx.wizard.state.bookId);

    let allBookIds = await getAllBookIds();

    if (isNaN(ctx.wizard.state.bookId)) {
      ctx.reply('Это не число. Попробуй еще раз!');
      return;
    }

    if (!allBookIds.includes(ctx.wizard.state.bookId)) {
      ctx.reply('Книги с таким номером не существует. Попробуй еще раз!');
      return;
    }

    ctx.wizard.state.bookName = await getBookName(ctx.wizard.state.bookId);

    ctx.wizard.state.maxpage = await getMaxPage(ctx.wizard.state.bookId);

    ctx.reply(
      `Выбери страницу от 1 до ${ctx.wizard.state.maxpage}. В сообщении напиши только число`,
    );

    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.wizard.state.page = parseInt(Math.trunc(ctx.message.text));

    if (isNaN(ctx.wizard.state.page)) {
      ctx.reply('И все же это должно быть число');
      return;
    }

    if (ctx.wizard.state.page < 1) {
      ctx.reply('Число страниц не может быть меньше 1');
      return;
    }

    if (ctx.wizard.state.page > ctx.wizard.state.maxpage) {
      ctx.reply('Число не должно быть больше максимального количества страниц в книге');
      return;
    }

    ctx.wizard.state.text = await getPageText(ctx.wizard.state.bookId, ctx.wizard.state.page);

    ctx.replyWithMarkdownV2(
      'Выбери строку от 1 до 60 сверху либо снизу\\.\\ Пример твоего сообщения: *10 сверху*, либо *5 снизу*\\. Если ты не хочешь указывать направление строки, то по уомлчанию это всегда строка *сверху*\\.',
    );

    return ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.message.text === undefined) {
      ctx.reply('Что-то пошло не так');
      return;
    }

    if (ctx.message.sticker) {
      ctx.reply('Стикер не поможет получить предсказание');
      return;
    }

    //  let searchFrom = parseInt(ctx.message.text.match(/\d+/)[0]);

    let searchFrom = parseInt(Math.trunc(ctx.message.text.match(/-?\d+/)));
    let position = ctx.message.text.split(' ').slice(-1)[0];
    let text = ctx.wizard.state.text;

    if (isNaN(searchFrom)) {
      ctx.reply('Нет номера строки - нет предсказания');
      return;
    }

    if (searchFrom <= 0) {
      ctx.reply('Номер строки не может быть меньше 1');
      return;
    }

    if (searchFrom > 60) {
      ctx.reply('Строки с таким номером нет на странице, попробуй еще раз');
      return;
    }

    if (ctx.wizard.state.question === undefined) {
      ctx.wizard.state.question = 'Вы не задали вопрос';
    }

    let divination = await getDivination(text, searchFrom, position);

    ctx.replyWithHTML(
      `<b>Ты выбрал книгу:</b>\n${ctx.wizard.state.bookName
        .split('_')
        .join(' ')}\n<b>Твой вопрос звучал так:</b>\n${
        ctx.wizard.state.question
      }\n<b>И гадание говорит тебе:</b>\n${divination}`,
      Markup.inlineKeyboard([
        Markup.button.callback('Погадать еще раз', 'start'),
        Markup.button.callback('Хочу закончить', 'leave'),
      ]),
    );

    return ctx.wizard.next();
  },
  (ctx) => {
    if (ctx.update.callback_query.data === 'start') {
      ctx.editMessageReplyMarkup();
      ctx.scene.leave();

      return ctx.scene.enter('start');
    }

    if (ctx.update.callback_query.data === 'leave') {
      ctx.editMessageReplyMarkup();
      ctx.scene.leave();
      ctx.reply(
        '✨Книги прощаются с тобой и ждут твоего возвращения с новым вопросом для них✨',
        Markup.inlineKeyboard([
          [
            Markup.button.callback('Погадать еще раз', 'start'),
            Markup.button.callback('Погадать быстро', 'bychance'),
          ],
          [Markup.button.callback('Слова поддержки', 'randomwisdom')],
        ]),
      );
    }
    return ctx.wizard.next();
  },
);
