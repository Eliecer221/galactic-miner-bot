require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const https = require('https');

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error('Falta BOT_TOKEN en variables de entorno. Revoca el token expuesto y crea uno nuevo en @BotFather.');
  process.exit(1);
}

// Start an HTTP server first so Render detects an open port (works for Web Service)
const http = require('http');
const port = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Galaxia Ultimate Bot está activo y en ejecución 🚀\n');
});
server.listen(port, () => {
  console.log(`Servidor HTTP activo escuchando en el puerto ${port}`);
});

// Helper: call Telegram API to delete any existing webhook to avoid ETELEGRAM 409
function deleteWebhook(token) {
  return new Promise((resolve) => {
    const path = `/bot${token}/deleteWebhook?drop_pending_updates=true`;
    const options = { hostname: 'api.telegram.org', port: 443, path, method: 'GET' };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', (err) => resolve({ error: err.message }));
    req.end();
  });
}

(async () => {
  console.log('Intentando eliminar webhook existente en Telegram (para evitar ETELEGRAM 409)...');
  const resp = await deleteWebhook(token);
  if (resp.error) {
    console.warn('deleteWebhook error:', resp.error);
  } else {
    console.log('deleteWebhook HTTP status:', resp.status);
  }

  // Start the bot with polling after attempting to remove any webhook
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

  bot.on('polling_error', (err) => {
    console.error('polling_error', err);
    if (err && err.code === 'ETELEGRAM') {
      console.warn('ETELEGRAM error. Si persiste 409, asegúrate de que no hay otra instancia del bot en ejecución y/o elimina el webhook manualmente desde @BotFather o usando deleteWebhook.');
    }
  });
})();
