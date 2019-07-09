/**
 * @file cuddle command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const request = require('request-promise-native');

exports.exec = async (ThotPatrol, message) => {
  let options = {
    url: 'http://api.giphy.com/v1/gifs/search',
    qs: {
      q: 'cuddle',
      api_key: 'dc6zaTOxFJmzC',
      limit: 10,
      offset: 0
    },
    json: true
  };

  let response = await request(options);

  if (!response.data.length) {
    return ThotPatrol.emit('error', ThotPatrol.strings.error(message.guild.language, 'notFound'), ThotPatrol.strings.error(message.guild.language, 'notFound', true, 'image'), message.channel);
  }

  await message.channel.send({
    embed: {
      color: ThotPatrol.colors.BLUE,
      title: `${message.author.tag} is cuddling you.`,
      image: {
        url: response.data[Math.floor(Math.random() * response.data.length)].images.original.url
      },
      footer: {
        text: 'Powered by GIPHY'
      }
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'cuddle',
  description: 'Cuddle someone!',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'cuddle',
  example: [ 'cuddle' ]
};
