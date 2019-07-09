/**
 * @file commandAnalytics command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message) => {
  let mostUsedCommands = Object.keys(message.guild.commandAnalytics);
  mostUsedCommands = mostUsedCommands.slice(0, 10);
  mostUsedCommands = mostUsedCommands.map(command => `\`${command}\` - ${message.guild.commandAnalytics[command]} times`);

  await message.channel.send({
    embed: {
      color: ThotPatrol.colors.BLUE,
      title: 'Most used commands in this Server',
      description: mostUsedCommands.join('\n'),
      footer: {
        text: 'Command stats are cleared after restart.'
      }
    }
  });
};

exports.config = {
  aliases: [ 'commandStats' ],
  enabled: true
};

exports.help = {
  name: 'commandAnalytics',
  description: 'Shows the most used commands in the server.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'commandAnalytics',
  example: []
};
