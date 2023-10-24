const TelegramBot = require('node-telegram-bot-api');
const mysql = require('mysql');

// Equipo
// Sachenka Acevedo
// Diana Aragon
//Mariangel Contreras
//Juan Celaya
const token = '6547205604:AAHf4NuCkE_1Mj0gYhApH78fgnj0GCdj3hQ';

// Configuración de la conexión a la base de datos
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'floreria'
});

// Conexión a la base de datos
con.connect(function(err) {
  if (err) throw err;
  console.log('Conexión a la base de datos exitosa!');

  // Crea un nuevo bot
  const bot = new TelegramBot(token, { polling: true });

  // Escucha los mensajes entrantes
  bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text;
    const messageArray = messageText.split(' ');
    const command = messageArray[0];
    const parameter = messageArray.slice(1).join(' ');

    // Lógica condicional basada en el mensaje recibido
    if (command === '/start') {
      bot.sendMessage(chatId, '¡Bienvenido! Puedes usar los comandos /consultar y /eliminar seguidos del Nombre para interactuar con la base de datos y el comando /exit para finalizar el chat.');
    } else if (command === '/consultar') {
      if (parameter) {
        con.query(`SELECT * FROM usuarios WHERE nombre='${parameter}'`, (err, result) => {
          if (err) throw err;
          // Procesa el resultado de la consulta
          bot.sendMessage(chatId, 'El resultado de la consulta es: ' + JSON.stringify(result));
        });
      } else {
        bot.sendMessage(chatId, 'Por favor, proporciona un Nombre después del comando /consultar.');
      }
    } else if (command === '/eliminar') {
      if (parameter) {
        con.query(`DELETE FROM usuarios WHERE nombre='${parameter}'`, (err, result) => {
          if (err) throw err;
          // Procesa el resultado de la eliminación
          bot.sendMessage(chatId, 'Se ha eliminado el registro correctamente.');
        });
      } else {
        bot.sendMessage(chatId, 'Por favor, proporciona un Nombre después del comando /eliminar.');
      }
    } else if (command === '/exit') {
      bot.sendMessage(chatId, 'Cerrando el programa. ¡Hasta luego!');
      process.exit(0); // Cierra el programa
    } else {
      bot.sendMessage(chatId, 'No se reconoce el comando. Inténtalo de nuevo.');
    }
  });
});
