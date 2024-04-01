import { Scenes, Markup } from 'telegraf';
import { getBookName } from '../actions/get_book_name.js';
import { getRandomBookId } from '../actions/get_random_book_id.js';
import { getRandomDivination } from '../actions/get_random_divination.js';
import { addBotStatistics } from '../add_bot_statistics.js';

export const randomDivinationScene = new Scenes.WizardScene(
  'bychance',
  async (ctx) => {
    ctx.scene.session.user = {};
    ctx.scene.session.user.id = ctx.chat.id;

    addBotStatistics(ctx.chat.id);

    ctx.reply('Напиши свой вопрос и получи быстрое случайное гадание');

    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.wizard.state.question = ctx.update.message.text;

    if (ctx.wizard.state.question === undefined) {
      ctx.wizard.state.question = 'Ты не задал вопрос';
    }

    ctx.wizard.state.randomBookId = await getRandomBookId();

    ctx.wizard.state.bookName = await getBookName(ctx.wizard.state.randomBookId);

    let randomDivination = await getRandomDivination(ctx.wizard.state.randomBookId);

    ctx.replyWithHTML(
      `<b>Ты выбрал книгу:</b>\n${ctx.wizard.state.bookName
        .split('_')
        .join(' ')}\n<b>Твой вопрос звучал так:</b>\n${
        ctx.wizard.state.question
      }\n<b>И гадание говорит тебе:</b>\n${randomDivination}`,
      Markup.inlineKeyboard([
        Markup.button.callback('Еще раз быстро', 'bychance'),
        Markup.button.callback('Хочу закончить', 'leave'),
      ]),
    );

    return ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.update.callback_query.data === 'bychance') {
      ctx.editMessageReplyMarkup();
      ctx.scene.leave();
      return ctx.scene.enter('bychance');
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
