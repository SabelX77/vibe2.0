
const { EmbedBuilder } = require('discord.js');

function createEmbed(title, description, color = 0x00AE86) {
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setTimestamp();
}

module.exports = {
    ping: async (message, client) => {
        const ping = Date.now() - message.createdTimestamp;
        const apiPing = Math.round(client.ws.ping);
        const pingEmbed = createEmbed('🏓 Pong!', 
            `**Bot Latency:** ${ping}ms\n**API Latency:** ${apiPing}ms`);
        message.channel.send({ embeds: [pingEmbed] });
    },

    userinfo: async (message) => {
        const user = message.mentions.users.first() || message.author;
        const member = message.guild.members.cache.get(user.id);
        const userEmbed = createEmbed(`👤 ${user.username}'s Info`,
            `**Username:** ${user.tag}
            **ID:** ${user.id}
            **Account Created:** <t:${Math.floor(user.createdTimestamp / 1000)}:F>
            **Joined Server:** <t:${Math.floor(member.joinedTimestamp / 1000)}:F>
            **Roles:** ${member.roles.cache.map(role => role.name).slice(0, -1).join(', ') || 'None'}`);
        userEmbed.setThumbnail(user.displayAvatarURL());
        message.channel.send({ embeds: [userEmbed] });
    },

    serverinfo: async (message) => {
        const guild = message.guild;
        const serverEmbed = createEmbed(`🏰 ${guild.name}`,
            `**Owner:** <@${guild.ownerId}>
            **Members:** ${guild.memberCount}
            **Created:** <t:${Math.floor(guild.createdTimestamp / 1000)}:F>
            **Channels:** ${guild.channels.cache.size}
            **Roles:** ${guild.roles.cache.size}
            **Boost Level:** ${guild.premiumTier}`);
        if (guild.iconURL()) serverEmbed.setThumbnail(guild.iconURL());
        message.channel.send({ embeds: [serverEmbed] });
    },

    avatar: async (message) => {
        const avatarUser = message.mentions.users.first() || message.author;
        const avatarEmbed = createEmbed(`🖼️ ${avatarUser.username}'s Avatar`, `Here's ${avatarUser.username}'s avatar in high quality!`)
            .setImage(avatarUser.displayAvatarURL({ size: 512 }));
        message.channel.send({ embeds: [avatarEmbed] });
    },

    about: async (message, client, prefix) => {
        const aboutEmbed = createEmbed('🤖 About VibeBot', 
            `**VibeBot** is a fully-featured Discord moderation and utility bot designed to keep your server safe and fun!

            **Features:**
            🛡️ **AutoMod** - Automatic bad word filtering and spam detection
            ⚡ **Moderation** - Kick, ban, mute, warn, and message management
            🎮 **Fun Commands** - Games, jokes, quotes, and more!
            📊 **Utilities** - User info, server info, ping checks

            **Created by:** <@sabelx77>
            **Bot Version:** 2.0
            **Library:** Discord.js v14
            **Prefix:** \`${prefix}\`

            Use \`${prefix}help\` to see all available commands!`, 
            0x4F46E5);
        aboutEmbed.setThumbnail(client.user.displayAvatarURL());
        aboutEmbed.setFooter({ text: `Made with ❤️ by sabelx77` });
        message.channel.send({ embeds: [aboutEmbed] });
    }
};
