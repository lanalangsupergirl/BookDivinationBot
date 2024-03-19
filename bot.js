import { Telegraf, Scenes, session, Markup } from 'telegraf';
import 'dotenv/config';
// import axios from 'axios';
// import express from 'express';
import { randomWisdom } from './utils.js';
import { divinationScene } from './scenes/divination_scene.js';
import { randomDivinationScene } from './scenes/random_divination_scene.js';

const BOT_TOKEN = process.env.BOT_TOKEN;

if (BOT_TOKEN === undefined) {
  throw new Error('BOT_TOKEN must be provided!');
}

// const PORT = process.env.PORT || 88;
// const app = express();

// app.use(express.json());
// app.use(
//   express.urlencoded({
//     extended: true,
//   }),
// );

const bot = new Telegraf(BOT_TOKEN);

bot.catch((err, ctx) => {
  console.log('err', err);
  ctx.scene.leave();
  return ctx.reply(
    'Что-то пошло не так! Попробуй еще раз, все возможные варианты находятся в меню',
  );
});

const stage = new Scenes.Stage([divinationScene, randomDivinationScene], {
  sessionName: 'chatSession',
});

bot.use(session());
bot.use(stage.middleware());

bot.start(async (ctx) => {
  await ctx.scene.enter('start');
});

bot.use(
  session({
    property: 'chatSession',
    getSessionKey: (ctx) => ctx.chat && ctx.chat.id,
  }),
);

bot.on('sticker', (ctx) => {
  ctx.reply('🔮');
});

bot.action('start', async (ctx) => {
  await ctx.scene.enter('start');
});

bot.action('bychance', async (ctx) => {
  await ctx.scene.enter('bychance');
});

bot.action('begin', async (ctx) => {
  await ctx.scene.enter('start');
  ctx.editMessageText('✨✨✨✨✨✨✨✨✨✨✨✨✨✨');
});

bot.action('randomwisdom', async (ctx) => {
  let string = randomWisdom();

  await ctx.reply(`${string}`);
});

bot.on('message', async (ctx) => {
  if (ctx.message.text === '/start') {
    await ctx.scene.enter('start');
  }

  if (ctx.message.text === '/randomwisdom') {
    let string = randomWisdom();
    await ctx.reply(`${string}`);

  } else if (ctx.message.text === '/bychance') {

    await ctx.scene.enter('bychance');

  } else {

    ctx.reply(
      'Хотите погадать?',
      Markup.inlineKeyboard([
        Markup.button.callback('Да', 'begin'),
        Markup.button.callback('Слова поддержки', 'randomwisdom'),
      ]),
    );
  }
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// app.listen(PORT, () => {
//   console.log(`Example app listening on port ${PORT}`);
// });
