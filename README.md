# galactic-miner-bot

Pequeño bot de Telegram para gestionar acceso a un canal VIP, mostrar precios y recibir donaciones en Tron.

Contenido:
- bot.js: código principal del bot (usa variables de entorno).
- package.json: dependencias y script start.
- .env.example: ejemplo de variables de entorno.
- .gitignore: ignora node_modules y .env

Cómo usar localmente
1. Clona el repo:
   git clone https://github.com/Eliecer221/galactic-miner-bot.git
2. Entra al directorio e instala dependencias:
   cd galactic-miner-bot
   npm install
3. Crea un archivo `.env` copiando `.env.example` y añade tu token (no subir el token al repo):
   cp .env.example .env
   # editar .env y poner BOT_TOKEN y demás
4. Ejecuta localmente:
   npm start

Comandos disponibles en el bot
- /start — muestra configuración básica.
- /donar o /pagar — muestra la dirección para enviar ganancias/donaciones y un enlace al QR.

Despliegue (resumen rápido)
- Render: crea un "Web Service", conecta tu repo, selecciona la rama `main` y añade variables de entorno (`BOT_TOKEN`, `CHANNEL_ID`, `PAYMENT_ADDRESS`, `PRICE_1M`, `PRICE_3M`, `PRICE_LIFETIME`). Render detectará Node y hará `npm install` y `npm start`.
- Railway: crea un nuevo proyecto desde GitHub, añade las variables de entorno y despliega.

Seguridad
- Revoca el token que compartiste en @BotFather y crea uno nuevo antes de desplegar.
- Nunca subas el token al repositorio público; usa variables de entorno en el servicio de despliegue.

Donaciones
Dirección (Tron) usada para recibir ganancias/donaciones: TH5KDQDW1pYmBzXUxhEu48MJm4GCzMnK3J

