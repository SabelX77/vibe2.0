const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');

function createEmbed(title, description, color = 0x00AE86) {
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setTimestamp();
}

// Storage for special features
const activeGiveaways = new Map();
const activePolls = new Map();
const reactionRoles = new Map();
const announcements = new Map();
const dateFinderProfiles = new Map();

module.exports = {
    // Love Leaderboard
    loveleaderboard: async (message, economy) => {
        const allCouples = [];

        // Get all married users and their love levels
        for (const [userId, profile] of economy.userProfiles) {
            if (economy.isMarried(userId)) {
                const spouse = economy.getSpouse(userId);
                const coupleProfile = economy.getCoupleProfile(userId);

                if (coupleProfile && !allCouples.find(c => 
                    (c.user1 === userId && c.user2 === spouse) || 
                    (c.user1 === spouse && c.user2 === userId)
                )) {
                    try {
                        const user1 = await message.client.users.fetch(userId);
                        const user2 = await message.client.users.fetch(spouse);

                        allCouples.push({
                            user1: userId,
                            user2: spouse,
                            user1Name: user1.username,
                            user2Name: user2.username,
                            loveLevel: coupleProfile.loveLevel,
                            coupleXP: coupleProfile.coupleXP,
                            daysTogether: coupleProfile.daysTogether
                        });
                    } catch (error) {
                        console.log('Error fetching user for leaderboard:', error);
                    }
                }
            }
        }

        if (allCouples.length === 0) {
            return message.reply('💔 No couples found yet! Use `sab!marry @user` to start spreading the love!');
        }

        // Sort by love level
        allCouples.sort((a, b) => b.loveLevel - a.loveLevel);

        const loveLeaderboardEmbed = createEmbed('💕 Love Leaderboard 💕', '', 0xFF69B4);

        let description = '**👑 Most Loving Couples in the Server! 👑**\n\n';

        allCouples.slice(0, 10).forEach((couple, index) => {
            const medals = ['👑', '💎', '💍'];
            const medal = medals[index] || `${index + 1}.`;

            description += `${medal} **${couple.user1Name} & ${couple.user2Name}**\n`;
            description += `   💕 Love Level: ${couple.loveLevel} | 💞 Couple XP: ${couple.coupleXP} | 📅 ${couple.daysTogether} days together\n\n`;
        });

        loveLeaderboardEmbed.setDescription(description);
        loveLeaderboardEmbed.setFooter({ text: 'Keep loving to climb the leaderboard! 💖' });

        message.channel.send({ embeds: [loveLeaderboardEmbed] });
    },

    // Family Leaderboard
    familyleaderboard: async (message, economy) => {
        const allFamilies = [];

        // Get all families and their stats
        for (const [familyId, family] of economy.families) {
            const familyLevel = economy.getFamilyLevel(familyId);

            try {
                const memberNames = [];
                for (const memberId of family.members) {
                    try {
                        const member = await message.client.users.fetch(memberId);
                        memberNames.push(member.username);
                    } catch (error) {
                        memberNames.push('Unknown User');
                    }
                }

                allFamilies.push({
                    id: familyId,
                    name: family.name,
                    level: familyLevel.level,
                    xp: familyLevel.xp,
                    memberCount: family.members.length,
                    memberNames: memberNames.slice(0, 3), // Show up to 3 members
                    created: family.created
                });
            } catch (error) {
                console.log('Error fetching family data:', error);
            }
        }

        if (allFamilies.length === 0) {
            return message.reply('👨‍👩‍👧‍👦 No families found yet! Use `sab!family create <name>` to start your family legacy!');
        }

        // Sort by family level, then by XP
        allFamilies.sort((a, b) => {
            if (b.level !== a.level) return b.level - a.level;
            return b.xp - a.xp;
        });

        const familyLeaderboardEmbed = createEmbed('👨‍👩‍👧‍👦 Family Leaderboard 👨‍👩‍👧‍👦', '', 0x32CD32);

        let description = '**🏆 Top Families in the Server! 🏆**\n\n';

        allFamilies.slice(0, 10).forEach((family, index) => {
            const medals = ['👑', '🥇', '🥈'];
            const medal = medals[index] || `${index + 1}.`;

            description += `${medal} **${family.name} Family**\n`;
            description += `   📊 Level ${family.level} | ✨ ${family.xp.toLocaleString()} XP | 👥 ${family.memberCount} members\n`;
            description += `   👤 Members: ${family.memberNames.join(', ')}${family.memberCount > 3 ? '...' : ''}\n\n`;
        });

        familyLeaderboardEmbed.setDescription(description);
        familyLeaderboardEmbed.setFooter({ text: 'Build your family bonds to climb higher! 💪' });

        message.channel.send({ embeds: [familyLeaderboardEmbed] });
    },

    // Date Finder System
    datefinder: async (message, args, economy) => {
        const subcommand = args[0];

        if (subcommand === 'create') {
            if (economy.isMarried(message.author.id)) {
                return message.reply('💍 You\'re already married! Use `sab!divorce` first if you want to date others.');
            }

            const age = parseInt(args[1]);
            const gender = args[2];
            const interests = args.slice(3).join(' ');

            if (!age || age < 13 || age > 100) {
                return message.reply('❌ Please provide a valid age (13-100)!');
            }

            if (!gender || !['male', 'female', 'other', 'non-binary'].includes(gender.toLowerCase())) {
                return message.reply('❌ Please specify gender: male, female, other, or non-binary');
            }

            if (!interests) {
                return message.reply('❌ Please describe your interests! Example: `sab!datefinder create 20 male gaming, anime, music`');
            }

            dateFinderProfiles.set(message.author.id, {
                age,
                gender: gender.toLowerCase(),
                interests,
                createdAt: new Date(),
                likes: [],
                matches: []
            });

            const profileEmbed = createEmbed('💕 Date Finder Profile Created!', 
                `🎉 Your dating profile is now active!\n\n**Age:** ${age}\n**Gender:** ${gender}\n**Interests:** ${interests}\n\nUse \`sab!datefinder browse\` to find potential matches!`, 0xFF69B4);

            message.channel.send({ embeds: [profileEmbed] });

        } else if (subcommand === 'browse') {
            const userProfile = dateFinderProfiles.get(message.author.id);
            if (!userProfile) {
                return message.reply('❌ Create a profile first with `sab!datefinder create <age> <gender> <interests>`!');
            }

            const allProfiles = Array.from(dateFinderProfiles.entries())
                .filter(([userId, profile]) => userId !== message.author.id)
                .slice(0, 5);

            if (allProfiles.length === 0) {
                return message.reply('💔 No other profiles found! Share this server with friends!');
            }

            for (const [userId, profile] of allProfiles) {
                try {
                    const user = await message.client.users.fetch(userId);
                    const profileEmbed = createEmbed(`💖 ${user.username}'s Profile`, 
                        `**Age:** ${profile.age}\n**Gender:** ${profile.gender}\n**Interests:** ${profile.interests}\n\nReact with 💖 to like this profile!`, 0xFF69B4);

                    profileEmbed.setThumbnail(user.displayAvatarURL());
                    const msg = await message.channel.send({ embeds: [profileEmbed] });
                    await msg.react('💖');
                    await msg.react('👎');
                } catch (error) {
                    console.log('Error displaying profile:', error);
                }
            }

        } else if (subcommand === 'delete') {
            if (dateFinderProfiles.has(message.author.id)) {
                dateFinderProfiles.delete(message.author.id);
                message.reply('💔 Your dating profile has been deleted.');
            } else {
                message.reply('❌ You don\'t have a dating profile to delete.');
            }

        } else {
            message.reply('❌ Usage: `sab!datefinder create/browse/delete`');
        }
    },

    // Announcement System
    announce: async (message, args) => {
        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            return message.reply('❌ You need "Manage Messages" permission to make announcements!');
        }

        const title = args.slice(0, args.indexOf('|')).join(' ');
        const description = args.slice(args.indexOf('|') + 1).join(' ');

        if (!title || !description) {
            return message.reply('❌ Usage: `sab!announce Title Here | Description here`');
        }

        const announceEmbed = createEmbed(`📢 ${title}`, description, 0xFFD700);
        announceEmbed.setFooter({ text: `Announced by ${message.author.username}`, iconURL: message.author.displayAvatarURL() });

        const msg = await message.channel.send({ embeds: [announceEmbed] });
        await msg.react('👍');
        await msg.react('👎');

        message.delete().catch(() => {});
    },

    // Giveaway System
    giveaway: async (message, args) => {
        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            return message.reply('❌ You need "Manage Messages" permission to start giveaways!');
        }

        const timeStr = args[0];
        const prize = args.slice(1).join(' ');

        if (!timeStr || !prize) {
            return message.reply('❌ Usage: `sab!giveaway 1h Amazing Prize Here`');
        }

        // Parse time (1h, 30m, 1d, etc.)
        const timeMatch = timeStr.match(/^(\d+)([hmd])$/);
        if (!timeMatch) {
            return message.reply('❌ Invalid time format! Use: 1h (hours), 30m (minutes), 1d (days)');
        }

        const timeValue = parseInt(timeMatch[1]);
        const timeUnit = timeMatch[2];

        let duration;
        switch (timeUnit) {
            case 'm': duration = timeValue * 60 * 1000; break;
            case 'h': duration = timeValue * 60 * 60 * 1000; break;
            case 'd': duration = timeValue * 24 * 60 * 60 * 1000; break;
        }

        const endTime = new Date(Date.now() + duration);

        const giveawayEmbed = createEmbed('🎉 GIVEAWAY 🎉', 
            `**Prize:** ${prize}\n**Ends:** <t:${Math.floor(endTime.getTime() / 1000)}:R>\n**React with 🎉 to enter!**\n\n**Hosted by:** ${message.author}`, 0xFFD700);

        const giveawayMsg = await message.channel.send({ embeds: [giveawayEmbed] });
        await giveawayMsg.react('🎉');

        // Store giveaway data
        activeGiveaways.set(giveawayMsg.id, {
            prize,
            endTime,
            hostId: message.author.id,
            channelId: message.channel.id,
            participants: []
        });

        // Set timer to end giveaway
        setTimeout(async () => {
            const giveaway = activeGiveaways.get(giveawayMsg.id);
            if (!giveaway) return;

            try {
                const msg = await message.channel.messages.fetch(giveawayMsg.id);
                const reaction = msg.reactions.cache.get('🎉');

                if (reaction) {
                    const users = await reaction.users.fetch();
                    const participants = users.filter(user => !user.bot);

                    if (participants.size === 0) {
                        const noWinnerEmbed = createEmbed('🎉 Giveaway Ended', 
                            `**Prize:** ${giveaway.prize}\n**Winner:** No one entered! 😢`, 0x696969);
                        message.channel.send({ embeds: [noWinnerEmbed] });
                    } else {
                        const winner = participants.random();
                        const winnerEmbed = createEmbed('🎉 Giveaway Winner!', 
                            `**Prize:** ${giveaway.prize}\n**Winner:** ${winner} 🎊\n\nCongratulations! 🎉`, 0xFFD700);
                        message.channel.send({ embeds: [winnerEmbed] });
                    }
                }
            } catch (error) {
                console.log('Error ending giveaway:', error);
            }

            activeGiveaways.delete(giveawayMsg.id);
        }, duration);

        message.delete().catch(() => {});
    },

    // Poll System
    poll: async (message, args) => {
        const question = args.slice(0, args.indexOf('|')).join(' ');
        const optionsStr = args.slice(args.indexOf('|') + 1).join(' ');

        if (!question || !optionsStr) {
            return message.reply('❌ Usage: `sab!poll Your question here? | Option 1, Option 2, Option 3`');
        }

        const options = optionsStr.split(',').map(opt => opt.trim()).filter(opt => opt.length > 0);

        if (options.length < 2 || options.length > 10) {
            return message.reply('❌ Please provide 2-10 options separated by commas!');
        }

        const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

        let pollDescription = `${question}\n\n`;
        options.forEach((option, index) => {
            pollDescription += `${emojis[index]} ${option}\n`;
        });

        const pollEmbed = createEmbed('📊 Poll', pollDescription, 0x3498db);
        pollEmbed.setFooter({ text: `Poll by ${message.author.username}`, iconURL: message.author.displayAvatarURL() });

        const pollMsg = await message.channel.send({ embeds: [pollEmbed] });

        // Add reactions for each option
        for (let i = 0; i < options.length; i++) {
            await pollMsg.react(emojis[i]);
        }

        // Store poll data
        activePolls.set(pollMsg.id, {
            question,
            options,
            createdBy: message.author.id,
            createdAt: new Date()
        });

        message.delete().catch(() => {});
    },

    // Reaction Roles Setup
    reactionrole: async (message, args) => {
        if (!message.member.permissions.has('MANAGE_ROLES')) {
            return message.reply('❌ You need "Manage Roles" permission to set up reaction roles!');
        }

        const subcommand = args[0];

        if (subcommand === 'create') {
            const title = args[1];
            const description = args.slice(2).join(' ');

            if (!title || !description) {
                return message.reply('❌ Usage: `sab!reactionrole create "Title" Description here`');
            }

            const rrEmbed = createEmbed(title, `${description}\n\n**React below to get roles!**`, 0x9B59B6);
            const rrMsg = await message.channel.send({ embeds: [rrEmbed] });

            reactionRoles.set(rrMsg.id, {
                roles: {},
                channelId: message.channel.id,
                createdBy: message.author.id
            });

            message.reply(`✅ Reaction role message created! Use \`sab!reactionrole add ${rrMsg.id} :emoji: @role\` to add roles.`);

        } else if (subcommand === 'add') {
            const messageId = args[1];
            const emoji = args[2];
            const role = message.mentions.roles.first();

            if (!messageId || !emoji || !role) {
                return message.reply('❌ Usage: `sab!reactionrole add <messageId> :emoji: @role`');
            }

            const rrData = reactionRoles.get(messageId);
            if (!rrData) {
                return message.reply('❌ Reaction role message not found!');
            }

            rrData.roles[emoji] = role.id;

            try {
                const rrMsg = await message.channel.messages.fetch(messageId);
                await rrMsg.react(emoji);
                message.reply(`✅ Added ${emoji} → ${role} to reaction roles!`);
            } catch (error) {
                message.reply('❌ Failed to add reaction or message not found!');
            }
        } else {
            message.reply('❌ Usage: `sab!reactionrole create/add`');
        }
    }
};