/**
 * @file votingChannels command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  if (args.add) {
    await ThotPatrol.database.models.textChannel.upsert({
      channelID: message.channel.id,
      guildID: message.guild.id,
      votingChannel: true
    },
    {
      where: {
        channelID: message.channel.id,
        guildID: message.guild.id
      },
      fields: [ 'channelID', 'guildID', 'votingChannel' ]
    });

    await message.channel.send({
      embed: {
        color: ThotPatrol.colors.GREEN,
        description: `${message.channel} has been added to the list of voting channels.`
      }
    }).catch(e => {
      ThotPatrol.log.error(e);
    });
  }
  else if (args.remove) {
    await ThotPatrol.database.models.textChannel.update({
      votingChannel: false
    },
    {
      where: {
        channelID: message.channel.id,
        guildID: message.guild.id,
        votingChannel: true
      },
      fields: [ 'votingChannel' ]
    });

    await message.channel.send({
      embed: {
        color: ThotPatrol.colors.RED,
        description: `${message.channel} has been removed from the list of voting channels.`
      }
    }).catch(e => {
      ThotPatrol.log.error(e);
    });
  }
  else if (args.purge) {
    await ThotPatrol.database.models.textChannel.update({
      votingChannel: false
    },
    {
      where: {
        guildID: message.guild.id,
        votingChannel: true
      },
      fields: [ 'votingChannel' ]
    });

    await message.channel.send({
      embed: {
        color: ThotPatrol.colors.RED,
        description: 'All the channels have been removed from the list of voting channels.'
      }
    }).catch(e => {
      ThotPatrol.log.error(e);
    });
  }
  else {
    let textChannelModel = await ThotPatrol.database.models.textChannel.findAll({
      attributes: [ 'channelID' ],
      where: {
        guildID: message.guild.id,
        votingChannel: true
      }
    });

    let votingChannels, description;
    if (!textChannelModel || !textChannelModel.length) {
      description = 'No voting channels have been set in this server.';
    }
    else {
      votingChannels = textChannelModel.map(guild => guild.dataValues.channelID);
      description = `Messages posted in the voting channels can are available for upvote/downvote by users.\n\nThese channels have been set as the voting channels:\n\n<#${votingChannels.join('>, <#')}>`;
    }

    await message.channel.send({
      embed: {
        color: ThotPatrol.colors.BLUE,
        description: description
      }
    });
  }
};

exports.config = {
  aliases: [ 'votingChannel' ],
  enabled: true,
  argsDefinitions: [
    { name: 'add', type: Boolean, alias: 'a' },
    { name: 'remove', type: Boolean, alias: 'r' },
    { name: 'purge', type: Boolean, alias: 'p' }
  ]
};

exports.help = {
  name: 'votingChannels',
  description: 'Adds/removes the channel as a voting channel. Any messages posted in this channel, by a user, will be available for voting.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'votingChannels [ --add | --remove | --purge ]',
  example: [ 'votingChannels', 'votingChannels --add', 'votingChannels --remove', 'votingChannels --purge' ]
};
