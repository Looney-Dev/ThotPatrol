/**
 * @file roleEmoji command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const emojis = xrequire('./assets/emojis.json');

exports.exec = async (ThotPatrol, message, args) => {
  if (!args.role || !(args.emoji || args.remove)) {
    return ThotPatrol.emit('commandUsage', message, this.help);
  }


  args.role = args.role.join(' ');
  let role;
  if (message.guild.roles.has(args.role)) {
    role = message.guild.roles.get(args.role);
  }
  else if (message.mentions.roles.size) {
    role = message.mentions.roles.first();
  }
  else {
    role = message.guild.roles.find(role => role.name === args.role);
  }
  if (!role) {
    return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'roleNotFound'), message.channel);
  }

  let emoji = null;
  if (args.emoji) {
    emoji = encodeURIComponent(args.emoji);
    if (!emojis.includes(emoji)) {
      return ThotPatrol.emit('error', 'invalidInput', 'The emoji you entered is invalid. Note that custom emojis aren\'t supported currently.', message.channel);
    }
  }


  await ThotPatrol.database.models.role.upsert({
    roleID: role.id,
    guildID: message.guild.id,
    emoji: args.remove ? null : emoji
  },
  {
    where: {
      roleID: role.id,
      guildID: message.guild.id
    },
    fields: [ 'roleID', 'guildID', 'emoji' ]
  });


  await message.channel.send({
    embed: {
      color: args.remove ? ThotPatrol.colors.RED : ThotPatrol.colors.GREEN,
      description: ThotPatrol.i18n.info(message.guild.language, args.remove ? 'unsetRoleEmoji' : 'setRoleEmoji', message.author.tag, role.name, decodeURIComponent(emoji))
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'role', type: String, multiple: true, defaultOption: true },
    { name: 'emoji', type: String, alias: 'e' },
    { name: 'remove', type: Boolean }
  ]
};

exports.help = {
  name: 'roleEmoji',
  description: 'Assign an emoji to a specified role. The assigned emojis are used with Reaction Roles.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'roleEmoji < ROLE_ID | @Role Mention | Role Name > < --emoji :emoji_name: | --remove >',
  example: []
};
