/**
 * @file channelID command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message) => {
  let channel = message.mentions.channels.first();
  if (!channel) {
    channel = message.channel;
  }

  await message.channel.send({
    embed: {
      color: ThotPatrol.colors.BLUE,
      fields: [
        {
          name: 'Channel',
          value: `#${channel.name}`,
          inline: true
        },
        {
          name: 'ID',
          value: channel.id,
          inline: true
        }
      ]
    }
  });
};

exports.config = {
  aliases: [ 'cid' ],
  enabled: true
};

exports.help = {
  name: 'channelID',
  description: 'Shows ID of a specified channel of your Discord server.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'channelID [#channel-mention]',
  example: [ 'channelID #channel-name', 'channelID' ]
};
