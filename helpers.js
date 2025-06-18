
const { EmbedBuilder } = require('discord.js');

function createEmbed(title, description, color = 0x00AE86) {
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setTimestamp();
}

function createHelpEmbed(prefix) {
    const helpEmbed = new EmbedBuilder()
        .setTitle('🤖 VibeBot Help Menu')
        .setDescription('**🌟 Welcome to VibeBot - Your Ultimate Discord Companion! 🌟**\n\nChoose a category below to explore commands:')
        .setColor(0x7289DA)
        .addFields(
            { name: '🛠️ Utility', value: `\`${prefix}help utility\`\nBasic bot utilities and info`, inline: true },
            { name: '🎮 Fun', value: `\`${prefix}help fun\`\nFun games and entertainment`, inline: true },
            { name: '👥 Social', value: `\`${prefix}help social\`\nSocial interactions and hugs`, inline: true },
            { name: '💰 Economy', value: `\`${prefix}help economy\`\nCoins, shop, and trading`, inline: true },
            { name: '💑 Couple', value: `\`${prefix}help couple\`\nMarriage and love system`, inline: true },
            { name: '👨‍👩‍👧‍👦 Family', value: `\`${prefix}help family\`\nFamily creation and management`, inline: true },
            { name: '🤖 AI Chat', value: `\`${prefix}help ai\`\nAI companions and chat`, inline: true },
            { name: '🎵 Music', value: `\`${prefix}help music\`\nMusic player and controls`, inline: true },
            { name: '🔨 Moderation', value: `\`${prefix}help moderation\`\nServer moderation tools`, inline: true },
            { name: '🎉 Special', value: `\`${prefix}help special\`\nGiveaways, polls, and more`, inline: true }
        )
        .setFooter({ text: `Use ${prefix}help <category> for detailed commands` });
    
    return helpEmbed;
}

