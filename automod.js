
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

const badWords = ['badword1', 'badword2', 'badword3', 'spam', 'toxic'];
const recentMessages = new Map();

function createEmbed(title, description, color = 0x00AE86) {
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setTimestamp();
}

function canDeleteMessage(message) {
    return message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages);
}

async function handleBadWords(message) {
    if (badWords.some(word => message.content.toLowerCase().includes(word))) {
        try {
            if (canDeleteMessage(message)) {
                await message.delete();
                const embed = createEmbed('⚠️ Language Warning', `${message.author}, please watch your language!`, 0xFF6B6B);
                const warningMsg = await message.channel.send({ embeds: [embed] });
                setTimeout(() => warningMsg.delete().catch(() => {}), 5000);
            } else {
                const embed = createEmbed('⚠️ Language Warning', `${message.author}, please watch your language! (I lack permission to delete messages)`, 0xFF6B6B);
                message.reply({ embeds: [embed] });
            }
        } catch (err) {
            console.error('Failed to handle bad word:', err);
        }
        return true;
    }
    return false;
}

async function handleSpam(message) {
    const userId = message.author.id;
    const currentTime = Date.now();
    const messageContent = message.content.toLowerCase().trim();

    if (!recentMessages.has(userId)) {
        recentMessages.set(userId, []);
    }

    const userMessages = recentMessages.get(userId);
    const recentUserMessages = userMessages.filter(msg => currentTime - msg.timestamp < 5000);
    const duplicateMessages = recentUserMessages.filter(msg => msg.content === messageContent);

    if (duplicateMessages.length >= 2) {
        try {
            if (canDeleteMessage(message)) {
                await message.delete();
                const embed = createEmbed('🛑 Spam Detected', `${message.author}, please don't spam!`, 0xFF6B6B);
                const spamMsg = await message.channel.send({ embeds: [embed] });
                setTimeout(() => spamMsg.delete().catch(() => {}), 3000);
            } else {
                const embed = createEmbed('🛑 Spam Detected', `${message.author}, please don't spam! (I lack permission to delete messages)`, 0xFF6B6B);
                message.reply({ embeds: [embed] });
            }
        } catch (err) {
            console.error('Failed to handle spam:', err);
        }
        return true;
    }

    recentUserMessages.push({
        content: messageContent,
        timestamp: currentTime
    });

    recentMessages.set(userId, recentUserMessages);
    return false;
}

module.exports = {
    handleBadWords,
    handleSpam
};
