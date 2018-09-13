const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
require('./util/eventLoader')(client);

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};
client.on('message', msg => {
  if (msg.content === 'Selamun aleyküm') {
    msg.reply('Aleyküm selam hoş geldin.');
  }
});
client.on('message', msg => {
  if (msg.content === 'sa') {
    msg.reply('Aleyküm selam hoş geldin.');
  }
});
client.on('message', msg => {
  if (msg.content === 'Merhaba') {
    msg.reply('Merhaba nasılsın');
  }
});
client.on('message', msg => {
  if (msg.content === 'İyiyim sen') {
    msg.reply('İyiyim sağol.');
  }
});
client.on('message', msg => {
  if (msg.content === 'iyi') {
    msg.reply('Sevindim.');
  }
});
client.on('message', msg => {
  if (msg.content === prefix + 'aciklamayap') {
    msg.channel.sendMessage('**Beinz Bot Discord sunucusuna hoş geldiniz! :heart: \nBu sunucuda komut kullanabilir ve bilgi alabilirsiniz. :gift: \nGenel sohbet kanalını kullanarak sohbet edebilirsiniz. :fireworks: \nSunucunun davet linki: http://www.goo.gl/3DpozJ :white_check_mark:**');
  }
});
client.on('message', msg => {
  if (msg.content === prefix + 'jitemhakkinda') {
    msg.reply('```JITEM aslen Jandarma İstihbarat ve Terörle mücadele anlamına gelmektedir ancak biz aslını yaşatmadığımız için böyle bir isim takınmaktan ziyade JITEM olarak anılmayı tercih eden bireyleriz.\nKlanımız en başında bir sunucu çetesi olarak bizzat Yesil tarafından 2016 yılının başlarında kurulmuş olup XecuKinG (Willy) tarafından yönetilmekte idi.\nKısa bir süre sonra sunucu çetesi olmaktan çıkıp klan haline geldiğimizde klan üyeleri içerisinde sağlam bir temizlik yapmış bulunup yaklaşık 6 7 üye olarak piyasada ismimizi sürdürmüştük.\nUzun süre sahalardan uzak kaldık. Oyun dahi oynamadık. Farklı mecralarda adımızı duyurup iyi bir ortam oluşturduk.\nFarklı farklı sunuculara geçiş yapsakta aradığımızı ve umduğumuzu Inferno da bulduk. Yepyeni bir yönetim ve yönetim anlayışı ile piyasaya adımızı bir nebze de olsa duyurduk.\nSadece DM alanında değil, sistemsel gelişim bakımından da, oyun içi araç uğraşları bakımından ve minigames bakımından da kendimizi sınıflandırdık.\nJITEM in kolları haline bürüdüğümüz birçok topluluk oluşturduk. Bizim sadece bir online oyundan ibaret dediğimiz bir dostluğumuz yok.\nAmacımız çok açık, geniş bir dotluk ortamı kurup hem oyun oynayıp hem sohbet etmektendir ki discord sunucumuz buna çok müsait.\nBizim amacımız DM alanında veya farklı alanlarda en iyisi olmak veya "zirvede" oturmak değil belli başlı bir ortam kurmak ve bunu da başardık diye düşünüyoruz.```');
  }
});



client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on('warn', e => {
  console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
  console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.login(ayarlar.token);
