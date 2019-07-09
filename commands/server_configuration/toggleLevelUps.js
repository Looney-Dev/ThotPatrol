/**
 * @file toggleLevelUps command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message) => {
  let guildModels = await message.client.database.models.guild.findOne({
    attributes: [ 'levelUps' ],
    where: {
      guildID: message.guild.id
    }
  });

  let levelUpStatus = !guildModels.dataValues.levelUps;

  await message.client.database.models.guild.update({
    levelUps: levelUpStatus
  },
  {
    where: {
      guildID: message.guild.id
    },
    fields: [ 'levelUps' ]
  });

  await message.channel.send({
    embed: {
      color: levelUpStatus ? ThotPatrol.colors.GREEN : ThotPatrol.colors.RED,
      description: ThotPatrol.i18n.info(message.guild.language, levelUpStatus ? 'enableLevelUps' : 'disableLevelUps', message.author.tag)
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
};

exports.config = {
  aliases: [ 'levelUps' ],
  enabled: true
};

exports.help = {
  name: 'toggleLevelUps',
  description: 'Toggle level ups in the server. Turning off level ups will prevent users from gaining experience points and leveling up while chatting.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'toggleLevelUps',
  example: []
};
