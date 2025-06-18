
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const EconomySystem = require('./economy.js');
const { handleBadWords, handleSpam } = require('./utils/automod.js');
const { createEmbed, createHelpEmbed, createCategoryHelp } = require('./utils/helpers.js');

// Command modules
const moderationCommands = require('./commands/moderation.js');
const utilityCommands = require('./commands/utility.js');
const funCommands = require('./commands/fun.js');
const socialCommands = require('./commands/social.js');
const economyCommands = require('./commands/economy.js');
const aiCommands = require('./commands/ai.js');
const musicCommands = require('./commands/music.js');
const specialCommands = require('./commands/special.js');
const chatbotCommands = require('./commands/chatbot.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildVoiceStates
    ],
    partials: [Partials.Channel]
});

const token = "MTM4NDQ5NjI5MTY2NDYyOTg2MQ.GnHWZl.nhbWgrh9L9NLZ3dQUFU5a2cOdm_YK4i2S-F024";
const prefix = 'sab!';

// Initialize Economy System
const economy = new EconomySystem();

// Dead chat checker
let lastMessageTime = new Map();
const DEAD_CHAT_TIMEOUT = 45 * 60 * 1000; // 45 minutes

client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
    console.log(`📊 Serving ${client.guilds.cache.size} servers`);
    client.user.setActivity('sab!help for commands', { type: 3 }); // 3 = WATCHING
    
    // Start dead chat checker
    setInterval(() => {
        client.guilds.cache.forEach(guild => {
            const generalChannel = guild.channels.cache.find(ch => 
                ch.name.includes('general') || ch.name.includes('chat') || ch.type === 0
            );
            
            if (generalChannel && lastMessageTime.has(guild.id)) {
                const timeSinceLastMessage = Date.now() - lastMessageTime.get(guild.id);
                
                if (timeSinceLastMessage >= DEAD_CHAT_TIMEOUT) {
                    const deadChatGifs = [
                        'https://media.tenor.com/1234567890/dead-chat.gif',
                        'https://media.tenor.com/abcdefghij/wake-up.gif',
                        'https://media.tenor.com/0987654321/revive.gif'
                    ];
                    const randomGif = deadChatGifs[Math.floor(Math.random() * deadChatGifs.length)];
                    
                    const deadChatMessages = [
                        `@here 💀 **DEAD CHAT DETECTED!** 💀\n\nIt's been 45 minutes since the last message! Time to revive this chat! 🧟‍♂️✨\n${randomGif}`,
                        `@here 🌙 **Chat's gone quiet...** 🌙\n\nWake up everyone! Let's get this chat buzzing again! ⚡🎉\n${randomGif}`,
                        `@here 🔔 **CHAT REVIVAL NEEDED!** 🔔\n\nThis place is quieter than a library! Someone say something! 📢💫\n${randomGif}`
                    ];
                    
                    const randomMessage = deadChatMessages[Math.floor(Math.random() * deadChatMessages.length)];
                    generalChannel.send(randomMessage);
                    lastMessageTime.delete(guild.id);
                }
            }
        });
    }, 5 * 60 * 1000);
});

// Handle reaction role events
client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) return;
    
    // Handle reaction roles
    const { reactionRoles } = require('./commands/special.js');
    if (reactionRoles && reactionRoles.has && reactionRoles.has(reaction.message.id)) {
        const rrData = reactionRoles.get(reaction.message.id);
        const roleId = rrData.roles[reaction.emoji.name] || rrData.roles[reaction.emoji.id];
        
        if (roleId) {
            try {
                const guild = reaction.message.guild;
                const member = await guild.members.fetch(user.id);
                const role = guild.roles.cache.get(roleId);
                
                if (role && !member.roles.cache.has(roleId)) {
                    await member.roles.add(role);
                    user.send(`✅ You've been given the **${role.name}** role in **${guild.name}**!`).catch(() => {});
                }
            } catch (error) {
                console.log('Error adding reaction role:', error);
            }
        }
    }
});

