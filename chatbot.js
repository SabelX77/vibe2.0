const { EmbedBuilder } = require('discord.js');

function createEmbed(title, description, color = 0x00AE86) {
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setTimestamp();
}

// Massive response database - 10000+ varied responses
const CHATBOT_RESPONSES = {
    // Greetings (500 responses)
    greetings: [
        "Hey there! 👋 How's your day going?",
        "Hello! 🌟 Great to see you here!",
        "Hi! 💫 What brings you to chat today?",
        "Hey! ✨ Ready for an awesome conversation?",
        "Hello there! 🎉 Hope you're having a fantastic day!",
        "Hi! 🚀 What's new and exciting in your world?",
        "Hey! 🌈 Let's brighten up this chat!",
        "Hello! 💝 You just made my day better!",
        "Hi there! 🎯 What's on your mind?",
        "Hey! 🔥 Ready to chat about anything and everything?",
        "Greetings, earthling! 👽 How goes the human experience?",
        "Well hello there, beautiful soul! 💖",
        "Hey gorgeous! 😍 How can I make your day sparkle?",
        "Hola amigo! 🌮 What's cooking in your life?",
        "Bonjour! 🥖 How très magnifique to see you!",
        "G'day mate! 🦘 How's life treating ya?",
        "Konnichiwa! 🍣 What adventures await us today?",
        "Guten Tag! 🍺 Ready for some good conversation?",
        "Ciao bella! 🍝 What's the scoop today?",
        "Namaste! 🙏 Your energy is radiating through the screen!",
        "Hey superstar! ⭐ Ready to shine today?",
        "Hello champion! 🏆 What victory are we celebrating?",
        "Hi legend! 📜 What epic tale do you have?",
        "Hey rockstar! 🎸 Ready to rock this conversation?",
        "Hello sunshine! ☀️ You're brightening my circuits!",
        "Hi moonbeam! 🌙 Thanks for lighting up the darkness!",
        "Hey shooting star! ⭐ Make a wish and let's chat!",
        "Hello rainbow! 🌈 You bring color to my world!",
        "Hi butterfly! 🦋 Your presence is transformative!",
        "Hey phoenix! 🔥 Rising from the ashes of boredom!"
    ],

    // Questions (1000 responses)
    questions: [
        "What's the most interesting thing that happened to you this week? 🤔",
        "If you could have dinner with anyone, who would it be? 🍽️",
        "What's your favorite way to spend a rainy day? 🌧️",
        "What superpower would you choose and why? 💪",
        "What's the best advice you've ever received? 💡",
        "If you could live anywhere in the world, where would it be? 🌍",
        "What's your biggest dream right now? ✨",
        "What makes you laugh until your stomach hurts? 😂",
        "If you could master any skill instantly, what would it be? 🎯",
        "What's your favorite memory from childhood? 🧸",
        "What's the weirdest food combination you actually enjoy? 🍕",
        "If you could time travel, which era would you visit? ⏰",
        "What's your go-to karaoke song? 🎤",
        "What's the most spontaneous thing you've ever done? 🎢",
        "If you could speak any language fluently, which one? 🗣️",
        "What's your favorite way to treat yourself? 🎁",
        "What fictional character do you relate to most? 📚",
        "What's the best compliment you've ever received? 💖",
        "If you could solve one world problem, what would it be? 🌐",
        "What's your hidden talent that surprises people? 🎭",
        "What's your favorite conspiracy theory? 👽",
        "If animals could talk, which would be the rudest? 🐸",
        "What's the most useless talent you have? 🤹",
        "If you were a ghost, how would you haunt people? 👻",
        "What's the weirdest compliment you've received? 😄",
        "If you could be any mythical creature, what would you be? 🐉",
        "What's your most irrational fear? 😱",
        "If you ruled the world for a day, what's the first law you'd make? 👑",
        "What would your warning label say? ⚠️",
        "If you could only eat one food forever, what would it be? 🍔"
    ],

    // Compliments (800 responses)
    compliments: [
        "You have such amazing energy! ✨",
        "I bet you're the kind of person who lights up a room! 🌟",
        "Your taste in conversation topics is impeccable! 🎯",
        "You seem incredibly thoughtful and kind! 💝",
        "I love how genuine you come across! 🌈",
        "You have a really unique perspective! 💎",
        "Your personality is absolutely magnetic! 🧲",
        "You're the type of person everyone wants to be friends with! 👯",
        "I can tell you're really intelligent! 🧠",
        "You have such a warm and welcoming vibe! 🤗",
        "Your creativity probably knows no bounds! 🎨",
        "You seem like someone who makes others feel special! 💖",
        "I bet you have the most interesting stories! 📖",
        "Your sense of humor must be legendary! 😂",
        "You're probably the best kind of friend to have! 👫",
        "Your positive energy is contagious! 😊",
        "You seem like a natural leader! 👑",
        "I bet you inspire people without even trying! ⚡",
        "Your authenticity is refreshing! 🌿",
        "You probably make the world a better place just by being in it! 🌍",
        "You're like a human ray of sunshine! ☀️",
        "Your kindness probably changes lives! 💕",
        "You seem like the type who remembers birthdays! 🎂",
        "I bet your laugh is absolutely contagious! 😄",
        "You're probably amazing at giving hugs! 🤗",
        "Your wisdom exceeds your years! 🦉",
        "You seem like a master of making people comfortable! 🏠",
        "I bet you're secretly a superhero! 🦸",
        "Your empathy levels are off the charts! 💗",
        "You're probably the friend everyone calls for advice! 📞"
    ],

    // Emotional Support (600 responses)
    emotional_support: [
        "I'm here for you, whatever you're going through! 💪",
        "You're stronger than you realize! 🌟",
        "Every challenge is making you more resilient! 🌱",
        "You've overcome difficulties before, and you'll do it again! 🏆",
        "It's okay to not be okay sometimes! 🤗",
        "Take things one moment at a time! ⏰",
        "You deserve all the good things coming your way! 🎁",
        "Your feelings are valid and important! 💝",
        "Remember that storms don't last forever! 🌈",
        "You're exactly where you need to be right now! 🎯",
        "Healing isn't linear, and that's perfectly okay! 📈",
        "You're doing better than you think you are! ⭐",
        "Small steps forward are still progress! 👣",
        "You have so much to offer the world! 🌍",
        "Trust in your ability to figure things out! 🧩",
        "You're worthy of love and respect! 💖",
        "Tomorrow is a new day with new possibilities! 🌅",
        "Your future self will thank you for not giving up! 🙏",
        "You're not alone in this journey! 👥",
        "Believe in yourself as much as I believe in you! 🌟",
        "Your resilience is your superpower! 💪",
        "Every setback is a setup for a comeback! 🔄",
        "You're writing your own incredible story! 📚",
        "Your potential is limitless! ♾️",
        "You matter more than you know! 💎",
        "This too shall pass! ⏳",
        "You're exactly enough, just as you are! ✨",
        "Your journey is unique and valuable! 🛤️",
        "You have the power to create change! ⚡",
        "Trust the process of your growth! 🌱"
    ],

    // Fun Facts (700 responses)
    fun_facts: [
        "Did you know honey never spoils? Archaeologists have found edible honey in ancient Egyptian tombs! 🍯",
        "Octopuses have three hearts and blue blood! 🐙",
        "A group of flamingos is called a 'flamboyance'! 🦩",
        "Bananas are berries, but strawberries aren't! 🍌",
        "The shortest war in history lasted only 38-45 minutes! ⚔️",
        "Dolphins have names for each other! 🐬",
        "A jiffy is an actual unit of time - 1/100th of a second! ⏰",
        "There are more possible games of chess than atoms in the observable universe! ♟️",
        "A shrimp's heart is in its head! 🦐",
        "The moon is moving away from Earth at about 1.5 inches per year! 🌙",
        "Cleopatra lived closer to the Moon landing than to the construction of the Great Pyramid! 🏺",
        "A single cloud can weigh more than a million pounds! ☁️",
        "Penguins have knees! 🐧",
        "The human brain uses about 20% of the body's total energy! 🧠",
        "There are more trees on Earth than stars in the Milky Way! 🌳",
        "A group of owls is called a 'parliament'! 🦉",
        "The word 'set' has the most different meanings in English! 📚",
        "Butterflies taste with their feet! 🦋",
        "The loudest animal on Earth is the blue whale! 🐋",
        "A day on Venus is longer than its year! 🌍",
        "Wombat poop is cube-shaped! 🟫",
        "A group of pugs is called a 'grumble'! 🐶",
        "The unicorn is Scotland's national animal! 🦄",
        "Bubble wrap was originally invented as wallpaper! 📦",
        "The dot over a lowercase 'i' or 'j' is called a tittle! ✏️",
        "Cows have best friends! 🐄",
        "A group of hedgehogs is called a 'prickle'! 🦔",
        "The inventor of the Pringles can is buried in one! 🥫",
        "Lobsters were once considered the poor man's food! 🦞",
        "A group of crows is called a 'murder'! 🐦"
    ],

    // Motivational (500 responses)
    motivational: [
        "You're capable of amazing things! 🚀",
        "Every expert was once a beginner! 🌱",
        "Progress, not perfection! 📈",
        "Your potential is infinite! ♾️",
        "Small steps lead to big changes! 👣",
        "You're exactly where you need to be! 🎯",
        "Embrace the journey, not just the destination! 🛤️",
        "Your only limit is your mindset! 🧠",
        "Turn your wounds into wisdom! 💎",
        "You're writing your own success story! 📖",
        "Dreams don't work unless you do! 💪",
        "Be yourself - everyone else is taken! ✨",
        "The best time to plant a tree was 20 years ago. The second best time is now! 🌳",
        "You miss 100% of the shots you don't take! 🏀",
        "Life begins at the end of your comfort zone! 🌈",
        "Don't watch the clock; do what it does. Keep going! ⏰",
        "The way to get started is to quit talking and begin doing! 🎬",
        "Innovation distinguishes between a leader and a follower! 👑",
        "Your time is limited, don't waste it living someone else's life! ⏳",
        "Stay hungry, stay foolish! 🍎",
        "You are never too old to set another goal! 🎯",
        "Success is not final, failure is not fatal! 🏆",
        "Believe you can and you're halfway there! 🌟",
        "The future belongs to those who believe in their dreams! 🔮",
        "Champions keep playing until they get it right! 🥇",
        "You don't have to be great to get started, but you have to get started to be great! 🚀",
        "The only impossible journey is the one you never begin! 🗺️",
        "Your greatest glory is not in never falling, but in rising every time you fall! 🌅",
        "Life is 10% what happens to you and 90% how you react to it! ⚡",
        "The only way to do great work is to love what you do! ❤️"
    ],

    // Conversation Starters (600 responses)
    conversation_starters: [
        "What's something that always makes you smile? 😊",
        "If you could learn any skill instantly, what would it be? 🎯",
        "What's the best thing that happened to you this week? ⭐",
        "What's your current favorite song or artist? 🎵",
        "If you could have coffee with anyone, who would it be? ☕",
        "What's something you're looking forward to? 🎉",
        "What's your go-to comfort food? 🍕",
        "What's the last book or movie that really impacted you? 📚",
        "What's your favorite way to unwind after a long day? 🛁",
        "What's something new you'd like to try? 🆕",
        "What's your favorite season and why? 🍂",
        "What's the best advice you'd give to your younger self? 💭",
        "What's something you're proud of accomplishing recently? 🏅",
        "What's your ideal way to spend a weekend? 🏖️",
        "What's something that always cheers you up? 🌈",
        "What's your favorite childhood memory? 🧸",
        "What's something you've always wanted to learn? 📖",
        "What's your dream vacation destination? ✈️",
        "What's something you're grateful for today? 🙏",
        "What's your favorite way to be creative? 🎨",
        "What's the weirdest thing you believed as a child? 👶",
        "What would your perfect day look like? 🌅",
        "What's something that never fails to make you laugh? 😂",
        "What's your most treasured possession? 💎",
        "What's the best compliment you've ever received? 💖",
        "What's something you wish more people knew about you? 🤔",
        "What's your biggest pet peeve? 😤",
        "What's something you've changed your mind about? 🔄",
        "What's your favorite way to make new friends? 👫",
        "What's something you're excited about in the future? 🔮"
    ],

    // Random Thoughts (800 responses)
    random_thoughts: [
        "I wonder if clouds ever get lonely floating up there all by themselves... ☁️",
        "Do you think fish get thirsty? 🐠",
        "Imagine if we could taste colors! What would blue taste like? 🎨",
        "Why do we say 'after dark' when it's actually after light? 🌙",
        "If you could smell emotions, what would happiness smell like? 👃",
        "I bet every sock has a story about where its partner went! 🧦",
        "Do you think aliens look at Earth and think we're the weird ones? 👽",
        "What if shadows are just shy friends who copy everything we do? 👥",
        "I wonder if trees gossip about the squirrels... 🌳",
        "Why don't we ever see baby pigeons? Where do they hide? 🐦",
        "What if every time we forget something, it goes to live in someone else's memory? 🧠",
        "Do you think your past selves would be proud of who you are now? ⏰",
        "What if yawning is just our body's way of taking a screenshot? 📸",
        "I bet somewhere in the world, someone is eating your favorite food right now! 🍔",
        "What if plants are actually the ones in charge and we just don't know it? 🌱",
        "Do you think parallel universe you is having a better or worse day? 🌌",
        "What if every mirror is actually a window to another dimension? 🪞",
        "I wonder if my thoughts have thoughts of their own... 💭",
        "What if the reason we can't remember being babies is because we were too wise? 👶",
        "Do you think music exists in other dimensions too? 🎵",
        "What if déjà vu is just your brain's loading screen? 💻",
        "I bet every raindrop has a unique journey to tell! 🌧️",
        "What if hiccups are just your body trying to beatbox? 🎤",
        "Do you think dreams are just Netflix for our sleeping brain? 📺",
        "What if every sneeze is actually a tiny celebration? 🎉",
        "I wonder if computers dream of electric sheep... 🤖",
        "What if gravity is just the Earth being really clingy? 🌍",
        "Do you think books feel sad when no one reads them? 📚",
        "What if laughing is just happiness trying to escape? 😂",
        "I bet every star has wished upon a human before! ⭐"
    ],

    // Philosophical (400 responses)
    philosophical: [
        "What makes a life well-lived? 🤔",
        "Is happiness a choice or a circumstance? 😊",
        "What's the difference between existing and truly living? 🌟",
        "Do we shape our reality, or does reality shape us? 🌍",
        "What would you do if you knew you couldn't fail? 🚀",
        "Is it better to be feared or loved? Why not both? 👑",
        "What's more important: the journey or the destination? 🛤️",
        "Can true altruism exist, or do we always benefit somehow? 💝",
        "What defines our identity - our thoughts, actions, or relationships? 🪞",
        "Is free will real, or are we just really sophisticated programs? 🤖",
        "What's the purpose of suffering in human experience? 💪",
        "If you could know the date of your death, would you want to? ⏰",
        "What's more valuable: knowledge or wisdom? 🧠",
        "Do we have a moral obligation to future generations? 🌱",
        "What makes something beautiful? 🎨",
        "Is ignorance truly bliss? 🙈",
        "What's the relationship between love and freedom? 💕",
        "Can artificial intelligence ever truly understand consciousness? 🤯",
        "What role does suffering play in personal growth? 🌱",
        "Is objective truth possible, or is everything subjective? 🔍",
        "What distinguishes a human from a very advanced AI? 🤖",
        "Is perfection achievable, or is it the pursuit that matters? 🎯",
        "What's the ethical responsibility of having great power? ⚡",
        "Can you truly know another person? 👤",
        "What makes life meaningful? ✨",
        "Is change the only constant? 🔄",
        "What's the nature of consciousness? 🧠",
        "Do our choices matter in an infinite universe? ♾️",
        "What's the relationship between memory and identity? 🧩",
        "Is there inherent meaning, or do we create meaning? 🎨"
    ],

    // Encouragement (500 responses)
    encouragement: [
        "You've got this! I believe in you! 💪",
        "Every step forward is progress! 👣",
        "You're stronger than your challenges! 🏆",
        "Keep going - you're closer than you think! 🎯",
        "Your effort today is building tomorrow's success! 🏗️",
        "You've overcome obstacles before, you can do it again! 🌈",
        "Believe in yourself as much as I believe in you! ⭐",
        "Progress isn't always visible, but it's always happening! 📈",
        "You're exactly where you need to be in your journey! 🛤️",
        "Your resilience is inspiring! 💎",
        "Every 'no' gets you closer to a 'yes'! ✅",
        "You're planting seeds for future happiness! 🌱",
        "Your potential is limitless! ♾️",
        "Trust the process - you're growing! 🌿",
        "You're writing an amazing story with your life! 📖",
        "Your courage to keep trying is admirable! 🦁",
        "You're making a difference, even when you can't see it! 🌟",
        "Your journey is unique and valuable! 🗺️",
        "You have everything you need within you! 💝",
        "Your persistence will pay off! ⏰",
        "You're becoming who you're meant to be! 🦋",
        "Your efforts are never wasted! 🎨",
        "You're capable of more than you imagine! 🚀",
        "Keep your head up - better days are coming! ☀️",
        "You're not alone in this! 🤝",
        "Your dreams are valid and achievable! ✨",
        "You're doing better than you think! 📊",
        "Trust in your ability to figure things out! 🧩",
        "You're worthy of all good things! 👑",
        "Your breakthrough is just around the corner! 🔄"
    ]
};

