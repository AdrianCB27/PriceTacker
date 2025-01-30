 const TelegramBot = require('node-telegram-bot-api');
const token='7875732075:AAExYlM9IAejYvbA5DvQj1uKeHqkGl_Cyc8';
const bot = new TelegramBot(token, { polling: true });
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text;
  
    if (messageText === '/start') {
      bot.sendMessage(chatId, 'Bienvenido 😉');
    }
  });

console.log(token);
