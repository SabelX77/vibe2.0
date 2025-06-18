
const { EmbedBuilder } = require('discord.js');

function createEmbed(title, description, color = 0x00AE86) {
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setTimestamp();
}

module.exports = {
    roll: async (message, args) => {
        const sides = parseInt(args[0]) || 6;
        if (sides < 2 || sides > 100) return message.reply('❌ Please provide a number between 2 and 100.');
        const roll = Math.floor(Math.random() * sides) + 1;
        const rollEmbed = createEmbed('🎲 Dice Roll', 
            `You rolled a **${roll}** out of ${sides}!`);
        message.channel.send({ embeds: [rollEmbed] });
    },

    '8ball': async (message, args) => {
        if (!args.length) return message.reply('❌ Please ask a question!');
        const responses = [
            'Yes, definitely!', 'No way!', 'Maybe...', 'Ask again later.',
            'Without a doubt!', 'Very doubtful.', 'Absolutely!', 'Don\'t count on it.',
            'Yes, in due time.', 'My sources say no.', 'Outlook good.',
            'Better not tell you now.', 'It is certain.', 'Reply hazy, try again.'
        ];
        const response = responses[Math.floor(Math.random() * responses.length)];
        const ballEmbed = createEmbed('🎱 Magic 8-Ball', 
            `**Question:** ${args.join(' ')}\n**Answer:** ${response}`);
        message.channel.send({ embeds: [ballEmbed] });
    },

    joke: async (message) => {
        const jokes = [
            'Why don\'t scientists trust atoms? Because they make up everything!',
            'Why did the scarecrow win an award? He was outstanding in his field!',
            'Why don\'t eggs tell jokes? They\'d crack each other up!',
            'What do you call a fake noodle? An impasta!',
            'Why did the math book look so sad? Because it had too many problems!',
            'What do you call a bear with no teeth? A gummy bear!',
            'Why can\'t a bicycle stand up by itself? It\'s two tired!',
            'What do you call a sleeping bull? A bulldozer!'
        ];
        const joke = jokes[Math.floor(Math.random() * jokes.length)];
        const jokeEmbed = createEmbed('😂 Random Joke', joke);
        message.channel.send({ embeds: [jokeEmbed] });
    },

    quote: async (message) => {
        const quotes = [
            'The only way to do great work is to love what you do. - Steve Jobs',
            'Innovation distinguishes between a leader and a follower. - Steve Jobs',
            'Life is what happens to you while you\'re busy making other plans. - John Lennon',
            'The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt',
            'It is during our darkest moments that we must focus to see the light. - Aristotle',
            'The way to get started is to quit talking and begin doing. - Walt Disney',
            'Don\'t let yesterday take up too much of today. - Will Rogers',
            'You learn more from failure than from success. Don\'t let it stop you. - Unknown'
        ];
        const quote = quotes[Math.floor(Math.random() * quotes.length)];
        const quoteEmbed = createEmbed('💭 Inspirational Quote', quote);
        message.channel.send({ embeds: [quoteEmbed] });
    },

    uwu: async (message, args) => {
        const uwuText = args.join(' ');
        if (!uwuText) return message.reply('❌ Please provide text to uwu-fy! Example: `sab!uwu Hello everyone`');

        let uwuified = uwuText.toLowerCase()
            .replace(/r/g, 'w')
            .replace(/l/g, 'w')
            .replace(/n([aeiou])/g, 'ny$1')
            .replace(/ove/g, 'uv')
            .replace(/!+/g, '~! 💖')
            .replace(/\?+/g, '~? 🥺');

        const uwuEmojis = ['(◡ ω ◡)', '(´• ω •`)', '(＞﹏＜)', '(˘▾˘)~', '(´｡• ᵕ •｡`)', 'owo', 'uwu', '>.<'];
        const randomUwuEmoji = uwuEmojis[Math.floor(Math.random() * uwuEmojis.length)];

        message.channel.send(`✨ **UwU Translator** ✨\n\n"${uwuified}~" ${randomUwuEmoji} 💕`);
    },

    wyr: async (message) => {
        const wyrQuestions = [
            'Would you rather have the ability to fly or be invisible?',
            'Would you rather always be 10 minutes late or 20 minutes early?',
            'Would you rather have unlimited pizza for life or unlimited tacos for life?',
            'Would you rather be able to speak all languages or talk to animals?',
            'Would you rather live without music or without movies?',
            'Would you rather have super strength or super speed?',
            'Would you rather never be able to use social media again or never watch another movie/TV show?',
            'Would you rather always have to sing instead of speak or dance everywhere you go?',
            'Would you rather live in a world of magic or a world of advanced technology?',
            'Would you rather be famous but poor or rich but unknown?',
            'Would you rather have the power to read minds or the power to see the future?',
            'Would you rather live underwater or in space?'
        ];
        const randomQuestion = wyrQuestions[Math.floor(Math.random() * wyrQuestions.length)];

        message.channel.send(`🤔 **Would You Rather?** 🤔\n\n${randomQuestion}\n\nReact with 1️⃣ for the first option or 2️⃣ for the second! 🤷‍♀️`);
    }
};