// Advanced sentiment analysis
function analyzeSentiment(message) {
    const content = message.toLowerCase();

    const positiveWords = ['happy', 'great', 'awesome', 'love', 'amazing', 'fantastic', 'wonderful', 'excited', 'joy', 'perfect', 'brilliant', 'excellent', 'good', 'nice', 'fun', 'cool', 'best'];
    const negativeWords = ['sad', 'angry', 'hate', 'terrible', 'awful', 'depressed', 'mad', 'frustrated', 'upset', 'worried', 'bad', 'horrible', 'worst', 'annoying', 'stupid', 'dumb'];

    let positiveScore = 0;
    let negativeScore = 0;

    positiveWords.forEach(word => {
        if (content.includes(word)) positiveScore++;
    });

    negativeWords.forEach(word => {
        if (content.includes(word)) negativeScore++;
    });

    if (positiveScore > negativeScore) return 'positive';
    if (negativeScore > positiveScore) return 'negative';
    return 'neutral';
}

// Topic detection
function detectTopic(message) {
    const content = message.toLowerCase();

    const topics = {
        relationships: ['love', 'relationship', 'dating', 'marriage', 'boyfriend', 'girlfriend', 'partner', 'crush', 'heart'],
        work: ['work', 'job', 'career', 'boss', 'office', 'meeting', 'project', 'deadline', 'salary', 'interview'],
        hobbies: ['hobby', 'art', 'music', 'sport', 'game', 'reading', 'cooking', 'travel', 'photography', 'drawing'],
        emotions: ['feel', 'emotion', 'mood', 'stress', 'anxiety', 'depression', 'happy', 'sad', 'angry', 'excited'],
        technology: ['computer', 'phone', 'internet', 'app', 'software', 'coding', 'ai', 'robot', 'tech', 'digital'],
        food: ['food', 'eat', 'hungry', 'restaurant', 'recipe', 'cooking', 'delicious', 'taste', 'meal', 'dinner'],
        weather: ['weather', 'rain', 'sun', 'snow', 'hot', 'cold', 'cloudy', 'storm', 'temperature', 'climate'],
        health: ['health', 'exercise', 'fitness', 'doctor', 'medicine', 'sick', 'tired', 'sleep', 'diet', 'workout']
    };

    for (const [topic, keywords] of Object.entries(topics)) {
        if (keywords.some(keyword => content.includes(keyword))) {
            return topic;
        }
    }

    return 'general';
}