client.on('messageReactionRemove', async (reaction, user) => {
    if (user.bot) return;
    
    // Handle reaction role removal
    const { reactionRoles } = require('./commands/special.js');
    if (reactionRoles && reactionRoles.has && reactionRoles.has(reaction.message.id)) {
        const rrData = reactionRoles.get(reaction.message.id);
        const roleId = rrData.roles[reaction.emoji.name] || rrData.roles[reaction.emoji.id];
        
        if (roleId) {
            try {
                const guild = reaction.message.guild;
                const member = await guild.members.fetch(user.id);
                const role = guild.roles.cache.get(roleId);
                
                if (role && member.roles.cache.has(roleId)) {
                    await member.roles.remove(role);
                    user.send(`❌ The **${role.name}** role has been removed from you in **${guild.name}**.`).catch(() => {});
                }
            } catch (error) {
                console.log('Error removing reaction role:', error);
            }
        }
    }
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    // Update last message time for dead chat checker
    lastMessageTime.set(message.guild.id, Date.now());

    // Update last message time for random AI characters
    economy.updateLastMessageTime(message.guild.id);

    // Add XP for chatting (non-command messages)
    if (!message.content.startsWith(prefix)) {
        const xpResult = economy.addUserXP(message.author.id, Math.floor(Math.random() * 10) + 5);
        if (xpResult.leveledUp) {
            const levelUpGifs = [
                'https://media.tenor.com/B8Q7jN6kJOUAAAAM/level-up-mario.gif',
                'https://media.tenor.com/p2VY3gBELp8AAAAM/level-up-gaming.gif',
                'https://media.tenor.com/Hb8kQjRG0kYAAAAM/level-up-achievement.gif'
            ];
            const randomGif = levelUpGifs[Math.floor(Math.random() * levelUpGifs.length)];
            
            let levelUpDescription = `🎊 Congratulations ${message.author}! You've reached **Level ${xpResult.newLevel}**! 🎊\n\n`;
            
            if (xpResult.newPerks && Object.keys(xpResult.newPerks).length > 0) {
                levelUpDescription += `🎁 **New Perks Unlocked:**\n`;
                if (xpResult.newPerks.roles) {
                    levelUpDescription += `🎭 **Roles:** ${xpResult.newPerks.roles.join(', ')}\n`;
                }
                if (xpResult.newPerks.perks) {
                    levelUpDescription += `⚡ **Benefits:** ${xpResult.newPerks.perks.join(', ')}\n`;
                }
                if (xpResult.newPerks.badges) {
                    levelUpDescription += `🏅 **Badges:** ${xpResult.newPerks.badges.join(' ')}\n`;
                }
                levelUpDescription += `\n`;
            }
            
            const levelUpEmbed = createEmbed('🎉 Level Up!', levelUpDescription, 0xFFD700);
            levelUpEmbed.setImage(randomGif);
            message.channel.send({ embeds: [levelUpEmbed] });
        }

        // Check for random AI character trigger
        const randomAI = economy.shouldTriggerRandomAI(message.guild.id);
        if (randomAI) {
            const randomMessage = randomAI.messages[Math.floor(Math.random() * randomAI.messages.length)];
            
            setTimeout(() => {
                message.channel.send(randomMessage);
            }, Math.floor(Math.random() * 3000) + 1000); // Random delay 1-4 seconds
        }
    }

    // Check if bot is mentioned for AI response
    if (message.mentions.has(client.user) && !message.content.startsWith(prefix)) {
        return await chatbotCommands.handleMention(message);
    }

    // Enhanced chatbot responses
    if (!message.content.startsWith(prefix)) {
        await chatbotCommands.randomResponse(message);
        await chatbotCommands.respondToMessage(message);
    }

    // AutoMod checks
    const hasBadWords = await handleBadWords(message);
    if (hasBadWords) return;

    if (!message.content.startsWith(prefix)) {
        const isSpam = await handleSpam(message);
        if (isSpam) return;
        
        // Advanced chatbot responses to regular messages
        await chatbotCommands.respondToMessage(message);
        return;
    }

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    let command = args.shift().toLowerCase();
    
    // Check for command shortcuts
    const shortcutCommand = economy.getCommandShortcut(command);
    if (shortcutCommand) {
        command = shortcutCommand;
    }

    try {
        // Command routing
        switch (command) {
            // General Commands
            case 'help':
                if (args[0]) {
                    const categoryHelp = createCategoryHelp(args[0].toLowerCase(), prefix);
                    if (categoryHelp) {
                        message.channel.send({ embeds: [categoryHelp] });
                    } else {
                        message.reply(`❌ Category "${args[0]}" not found! Use \`${prefix}help\` to see available categories.`);
                    }
                } else {
                    const helpEmbed = createHelpEmbed(prefix);
                    message.channel.send({ embeds: [helpEmbed] });
                }
                break;

            case 'hello':
                const helloEmbed = createEmbed('👋 Hello!', `Hello ${message.author}! Nice to meet you!`);
                message.channel.send({ embeds: [helloEmbed] });
                break;

            // AI Commands
            case 'chat':
                await aiCommands.chat(message, args);
                break;
            case 'chatbot':
                await chatbotCommands.chatbotCommand(message, args);
                break;
            case 'ai':
                const aiType = args[0];
                if (aiType === 'partner') {
                    if (args[1]) {
                        await aiCommands.aiPartnerChat(message, args.slice(1), economy, 'partner');
                    } else {
                        await aiCommands.partner(message, args.slice(1), economy);
                    }
                } else if (aiType === 'family') {
                    if (args[1]) {
                        await aiCommands.aiPartnerChat(message, args.slice(1), economy, 'family');
                    } else {
                        await aiCommands.family(message, args.slice(1), economy);
                    }
                } else if (aiType === 'pet') {
                    if (args[1]) {
                        await aiCommands.aiPartnerChat(message, args.slice(1), economy, 'pet');
                    } else {
                        await aiCommands.pet(message, args.slice(1), economy);
                    }
                } else {
                    message.reply('❌ Usage: `sab!ai partner/family/pet [message]`');
                }
                break;

            // Music Commands
            case 'play':
            case 'p':
                await musicCommands.play(message, args);
                break;
            case 'pause':
                await musicCommands.pause(message);
                break;
            case 'resume':
            case 'unpause':
                await musicCommands.resume(message);
                break;
            case 'skip':
            case 'next':
                await musicCommands.skip(message);
                break;
            case 'stop':
            case 'disconnect':
                await musicCommands.stop(message);
                break;
            case 'queue':
            case 'q':
                await musicCommands.queue(message);
                break;
            case 'nowplaying':
            case 'np':
            case 'current':
                await musicCommands.nowplaying(message);
                break;
            case 'volume':
            case 'vol':
                await musicCommands.volume(message, args);
                break;
            case 'loop':
            case 'repeat':
                await musicCommands.loop(message);
                break;
            case 'shuffle':
            case 'random':
                await musicCommands.shuffle(message);
                break;
            case 'clearqueue':
                await musicCommands.clear(message);
                break;

            // Utility Commands
            case 'ping':
                await utilityCommands.ping(message, client);
                break;
            case 'about':
                await utilityCommands.about(message, client, prefix);
                break;
            case 'userinfo':
                await utilityCommands.userinfo(message);
                break;
            case 'serverinfo':
                await utilityCommands.serverinfo(message);
                break;
            case 'avatar':
                await utilityCommands.avatar(message);
                break;

            // Moderation Commands
            case 'kick':
                await moderationCommands.kick(message, args);
                break;
            case 'ban':
                await moderationCommands.ban(message, args);
                break;
            case 'mute':
                await moderationCommands.mute(message, args);
                break;
            case 'unmute':
                await moderationCommands.unmute(message, args);
                break;
            case 'clear':
                await moderationCommands.clear(message, args);
                break;
            case 'warn':
                await moderationCommands.warn(message, args);
                break;

            // Fun Commands
            case 'roll':
                await funCommands.roll(message, args);
                break;
            case '8ball':
                await funCommands['8ball'](message, args);
                break;
            case 'joke':
                await funCommands.joke(message);
                break;
            case 'quote':
                await funCommands.quote(message);
                break;
            case 'uwu':
                await funCommands.uwu(message, args);
                break;
            case 'wyr':
                await funCommands.wyr(message);
                break;

            // Social Commands
            case 'hug':
                await socialCommands.hug(message);
                // Add love XP for married couples
                const hugTarget = message.mentions.users.first();
                if (hugTarget && economy.isMarried(message.author.id) && economy.getSpouse(message.author.id) === hugTarget.id) {
                    economy.addLoveXP(message.author.id, 15);
                    economy.addLoveXP(hugTarget.id, 15);
                }
                break;
            case 'kiss':
                await socialCommands.kiss(message);
                // Add love XP for married couples
                const kissTarget = message.mentions.users.first();
                if (kissTarget && economy.isMarried(message.author.id) && economy.getSpouse(message.author.id) === kissTarget.id) {
                    economy.addLoveXP(message.author.id, 20);
                    economy.addLoveXP(kissTarget.id, 20);
                }
                break;
            case 'pat':
                await socialCommands.pat(message);
                break;
            case 'poke':
                await socialCommands.poke(message);
                break;
            case 'dance':
                await socialCommands.dance(message);
                break;
            case 'slap':
                await socialCommands.slap(message);
                break;
            case 'cry':
                await socialCommands.cry(message);
                break;
            case 'vibecheck':
                await socialCommands.vibecheck(message);
                break;
            case 'hugbomb':
                await socialCommands.hugbomb(message);
                break;
            case 'compliment':
                await socialCommands.compliment(message);
                break;
            case 'fakeban':
                await socialCommands.fakeban(message);
                break;
            case 'friendship':
                await socialCommands.friendship(message);
                break;
            case 'stab':
                await socialCommands.stab(message);
                break;
            case 'kill':
                await socialCommands.kill(message);
                break;

            // Marriage System
            case 'marry':
                const marriageTarget = message.mentions.users.first();
                if (!marriageTarget) return message.reply('❌ Please mention someone to propose to!');
                if (marriageTarget.id === message.author.id) return message.reply('❌ You can\'t marry yourself!');
                if (marriageTarget.bot) return message.reply('❌ You can\'t marry a bot!');

                if (economy.isMarried(message.author.id)) {
                    const currentSpouse = economy.getSpouse(message.author.id);
                    return message.reply(`❌ You're already married to <@${currentSpouse}>! Use \`${prefix}divorce\` first.`);
                }

                if (economy.isMarried(marriageTarget.id)) {
                    return message.reply(`❌ ${marriageTarget} is already married to someone else!`);
                }

                // Check if user has a ring
                const hasRing = economy.hasItem(message.author.id, 'basic_ring') || 
                              economy.hasItem(message.author.id, 'silver_ring') || 
                              economy.hasItem(message.author.id, 'gold_ring') || 
                              economy.hasItem(message.author.id, 'platinum_ring') || 
                              economy.hasItem(message.author.id, 'diamond_ring');

                if (!hasRing) {
                    return message.reply(`❌ You need a ring to get married! Buy one from \`${prefix}shop rings\` first!`);
                }

                // Create marriage proposal
                const proposalEmbed = createEmbed('💍 Marriage Proposal!', 
                    `**${message.author.username}** is proposing to **${marriageTarget.username}**! 💖\n\n` +
                    `${marriageTarget}, do you accept this proposal? 💕\n\n` +
                    `React with 💍 to **ACCEPT** or ❌ to **REJECT**\n\n` +
                    `*Proposal expires in 60 seconds*`, 0xFF69B4);

                const proposalMsg = await message.channel.send({ 
                    content: `${marriageTarget}`,
                    embeds: [proposalEmbed] 
                });

                // Add reaction options
                await proposalMsg.react('💍');
                await proposalMsg.react('❌');

                // Create collector for reactions
                const filter = (reaction, user) => {
                    return ['💍', '❌'].includes(reaction.emoji.name) && user.id === marriageTarget.id;
                };

                const collector = proposalMsg.createReactionCollector({ filter, time: 60000, max: 1 });

                collector.on('collect', (reaction, user) => {
                    if (reaction.emoji.name === '💍') {
                        // Accepted proposal
                        
                        // Check again if still single (in case something changed)
                        if (economy.isMarried(message.author.id) || economy.isMarried(marriageTarget.id)) {
                            const errorEmbed = createEmbed('❌ Marriage Failed', 
                                'Someone got married while the proposal was pending! 💔', 0xFF0000);
                            return message.channel.send({ embeds: [errorEmbed] });
                        }

                        // Remove a ring from inventory (prefer diamond > platinum > gold > silver > basic)
                        let ringUsed = 'basic_ring';
                        if (economy.hasItem(message.author.id, 'diamond_ring')) {
                            ringUsed = 'diamond_ring';
                        } else if (economy.hasItem(message.author.id, 'platinum_ring')) {
                            ringUsed = 'platinum_ring';
                        } else if (economy.hasItem(message.author.id, 'gold_ring')) {
                            ringUsed = 'gold_ring';
                        } else if (economy.hasItem(message.author.id, 'silver_ring')) {
                            ringUsed = 'silver_ring';
                        }
                        
                        economy.removeFromInventory(message.author.id, ringUsed);
                        economy.marry(message.author.id, marriageTarget.id, ringUsed);

                        const marriageEmbed = createEmbed('💒 Wedding Celebration!', 
                            `🎉 **${message.author.username}** and **${marriageTarget.username}** are now married! 💍✨\n\n` +
                            `*A beautiful ${ringUsed.replace('_', ' ')} sealed their love! 💎*\n\n` +
                            `💕 **Couple Perks Unlocked:**\n` +
                            `• 🎁 Daily bonus rewards\n` +
                            `• 💖 Love XP system\n` +
                            `• 👫 Special couple commands\n` +
                            `• 🤖 AI partner features\n` +
                            `• 🎊 Exclusive couple activities\n\n` +
                            `*Congratulations on your new journey together! 🌟*`, 0xFFD700);
                        
                        message.channel.send({ embeds: [marriageEmbed] });
                        
                        // Celebration reactions
                        setTimeout(() => {
                            const celebrations = ['🎉', '💕', '👏', '🥳', '💖', '🎊'];
                            celebrations.forEach((emoji, index) => {
                                setTimeout(() => {
                                    message.react(emoji).catch(() => {});
                                }, index * 500);
                            });
                        }, 1000);

                    } else if (reaction.emoji.name === '❌') {
                        // Rejected proposal
                        const rejectionEmbed = createEmbed('💔 Proposal Rejected', 
                            `**${marriageTarget.username}** has rejected the proposal from **${message.author.username}**. 😢\n\n` +
                            `*Better luck next time! There are plenty of fish in the sea! 🐟*`, 0xFF6B6B);
                        message.channel.send({ embeds: [rejectionEmbed] });
                    }
                });

                collector.on('end', collected => {
                    if (collected.size === 0) {
                        // Proposal expired
                        const expiredEmbed = createEmbed('⏰ Proposal Expired', 
                            `**${marriageTarget.username}** didn't respond to the proposal in time. 😔\n\n` +
                            `*Maybe try again later! 💫*`, 0x808080);
                        message.channel.send({ embeds: [expiredEmbed] });
                    }
                    
                    // Clear reactions
                    proposalMsg.reactions.removeAll().catch(() => {});
                });
                break;

            case 'divorce':
                if (!economy.isMarried(message.author.id)) {
                    return message.reply('❌ You\'re not married to anyone!');
                }

                economy.divorce(message.author.id);

                const divorceEmbed = createEmbed('💔 Divorce', 
                    `${message.author} is now divorced. 😢\n\n*All couple perks have been removed.*`, 0x696969);
                message.channel.send({ embeds: [divorceEmbed] });
                break;

            // Economy Commands
            case 'balance':
                await economyCommands.balance(message, economy);
                break;
            case 'daily':
                await economyCommands.daily(message, economy);
                break;
            case 'shop':
                await economyCommands.shop(message, args, economy);
                break;
            case 'inventory':
                await economyCommands.inventory(message, economy);
                break;
            case 'profile':
                await economyCommands.profile(message, economy);
                break;
            case 'couple':
                await economyCommands.couple(message, economy);
                break;
            case 'family':
                await economyCommands.family(message, args, economy);
                break;
            case 'adopt':
                await economyCommands.adopt(message, args, economy);
                break;
            case 'pet':
                await economyCommands.pet(message, args, economy);
                break;
            case 'pay':
                await economyCommands.pay(message, args, economy);
                break;
            case 'work':
                await economyCommands.work(message, economy);
                break;
            case 'beg':
                await economyCommands.beg(message, economy);
                break;
            case 'steal':
                await economyCommands.steal(message, economy);
                break;
            case 'pray':
                await economyCommands.pray(message, economy);
                break;
            case 'gift':
                await economyCommands.gift(message, args, economy);
                break;
            case 'gamble':
                await economyCommands.gamble(message, args, economy);
                break;
            case 'slots':
                await economyCommands.slots(message, args, economy);
                break;
            case 'coinflip':
            case 'cf':
                await economyCommands.coinflip(message, args, economy);
                break;
            case 'level':
                await economyCommands.level(message, economy);
                break;
            case 'leaderboard':
            case 'lb':
                await economyCommands.leaderboard(message, economy);
                break;
            case 'levelboard':
            case 'levellb':
                await economyCommands.levelboard(message, economy);
                break;

            // Special Commands
            case 'loveleaderboard':
            case 'lovelb':
                await specialCommands.loveleaderboard(message, economy);
                break;
            case 'familyleaderboard':
            case 'familylb':
            case 'famlb':
                await specialCommands.familyleaderboard(message, economy);
                break;
            case 'datefinder':
                await specialCommands.datefinder(message, args, economy);
                break;
            case 'announce':
                await specialCommands.announce(message, args);
                break;
            case 'giveaway':
                await specialCommands.giveaway(message, args);
                break;
            case 'poll':
                await specialCommands.poll(message, args);
                break;
            case 'reactionrole':
                await specialCommands.reactionrole(message, args);
                break;

            // Enhanced Couple & Family Commands
            case 'coupleadventure':
            case 'adventure':
                await economyCommands.coupleadventure(message, economy);
                break;
            case 'datenight':
            case 'date':
                await economyCommands.datenight(message, economy);
                break;
            case 'familyadventure':
            case 'famadv':
                await economyCommands.familyadventure(message, economy);
                break;
            case 'celebrate':
                await economyCommands.celebrate(message, args, economy);
                break;
            case 'birthday':
                await economyCommands.celebrate(message, ['birthday', ...args], economy);
                break;
            case 'anniversary':
                await economyCommands.celebrate(message, ['anniversary'], economy);
                break;

            // Enhanced Chatbot Commands
            case 'chatbot':
            case 'bot':
                await chatbotCommands.chatbotCommand(message, args);
                break;
            case 'chat':
                await chatbotCommands.chat(message, args);
                break;

            default:
                message.reply(`❌ Unknown command! Use \`${prefix}help\` to see available categories.`);
        }
    } catch (error) {
        console.error(`Error executing command ${command}:`, error);
        
        // More specific error messages
        if (error.code === 'MISSING_PERMISSIONS') {
            message.reply('❌ I don\'t have the required permissions to execute this command!');
        } else if (error.code === 'MISSING_ACCESS') {
            message.reply('❌ I don\'t have access to perform this action!');
        } else if (error.message.includes('timeout')) {
            message.reply('❌ The command timed out. Please try again!');
        } else {
            message.reply('❌ An error occurred while executing this command. Please try again later!');
        }
    }
});

// Error handling
client.on('error', error => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

client.login(token);

// Express server for uptime
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('🤖 VibeBot is alive and running! 🌟');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Express server is running on port ${PORT}!`);
});
