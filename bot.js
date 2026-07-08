require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error('Falta BOT_TOKEN en variables de entorno. Revoca el token expuesto y crea uno nuevo en @BotFather.');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });
const channelId = process.env.CHANNEL_ID || '-1004492367160';
const paymentAddr = process.env.PAYMENT_ADDRESS || 'TH5KDQDW1pYmBzXUxhEu48MJm4GCzMnK3J';
const p1 = process.env.PRICE_1M || '3';
const p3 = process.env.PRICE_3M || '7';
const pl = process.env.PRICE_LIFETIME || '15';

console.log('Bot iniciado. Canal:', channelId);

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `Bot activo.\nCanal registrado: ${channelId}\nPlanes: 1 mes ${p1} USDT, 3 meses ${p3} USDT, vitalicio ${pl} USDT`);
});

// Comando rápido para mostrar dirección y QR de pago
bot.onText(/\/donar|\/pagar/, (msg) => {
  const chatId = msg.chat.id;
  const qr = encodeURIComponent(paymentAddr);
  const qrUrl = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${qr}`;
  const tronscan = `https://tronscan.org/#/address/${paymentAddr}`;
  const text = `Envía tu pago a: ${paymentAddr}\n\nPlanes: 1 mes ${p1} USDT, 3 meses ${p3} USDT, vitalicio ${pl} USDT\n\nQR: ${qrUrl}\nVer en Tronscan: ${tronscan}`;
  bot.sendMessage(chatId, text);
});

bot.on('message', (msg) => {
  if (!msg.text || msg.text.startsWith('/start') || msg.text.startsWith('/donar') || msg.text.startsWith('/pagar')) return;
  bot.sendMessage(msg.chat.id, 'Usa /start para ver la configuración del bot o /donar para obtener la dirección y QR.');
});