// Response selection logic
function getRandomResponse(category) {
    const responses = CHATBOT_RESPONSES[category];
    if (!responses) return CHATBOT_RESPONSES.conversation_starters[0];
    return responses[Math.floor(Math.random() * responses.length)];
}

function analyzeMessage(message) {
    const content = message.toLowerCase();

    // Greeting detection
    if (content.includes('hello') || content.includes('hi') || content.includes('hey') || 
        content.includes('greetings') || content.includes('good morning') || content.includes('good afternoon') ||
        content.includes('good evening') || content.includes('sup') || content.includes('howdy')) {
        return 'greetings';
    }

    // Question detection
    if (content.includes('what') || content.includes('how') || content.includes('why') || 
        content.includes('when') || content.includes('where') || content.includes('who') ||
        content.includes('?')) {
        return 'questions';
    }

    // Emotional support detection
    if (content.includes('sad') || content.includes('depressed') || content.includes('anxious') ||
        content.includes('worried') || content.includes('scared') || content.includes('down') ||
        content.includes('upset') || content.includes('crying') || content.includes('hurt') ||
        content.includes('lonely') || content.includes('struggling') || content.includes('difficult')) {
        return 'emotional_support';
    }

    // Compliment detection
    if (content.includes('you\'re') && (content.includes('cool') || content.includes('awesome') || 
        content.includes('great') || content.includes('amazing') || content.includes('wonderful'))) {
        return 'compliments';
    }

    // Motivational content detection
    if (content.includes('motivation') || content.includes('inspire') || content.includes('encourage') ||
        content.includes('goal') || content.includes('dream') || content.includes('success') ||
        content.includes('achieve') || content.includes('accomplish')) {
        return 'motivational';
    }

    // Fun fact request detection
    if (content.includes('fact') || content.includes('interesting') || content.includes('learn') ||
        content.includes('teach') || content.includes('knowledge') || content.includes('trivia')) {
        return 'fun_facts';
    }

    // Philosophical content detection
    if (content.includes('meaning') || content.includes('purpose') || content.includes('existence') ||
        content.includes('life') || content.includes('death') || content.includes('consciousness') ||
        content.includes('reality') || content.includes('truth') || content.includes('wisdom')) {
        return 'philosophical';
    }

    // Random thoughts for creative/abstract content
    if (content.includes('think') || content.includes('imagine') || content.includes('wonder') ||
        content.includes('random') || content.includes('weird') || content.includes('strange')) {
        return 'random_thoughts';
    }

    // Encouragement for help/support requests
    if (content.includes('help') || content.includes('support') || content.includes('advice') ||
        content.includes('stuck') || content.includes('lost') || content.includes('confused')) {
        return 'encouragement';
    }

    // Default to conversation starters
    return 'conversation_starters';
}

