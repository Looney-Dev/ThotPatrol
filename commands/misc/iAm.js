/**
 * @file iAm command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  if (args.length < 1) {
    return ThotPatrol.emit('commandUsage', message, this.help);
  }

  let guildModel = await ThotPatrol.database.models.guild.findOne({
    attributes: [ 'selfAssignableRoles' ],
    where: {
      guildID: message.guild.id
    }
  });
  if (!guildModel || !guildModel.dataValues.selfAssignableRoles) return;

  let role = message.guild.roles.find(role => role.name === args.join(' '));
  if (!role) return;

  let selfAssignableRoles = [];
  if (guildModel.dataValues.selfAssignableRoles) {
    selfAssignableRoles = guildModel.dataValues.selfAssignableRoles;
  }
  if (!selfAssignableRoles.includes(role.id)) return;

  if (message.guild.me.highestRole.comparePositionTo(role) <= 0) return ThotPatrol.log.info('I don\'t have permission to use this command on that role.');

  let member = message.member;
  if (!member) {
    member = await ThotPatrol.utils.fetchMember(message.guild, message.author.id);
  }

  await member.addRole(role);

  message.channel.send({
    embed: {
      color: ThotPatrol.colors.GREEN,
      description: ThotPatrol.i18n.info(message.guild.language, 'selfAssignRole', message.author.tag, role.name)
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
};

exports.config = {
  aliases: [ 'iwant', 'ihave' ],
  enabled: true
};

exports.help = {
  name: 'iAm',
  description: 'Gives the specified self-assignable role to the user.',
  botPermission: 'MANAGE_ROLES',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'iAm <role name>',
  example: [ 'iAm Looking to play' ]
};
