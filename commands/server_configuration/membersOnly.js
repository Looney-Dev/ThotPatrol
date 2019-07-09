/**
 * @file membersOnly command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message) => {
  let guildModel = await ThotPatrol.database.models.guild.findOne({
    attributes: [ 'membersOnly' ],
    where: {
      guildID: message.guild.id
    }
  });

  await ThotPatrol.database.models.guild.update({
    membersOnly: !guildModel.dataValues.membersOnly
  },
  {
    where: {
      guildID: message.guild.id
    },
    fields: [ 'membersOnly' ]
  });

  await message.channel.send({
    embed: {
      color: ThotPatrol.colors[guildModel.dataValues.membersOnly ? 'RED' : 'GREEN'],
      description: ThotPatrol.i18n.info(message.guild.language, guildModel.dataValues.membersOnly ? 'disableMembersOnly' : 'enableMembersOnly', message.author.tag)
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'membersOnly',
  description: 'Toggles Members Only mode of ThotPatrol. If Members Only mode is enabled only users with at least one role in the server can use ThotPatrol\'s Commands.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'membersOnly',
  example: []
};