function createCategoryHelp(category, prefix) {
    const categoryHelps = {
        utility: {
            title: '🛠️ Utility Commands',
            commands: [
                `\`${prefix}ping\` - Check bot latency`,
                `\`${prefix}about\` - Bot information`,
                `\`${prefix}userinfo [@user]\` - User information`,
                `\`${prefix}serverinfo\` - Server information`,
                `\`${prefix}avatar [@user]\` - Get user avatar`
            ]
        },
        fun: {
            title: '🎮 Fun Commands',
            commands: [
                `\`${prefix}roll [dice]\` - Roll dice`,
                `\`${prefix}8ball <question>\` - Magic 8-ball`,
                `\`${prefix}joke\` - Random joke`,
                `\`${prefix}quote\` - Inspirational quote`,
                `\`${prefix}uwu <text>\` - UwU-ify text`,
                `\`${prefix}wyr\` - Would you rather`
            ]
        },
        social: {
            title: '👥 Social Commands',
            commands: [
                `\`${prefix}hug [@user]\` - Hug someone`,
                `\`${prefix}kiss [@user]\` - Kiss someone`,
                `\`${prefix}pat [@user]\` - Pat someone`,
                `\`${prefix}poke [@user]\` - Poke someone`,
                `\`${prefix}dance\` - Dance party`,
                `\`${prefix}slap [@user]\` - Slap someone`,
                `\`${prefix}cry\` - Cry it out`,
                `\`${prefix}vibecheck [@user]\` - Check someone's vibe`,
                `\`${prefix}hugbomb\` - Hug everyone`,
                `\`${prefix}compliment [@user]\` - Give a compliment`,
                `\`${prefix}fakeban [@user]\` - Fake ban someone`,
                `\`${prefix}friendship [@user]\` - Check friendship level`,
                `\`${prefix}stab [@user]\` - Stab someone (playfully)`,
                `\`${prefix}kill [@user]\` - Kill someone (playfully)`
            ]
        },
        economy: {
            title: '💰 Economy Commands',
            commands: [
                `\`${prefix}balance\` - Check your balance`,
                `\`${prefix}daily\` - Daily bonus`,
                `\`${prefix}shop [category]\` - View shop`,
                `\`${prefix}inventory\` - View your items`,
                `\`${prefix}profile [@user]\` - View profile`,
                `\`${prefix}pay <@user> <amount>\` - Pay someone`,
                `\`${prefix}work\` - Work for money`,
                `\`${prefix}beg\` - Beg for money`,
                `\`${prefix}steal [@user]\` - Steal from someone`,
                `\`${prefix}pray\` - Pray for blessings`,
                `\`${prefix}gift <@user> <item>\` - Gift an item`,
                `\`${prefix}gamble <amount>\` - Gamble money`,
                `\`${prefix}slots <amount>\` - Play slots`,
                `\`${prefix}coinflip <amount> <h/t>\` - Flip a coin`,
                `\`${prefix}level [@user]\` - Check level`,
                `\`${prefix}leaderboard\` - Money leaderboard`,
                `\`${prefix}levelboard\` - Level leaderboard`
            ]
        },
        couple: {
            title: '💑 Couple Commands',
            commands: [
                `\`${prefix}marry <@user>\` - Propose marriage`,
                `\`${prefix}divorce\` - Get divorced`,
                `\`${prefix}couple [@user]\` - View couple info`,
                `\`${prefix}coupleadventure\` - Go on an adventure`,
                `\`${prefix}datenight\` - Plan a date night`,
                `\`${prefix}celebrate <type>\` - Celebrate together`,
                `\`${prefix}birthday\` - Celebrate birthday`,
                `\`${prefix}anniversary\` - Celebrate anniversary`
            ]
        },
        family: {
            title: '👨‍👩‍👧‍👦 Family Commands',
            commands: [
                `\`${prefix}family\` - View family`,
                `\`${prefix}adopt <@user>\` - Adopt someone`,
                `\`${prefix}pet [action]\` - Interact with pet`,
                `\`${prefix}familyadventure\` - Family adventure`
            ]
        },
        ai: {
            title: '🤖 AI Commands',
            commands: [
                `\`${prefix}chat <message>\` - Chat with AI`,
                `\`${prefix}chatbot <message>\` - Enhanced chatbot`,
                `\`${prefix}ai partner [message]\` - Chat with AI partner`,
                `\`${prefix}ai family [message]\` - Chat with AI family`,
                `\`${prefix}ai pet [message]\` - Chat with AI pet`
            ]
        },
        music: {
            title: '🎵 Music Commands',
            commands: [
                `\`${prefix}play <song>\` - Play music`,
                `\`${prefix}pause\` - Pause music`,
                `\`${prefix}resume\` - Resume music`,
                `\`${prefix}skip\` - Skip current song`,
                `\`${prefix}stop\` - Stop music`,
                `\`${prefix}queue\` - View queue`,
                `\`${prefix}nowplaying\` - Current song`,
                `\`${prefix}volume <1-100>\` - Set volume`,
                `\`${prefix}loop\` - Toggle loop`,
                `\`${prefix}shuffle\` - Shuffle queue`,
                `\`${prefix}clearqueue\` - Clear queue`
            ]
        },
        moderation: {
            title: '🔨 Moderation Commands',
            commands: [
                `\`${prefix}kick <@user> [reason]\` - Kick user`,
                `\`${prefix}ban <@user> [reason]\` - Ban user`,
                `\`${prefix}mute <@user> [time] [reason]\` - Mute user`,
                `\`${prefix}unmute <@user>\` - Unmute user`,
                `\`${prefix}clear <amount>\` - Clear messages`,
                `\`${prefix}warn <@user> [reason]\` - Warn user`
            ]
        },
        special: {
            title: '🎉 Special Commands',
            commands: [
                `\`${prefix}loveleaderboard\` - Love XP leaderboard`,
                `\`${prefix}familyleaderboard\` - Family XP leaderboard`,
                `\`${prefix}datefinder\` - Find potential dates`,
                `\`${prefix}announce <message>\` - Make announcement`,
                `\`${prefix}giveaway <time> <prize>\` - Start giveaway`,
                `\`${prefix}poll <question>\` - Create poll`,
                `\`${prefix}reactionrole\` - Setup reaction roles`
            ]
        }
    };

    const categoryData = categoryHelps[category];
    if (!categoryData) return null;

    const embed = createEmbed(categoryData.title, categoryData.commands.join('\n'), 0x7289DA);
    embed.setFooter({ text: `Use ${prefix}help to go back to main menu` });
    return embed;
}

module.exports = {
    createEmbed,
    createHelpEmbed,
    createCategoryHelp
};
