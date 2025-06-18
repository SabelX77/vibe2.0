
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

function createEmbed(title, description, color = 0x00AE86) {
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setTimestamp();
}

function hasPermission(member, permission) {
    return member.permissions.has(PermissionsBitField.Flags[permission]);
}

module.exports = {
    kick: async (message, args) => {
        if (!hasPermission(message.member, 'KickMembers')) {
            return message.reply('❌ You need the "Kick Members" permission to use this command.');
        }
        const kickMember = message.mentions.members.first();
        if (!kickMember) return message.reply('❌ Please mention a user to kick.');
        if (!kickMember.kickable) return message.reply('❌ I cannot kick this user.');

        const kickReason = args.slice(1).join(' ') || 'No reason provided';
        await kickMember.kick(kickReason);
        const kickEmbed = createEmbed('👢 Member Kicked', 
            `**User:** ${kickMember.user.tag}\n**Reason:** ${kickReason}`, 0xFF6B6B);
        message.channel.send({ embeds: [kickEmbed] });
    },

    ban: async (message, args) => {
        if (!hasPermission(message.member, 'BanMembers')) {
            return message.reply('❌ You need the "Ban Members" permission to use this command.');
        }
        const banMember = message.mentions.members.first();
        if (!banMember) return message.reply('❌ Please mention a user to ban.');
        if (!banMember.bannable) return message.reply('❌ I cannot ban this user.');

        const banReason = args.slice(1).join(' ') || 'No reason provided';
        await banMember.ban({ reason: banReason });
        const banEmbed = createEmbed('🔨 Member Banned', 
            `**User:** ${banMember.user.tag}\n**Reason:** ${banReason}`, 0xFF0000);
        message.channel.send({ embeds: [banEmbed] });
    },

    mute: async (message, args) => {
        if (!hasPermission(message.member, 'ModerateMembers')) {
            return message.reply('❌ You need the "Timeout Members" permission to use this command.');
        }
        const muteMember = message.mentions.members.first();
        if (!muteMember) return message.reply('❌ Please mention a user to mute.');

        const muteTime = parseInt(args[1]) || 10;
        const muteReason = args.slice(2).join(' ') || 'No reason provided';
        await muteMember.timeout(muteTime * 60 * 1000, muteReason);
        const muteEmbed = createEmbed('🔇 Member Muted', 
            `**User:** ${muteMember.user.tag}\n**Duration:** ${muteTime} minutes\n**Reason:** ${muteReason}`, 0xFFAA00);
        message.channel.send({ embeds: [muteEmbed] });
    },

    unmute: async (message, args) => {
        if (!hasPermission(message.member, 'ModerateMembers')) {
            return message.reply('❌ You need the "Timeout Members" permission to use this command.');
        }
        const unmuteMember = message.mentions.members.first();
        if (!unmuteMember) return message.reply('❌ Please mention a user to unmute.');

        await unmuteMember.timeout(null);
        const unmuteEmbed = createEmbed('🔊 Member Unmuted', 
            `**User:** ${unmuteMember.user.tag}`, 0x00FF00);
        message.channel.send({ embeds: [unmuteEmbed] });
    },

    clear: async (message, args) => {
        if (!hasPermission(message.member, 'ManageMessages')) {
            return message.reply('❌ You need the "Manage Messages" permission to use this command.');
        }
        const amount = parseInt(args[0]) || 10;
        if (amount < 1 || amount > 100) return message.reply('❌ Please provide a number between 1 and 100.');

        const deleted = await message.channel.bulkDelete(amount + 1, true);
        const clearEmbed = createEmbed('🧹 Messages Cleared', 
            `Successfully deleted ${deleted.size - 1} messages.`, 0x00FF00);
        const clearMsg = await message.channel.send({ embeds: [clearEmbed] });
        setTimeout(() => clearMsg.delete().catch(() => {}), 3000);
    },

    warn: async (message, args) => {
        if (!hasPermission(message.member, 'KickMembers')) {
            return message.reply('❌ You need the "Kick Members" permission to use this command.');
        }
        const warnMember = message.mentions.members.first();
        if (!warnMember) return message.reply('❌ Please mention a user to warn.');

        const warnReason = args.slice(1).join(' ') || 'No reason provided';
        const warnEmbed = createEmbed('⚠️ Warning Issued', 
            `**User:** ${warnMember.user.tag}\n**Reason:** ${warnReason}\n**Moderator:** ${message.author.tag}`, 0xFFAA00);
        message.channel.send({ embeds: [warnEmbed] });

        try {
            await warnMember.send(`You have been warned in ${message.guild.name} for: ${warnReason}`);
        } catch (err) {
            message.channel.send('⚠️ Could not DM the user about their warning.');
        }
    }
};