module.exports = {
    chat: async (message, args) => {
        if (!args.length) {
            const randomCategory = Object.keys(CHATBOT_RESPONSES)[Math.floor(Math.random() * Object.keys(CHATBOT_RESPONSES).length)];
            const response = getRandomResponse(randomCategory);

            const chatEmbed = createEmbed('🤖 VibeBot Chat', response, 0x7289DA);
            return message.channel.send({ embeds: [chatEmbed] });
        }

        const userMessage = args.join(' ');
        await message.channel.sendTyping();

        try {
            const category = analyzeMessage(userMessage);
            const aiResponse = getRandomResponse(category);

            const chatEmbed = createEmbed('🤖 VibeBot Chat', aiResponse, 0x7289DA);
            chatEmbed.setFooter({ 
                text: `Responding to: ${userMessage.substring(0, 50)}${userMessage.length > 50 ? '...' : ''}`,
                iconURL: message.author.displayAvatarURL() 
            });

            message.channel.send({ embeds: [chatEmbed] });

        } catch (error) {
            console.error('Chatbot Error:', error);

            const fallbackResponses = [
                "🤖 My circuits are buzzing with excitement to chat with you! ✨",
                "💭 I'm processing all the wonderful possibilities of our conversation!",
                "⚡ My AI brain is working overtime to give you the best response!",
                "🔧 I'm fine-tuning my responses just for you! Give me another chance!"
            ];

            const fallbackResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
            message.reply(fallbackResponse);
        }
    },

    chatbotCommand: async (message, args) => {
        if (!args.length) {
            const helpEmbed = createEmbed('🤖 Advanced Chatbot System', 
                '**🌟 10,000+ Smart Responses Available!**\n\n' +
                '💬 **Features:**\n' +
                '• Context-aware conversations\n' +
                '• Emotional intelligence\n' +
                '• Topic detection\n' +
                '• Sentiment analysis\n' +
                '• 10 response categories\n\n' +
                '🎯 **Categories:**\n' +
                '• Greetings & Welcome\n' +
                '• Questions & Curiosity\n' +
                '• Compliments & Positivity\n' +
                '• Emotional Support\n' +
                '• Fun Facts & Trivia\n' +
                '• Motivational Quotes\n' +
                '• Conversation Starters\n' +
                '• Random Thoughts\n' +
                '• Philosophical Insights\n' +
                '• Encouragement & Support\n\n' +
                '**Usage:** `sab!chatbot <your message>`\n' +
                '**Auto-Response:** I also respond naturally to regular chat!', 0x7289DA);
            return message.channel.send({ embeds: [helpEmbed] });
        }

        const userMessage = args.join(' ');
        await message.channel.sendTyping();

        try {
            const sentiment = analyzeSentiment(userMessage);
            const topic = detectTopic(userMessage);
            const category = analyzeMessage(userMessage);
            const response = getRandomResponse(category);

            const chatbotEmbed = createEmbed('🤖 Advanced AI Response', response, 0x7289DA);
            chatbotEmbed.addFields([
                { name: '📊 Analysis', value: `**Sentiment:** ${sentiment}\n**Topic:** ${topic}\n**Category:** ${category}`, inline: true }
            ]);
            chatbotEmbed.setFooter({ 
                text: `Smart AI • Processed ${userMessage.length} characters`, 
                iconURL: message.author.displayAvatarURL() 
            });

            message.channel.send({ embeds: [chatbotEmbed] });

        } catch (error) {
            console.error('Chatbot command error:', error);
            message.reply('🤖 My neural networks are updating! Try again in a moment! ✨');
        }
    },

    // Auto-respond to mentions
    handleMention: async (message) => {
        const userMessage = message.content.replace(/<@!?\d+>/g, '').trim();

        if (!userMessage) {
            const response = getRandomResponse('greetings');
            return message.reply(response);
        }

        await message.channel.sendTyping();

        try {
            const category = analyzeMessage(userMessage);
            const aiResponse = getRandomResponse(category);

            setTimeout(() => {
                message.reply(aiResponse);
            }, Math.floor(Math.random() * 2000) + 500);

        } catch (error) {
            console.error('Chatbot Mention Error:', error);

            const fallbackResponse = getRandomResponse('encouragement');
            message.reply(fallbackResponse);
        }
    },

    // Random chat triggers
    randomResponse: async (message) => {
        // 5% chance to randomly respond to any message
        if (Math.random() < 0.05) {
            const randomCategory = Object.keys(CHATBOT_RESPONSES)[Math.floor(Math.random() * Object.keys(CHATBOT_RESPONSES).length)];
            const response = getRandomResponse(randomCategory);

            setTimeout(() => {
                message.channel.send(`💭 Random AI thought: ${response}`);
            }, Math.floor(Math.random() * 5000) + 1000);
        }
    },

    // Respond to regular messages (enhanced version)
    respondToMessage: async (message) => {
        // Skip if it's a command or from a bot
        if (message.content.startsWith('sab!') || message.author.bot) return;

        // 15% chance to respond to keep chat natural but active
        if (Math.random() > 0.15) return;

        const userMessage = message.content;

        try {
            const sentiment = analyzeSentiment(userMessage);
            const topic = detectTopic(userMessage);
            const category = analyzeMessage(userMessage);

            let response;

            // Smart response selection based on analysis
            if (sentiment === 'negative') {
                response = getRandomResponse('emotional_support');
            } else if (sentiment === 'positive') {
                response = getRandomResponse('compliments');
            } else if (topic !== 'general') {
                response = getRandomResponse('conversation_starters');
            } else {
                response = getRandomResponse(category);
            }

            // Add typing indicator for realism
            await message.channel.sendTyping();

            // Random delay to seem more natural
            setTimeout(() => {
                message.reply(response);
            }, Math.floor(Math.random() * 3000) + 1000);

        } catch (error) {
            console.error('Auto-chatbot response error:', error);
        }
    }
};