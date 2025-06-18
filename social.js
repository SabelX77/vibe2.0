const { createEmbed } = require('../utils/helpers.js');

module.exports = {
    hug: async (message) => {
        const hugTarget = message.mentions.users.first();
        if (!hugTarget) return message.reply('❌ Please mention someone to hug!');
        if (hugTarget.id === message.author.id) return message.reply('❌ You can\'t hug yourself!');

        const hugGifs = [
            'https://media.tenor.com/UQQMSLy8A-4AAAAM/anime-hug.gif',
            'https://media.tenor.com/P_qLCNJdUE0AAAAM/anime-hug.gif',
            'https://media.tenor.com/0ZIjkJvPcQIAAAAM/anime-hug.gif',
            'https://media.tenor.com/6rBNvdNdJAYAAAAM/anime-hug.gif',
            'https://media.tenor.com/Rw1YjGfmjZcAAAAM/anime-hug.gif'
        ];
        const randomHugGif = hugGifs[Math.floor(Math.random() * hugGifs.length)];
        message.channel.send(`🤗 ${message.author} gave ${hugTarget} a warm hug! 💕\n${randomHugGif}`);
    },

    kiss: async (message) => {
        const kissTarget = message.mentions.users.first();
        if (!kissTarget) return message.reply('❌ Please mention someone to kiss!');
        if (kissTarget.id === message.author.id) return message.reply('❌ You can\'t kiss yourself!');

        const kissGifs = [
            'https://media.tenor.com/gUiu1zyxfzYAAAAM/anime-kiss.gif',
            'https://media.tenor.com/TKpmh4WFEsAAAAAM/darling-in-the-franxx-zero-two.gif',
            'https://media.tenor.com/3OQAuTBmzYoAAAAM/anime-kiss.gif',
            'https://media.tenor.com/KZKXnBbrNYoAAAAM/anime-kiss.gif'
        ];
        const randomKissGif = kissGifs[Math.floor(Math.random() * kissGifs.length)];
        message.channel.send(`💋 ${message.author} gave ${kissTarget} a sweet kiss! 😘\n${randomKissGif}`);
    },

    pat: async (message) => {
        const patTarget = message.mentions.users.first();
        if (!patTarget) return message.reply('❌ Please mention someone to pat!');
        if (patTarget.id === message.author.id) return message.reply('❌ You can\'t pat yourself!');

        const patGifs = [
            'https://media.tenor.com/ZXxbMHqWmVYAAAAM/anime-head-pat.gif',
            'https://media.tenor.com/7x_BzXCZaGMAAAAM/anime-pat.gif',
            'https://media.tenor.com/1wGYJy88WogAAAAM/anime-pat.gif',
            'https://media.tenor.com/cJ4CheVJWMwAAAAM/anime-pat.gif'
        ];
        const randomPatGif = patGifs[Math.floor(Math.random() * patGifs.length)];
        message.channel.send(`🤚 ${message.author} gently patted ${patTarget}'s head! *pat pat* 😊\n${randomPatGif}`);
    },

    poke: async (message) => {
        const pokeTarget = message.mentions.users.first();
        if (!pokeTarget) return message.reply('❌ Please mention someone to poke!');
        if (pokeTarget.id === message.author.id) return message.reply('❌ You can\'t poke yourself!');

        const pokeGifs = [
            'https://media.tenor.com/LUIxlrO28YEAAAAM/anime-poke.gif',
            'https://media.tenor.com/F0o_vl8m5HMAAAAM/anime-poke.gif',
            'https://media.tenor.com/1xJSkBuLdPYAAAAM/anime-poke.gif'
        ];
        const randomPokeGif = pokeGifs[Math.floor(Math.random() * pokeGifs.length)];
        message.channel.send(`👉 ${message.author} poked ${pokeTarget}! *poke* 😋\n${randomPokeGif}`);
    },

    dance: async (message) => {
        const danceGifs = [
            'https://media.tenor.com/4Y-rZoG3D7kAAAAM/anime-dance.gif',
            'https://media.tenor.com/sX7JcOW8hN0AAAAM/anime-dance.gif',
            'https://media.tenor.com/QLzjxbJqeOsAAAAM/anime-dance.gif'
        ];
        const randomDanceGif = danceGifs[Math.floor(Math.random() * danceGifs.length)];
        message.channel.send(`💃 ${message.author} is dancing! 🕺\n${randomDanceGif}`);
    },

    slap: async (message) => {
        const slapTarget = message.mentions.users.first();
        if (!slapTarget) return message.reply('❌ Please mention someone to slap!');
        if (slapTarget.id === message.author.id) return message.reply('❌ You can\'t slap yourself!');

        const slapGifs = [
            'https://media.tenor.com/ORKIszw5E-cAAAAM/anime-slap.gif',
            'https://media.tenor.com/w0BAvT60HjEAAAAM/anime-slap.gif',
            'https://media.tenor.com/YqZjb0G8i_8AAAAM/anime-slap.gif'
        ];
        const randomSlapGif = slapGifs[Math.floor(Math.random() * slapGifs.length)];
        message.channel.send(`👋 ${message.author} slapped ${slapTarget}! *SLAP* 😤\n${randomSlapGif}`);
    },

    cry: async (message) => {
        const cryGifs = [
            'https://media.tenor.com/VsVXjLz3b3UAAAAM/anime-cry.gif',
            'https://media.tenor.com/SfJsP8EqOzkAAAAM/anime-cry.gif',
            'https://media.tenor.com/7WYF3v3Jg_YAAAAM/anime-cry.gif'
        ];
        const randomCryGif = cryGifs[Math.floor(Math.random() * cryGifs.length)];
        message.channel.send(`😭 ${message.author} is crying! 💧\n${randomCryGif}`);
    },

    vibecheck: async (message) => {
        const vibes = [
            'Your vibes are immaculate! ✨',
            'Vibes are questionable... 🤔',
            'Major good vibes detected! 🌟',
            'Chaotic energy, but we love it! 🌪️',
            'Absolutely radiating positive energy! ☀️',
            'Mysterious vibes... interesting! 🌙',
            'Pure wholesome energy! 💕',
            'Spicy vibes detected! 🌶️'
        ];
        const randomVibe = vibes[Math.floor(Math.random() * vibes.length)];
        const vibeEmbed = createEmbed('🔮 Vibe Check', `${message.author}, ${randomVibe}`);
        message.channel.send({ embeds: [vibeEmbed] });
    },

    hugbomb: async (message) => {
        const hugBombGifs = [
            'https://media.tenor.com/9gCTkLUz1TQAAAAM/anime-group-hug.gif',
            'https://media.tenor.com/Wfe_gKJEMAMAAAAM/anime-hug.gif',
            'https://media.tenor.com/k4aaF2N_2vYAAAAM/anime-hug.gif'
        ];
        const randomHugBombGif = hugBombGifs[Math.floor(Math.random() * hugBombGifs.length)];
        message.channel.send(`💥🤗 ${message.author} deployed a HUG BOMB! Everyone gets hugs! 🤗💥\n${randomHugBombGif}`);
    },

    compliment: async (message) => {
        const target = message.mentions.users.first() || message.author;
        const compliments = [
            'You have an amazing smile that lights up the room! 😊',
            'Your positive energy is absolutely contagious! ✨',
            'You\'re incredibly thoughtful and kind! 💕',
            'You have such a wonderful sense of humor! 😄',
            'Your creativity never ceases to amaze me! 🎨',
            'You\'re a great listener and friend! 👂',
            'You always know how to make people feel better! 🌟',
            'Your determination is truly inspiring! 💪'
        ];
        const randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];
        const complimentEmbed = createEmbed('💝 Compliment', `${target}, ${randomCompliment}`);
        message.channel.send({ embeds: [complimentEmbed] });
    },

    fakeban: async (message) => {
        const banTarget = message.mentions.users.first();
        if (!banTarget) return message.reply('❌ Please mention someone to fake ban!');
        if (banTarget.id === message.author.id) return message.reply('❌ You can\'t ban yourself!');

        const banEmbed = createEmbed('🔨 Ban Hammer', 
            `${banTarget} has been banned for being too awesome! 😎\n\n*Just kidding! This is a fake ban! 😄*`, 
            0xFF0000);
        message.channel.send({ embeds: [banEmbed] });
    },

    friendship: async (message) => {
        const friend = message.mentions.users.first();
        if (!friend) return message.reply('❌ Please mention someone to check friendship with!');
        if (friend.id === message.author.id) return message.reply('❌ You can\'t check friendship with yourself!');

        const friendshipLevels = [
            'Strangers 😐',
            'Acquaintances 🙂',
            'Friends 😊',
            'Good Friends 😄',
            'Best Friends 🥰',
            'BFFFs (Best Friends Forever & Forever) 💕',
            'Soul Mates 💫',
            'Partners in Crime 😈',
            'Inseparable Duo 👫'
        ];

        const friendshipPercentage = Math.floor(Math.random() * 101);
        const levelIndex = Math.floor(friendshipPercentage / 11.11);
        const level = friendshipLevels[Math.min(levelIndex, friendshipLevels.length - 1)];

        const friendshipEmbed = createEmbed('💝 Friendship Meter', 
            `Friendship between ${message.author} and ${friend}:\n\n` +
            `**${friendshipPercentage}%** - ${level}\n\n` +
            `${friendshipPercentage > 80 ? '🌟 Amazing friendship!' : 
              friendshipPercentage > 60 ? '😊 Great friendship!' : 
              friendshipPercentage > 40 ? '🙂 Good friendship!' : 
              '😐 Could be better...'}`, 0xFF69B4);

        message.channel.send({ embeds: [friendshipEmbed] });
    },

    stab: async (message) => {
        const target = message.mentions.users.first() || message.author;
        const stabGifs = [
            'https://media.tenor.com/VIOGUieNNUEAAAAM/anime-stab.gif',
            'https://media.tenor.com/2Q8Q8Q8Q8Q8AAAAM/stab-knife.gif',
            'https://media.tenor.com/3R9R9R9R9R9AAAAM/anime-sword.gif',
            'https://media.tenor.com/4S0S0S0S0S0AAAAM/stab-attack.gif',
            'https://media.tenor.com/5T1T1T1T1T1AAAAM/anime-fight.gif'
        ];

        const stabMessages = [
            `🗡️ **${message.author.username}** dramatically stabs **${target.username}**! *It's just a flesh wound!* 💀`,
            `⚔️ **${message.author.username}** pulls out a sword and stabs **${target.username}**! *Respawn in 3... 2... 1...* 🔄`,
            `🔪 **${message.author.username}** sneakily stabs **${target.username}**! *Critical hit!* ⚡`,
            `🗡️ **${message.author.username}** stabs **${target.username}** with the power of friendship! *It's super effective!* ✨`,
            `⚔️ **${message.author.username}** stabs **${target.username}**! *Don't worry, it's made of foam!* 🎭`
        ];

        const randomGif = stabGifs[Math.floor(Math.random() * stabGifs.length)];
        const randomMessage = stabMessages[Math.floor(Math.random() * stabMessages.length)];

        const stabEmbed = createEmbed('🗡️ Stab Attack!', randomMessage, 0xFF4444);
        stabEmbed.setImage(randomGif);

        message.channel.send({ embeds: [stabEmbed] });
    },

    kill: async (message) => {
        const target = message.mentions.users.first() || message.author;
        const killGifs = [
            'https://media.tenor.com/6U2U2U2U2U2AAAAM/anime-death.gif',
            'https://media.tenor.com/7V3V3V3V3V3AAAAM/dramatic-death.gif',
            'https://media.tenor.com/8W4W4W4W4W4AAAAM/anime-kill.gif',
            'https://media.tenor.com/9X5X5X5X5X5AAAAM/death-scene.gif',
            'https://media.tenor.com/0Y6Y6Y6Y6Y6AAAAM/game-over.gif'
        ];

        const killMessages = [
            `💀 **${message.author.username}** has eliminated **${target.username}**! *Game Over!* 🎮`,
            `⚰️ **${message.author.username}** sends **${target.username}** to the shadow realm! *You died!* 👻`,
            `💀 **${message.author.username}** defeats **${target.username}** in epic battle! *Fatality!* ⚡`,
            `🔥 **${message.author.username}** destroys **${target.username}**! *Respawning at checkpoint...* 🔄`,
            `💀 **${message.author.username}** kills **${target.username}** with kindness! *Too wholesome to handle!* 💖`,
            `⚰️ **${message.author.username}** ends **${target.username}**'s career! *Press F to pay respects!* F`
        ];

        const randomGif = killGifs[Math.floor(Math.random() * killGifs.length)];
        const randomMessage = killMessages[Math.floor(Math.random() * killMessages.length)];

        const killEmbed = createEmbed('💀 Elimination!', randomMessage, 0x800080);
        killEmbed.setImage(randomGif);

        message.channel.send({ embeds: [killEmbed] });
    },

    // Add more social interaction commands here as needed
};