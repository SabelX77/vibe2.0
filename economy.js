const { EmbedBuilder } = require('discord.js');

function createEmbed(title, description, color = 0x00AE86) {
    // Ensure description is not empty or null
    if (!description || description.trim() === '') {
        description = 'No information available.';
    }

    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setTimestamp();
}

// Enhanced Shop Items
const SHOP_ITEMS = {
    // Rings
    'basic_ring': { name: 'Basic Ring', price: 10000, emoji: '💍', description: 'A simple ring for proposals', category: 'rings' },
    'silver_ring': { name: 'Silver Ring', price: 25000, emoji: '🤍💍', description: 'A beautiful silver ring', category: 'rings' },
    'gold_ring': { name: 'Gold Ring', price: 50000, emoji: '💛💍', description: 'A luxurious gold ring', category: 'rings' },
    'platinum_ring': { name: 'Platinum Ring', price: 150000, emoji: '⚪💍', description: 'An exclusive platinum ring', category: 'rings' },
    'diamond_ring': { name: 'Diamond Ring', price: 1000000, emoji: '💎💍', description: 'The ultimate diamond ring', category: 'rings' },

    // Gifts
    'chocolate': { name: 'Chocolate', price: 5000, emoji: '🍫', description: 'Sweet chocolate gift', category: 'gifts' },
    'teddy_bear': { name: 'Teddy Bear', price: 15000, emoji: '🧸', description: 'Cute and cuddly teddy bear', category: 'gifts' },
    'love_potion': { name: 'Love Potion', price: 75000, emoji: '💖🧪', description: 'Magical love potion', category: 'gifts' },
    'luxury_car': { name: 'Luxury Car', price: 500000, emoji: '🚗✨', description: 'Expensive luxury car gift', category: 'gifts' },
    'golden_chocolate_cake': { name: 'Golden Chocolate Cake', price: 20000, emoji: '✨🍰', description: 'Premium golden chocolate cake', category: 'gifts' },

    // Pets
    'pet_dog': { name: 'Pet Dog', price: 75000, emoji: '🐶', description: 'A loyal pet dog companion', category: 'pets' },
    'pet_cat': { name: 'Pet Cat', price: 50000, emoji: '🐱', description: 'A cute pet cat companion', category: 'pets' },
    'pet_dragon': { name: 'Pet Dragon', price: 500000, emoji: '🐲', description: 'An extremely rare dragon companion', category: 'pets' },
    'pet_phoenix': { name: 'Pet Phoenix', price: 750000, emoji: '🔥🦅', description: 'Legendary phoenix companion', category: 'pets' },

    // Family Items
    'crib': { name: 'Baby Crib', price: 100000, emoji: '🛏️👶', description: 'Luxury baby crib for family', category: 'family' },
    'mansion': { name: 'Family Mansion', price: 2000000, emoji: '🏰', description: 'Grand family mansion', category: 'family' },
    'family_car': { name: 'Family Car', price: 300000, emoji: '🚙', description: 'Spacious family vehicle', category: 'family' },

    // Badges
    'bronze_badge': { name: 'Bronze Badge', price: 25000, emoji: '🥉', description: 'Bronze achievement badge', category: 'badges' },
    'silver_badge': { name: 'Silver Badge', price: 75000, emoji: '🥈', description: 'Silver achievement badge', category: 'badges' },
    'gold_badge': { name: 'Gold Badge', price: 150000, emoji: '🥇', description: 'Gold achievement badge', category: 'badges' },
    'platinum_badge': { name: 'Platinum Badge', price: 300000, emoji: '🏆', description: 'Platinum achievement badge', category: 'badges' },
    'couple_badge': { name: 'Couple Badge', price: 200000, emoji: '💑', description: 'Exclusive couple badge', category: 'badges' },
    'family_badge': { name: 'Family Badge', price: 400000, emoji: '👨‍👩‍👧‍👦', description: 'Exclusive family badge', category: 'badges' }
};

module.exports = {
    balance: async (message, economy) => {
        const balanceUser = message.mentions.users.first() || message.author;
        const balance = economy.getUserBalance(balanceUser.id);
        const profile = economy.getUserProfile(balanceUser.id);

        const balanceEmbed = economy.createEconomyEmbed('🌟 User Profile', 
            `**${balanceUser.username}'s Profile**\n\n` +
            `💰 **Balance:** ${balance.toLocaleString()} 🌟 Vibecoins\n` +
            `📊 **Level:** ${profile.level}\n` +
            `✨ **XP:** ${profile.xp.toLocaleString()}\n` +
            `📱 **Messages:** ${profile.chatCount.toLocaleString()}\n` +
            `📅 **Joined:** ${profile.joinDate.toDateString()}`);
        message.channel.send({ embeds: [balanceEmbed] });
    },

    daily: async (message, economy) => {
        if (!economy.canClaimDaily(message.author.id)) {
            return message.reply('❌ You already claimed your daily reward today! Come back tomorrow.');
        }

        const result = economy.claimDaily(message.author.id);
        const profile = economy.getUserProfile(message.author.id);

        let dailyDescription = `You received **${result.baseAmount}** 🌟 Vibecoins!\n`;
        if (result.isMarried) {
            dailyDescription += `💑 **Couple Bonus:** +${result.marriageBonus} 🌟 Vibecoins!\n`;
        }
        if (result.levelBonus > 0) {
            dailyDescription += `⭐ **Level ${profile.level} Bonus:** +${result.levelBonus} 🌟 Vibecoins!\n`;
        }
        dailyDescription += `\n✨ **Total:** ${result.totalAmount} 🌟 Vibecoins\n`;
        dailyDescription += `📊 **XP Gained:** +50 XP\n`;
        dailyDescription += `💰 **New Balance:** ${economy.getUserBalance(message.author.id).toLocaleString()} 🌟 Vibecoins`;

        const dailyEmbed = economy.createEconomyEmbed('🌟 Daily Reward!', dailyDescription, 0x00FF00);
        message.channel.send({ embeds: [dailyEmbed] });
    },

    shop: async (message, args, economy) => {
        if (!args[0]) {
            // Display shop categories
            const categories = {
                'rings': '💍 **Rings** - For proposals and marriages',
                'gifts': '🎁 **Gifts** - Show your love and care',
                'pets': '🐾 **Pets** - Loyal companions',
                'family': '🏠 **Family Items** - For your family',
                'badges': '🏅 **Badges** - Show your achievements'
            };

            let shopDescription = '**🛍️ Welcome to the Enhanced VibeShop! 🛍️**\n\n';
            shopDescription += '**📂 Categories:**\n';

            Object.entries(categories).forEach(([key, desc]) => {
                shopDescription += `${desc}\n`;
            });

            shopDescription += `\n💡 Use \`sab!shop <category>\` to browse!\n`;
            shopDescription += `🛒 Use \`sab!shop buy <item_name>\` to purchase!\n`;
            shopDescription += `📦 Use \`sab!inventory\` to see your items!`;

            const shopEmbed = createEmbed('🛍️ VibeShop', shopDescription, 0xFFD700);
            return message.channel.send({ embeds: [shopEmbed] });
        }

        if (args[0].toLowerCase() === 'buy') {
            const itemKey = args.slice(1).join('_').toLowerCase();
            const item = SHOP_ITEMS[itemKey];

            if (!item) {
                return message.reply('❌ Item not found! Use `sab!shop` to see available categories.');
            }

            const userBalance = economy.getUserBalance(message.author.id);
            if (userBalance < item.price) {
                return message.reply(`❌ Insufficient funds! You need **${item.price.toLocaleString()}** 🌟 Vibecoins but have **${userBalance.toLocaleString()}**.`);
            }

            economy.updateUserBalance(message.author.id, -item.price);
            economy.addToInventory(message.author.id, itemKey);

            const purchaseEmbed = createEmbed('✅ Purchase Successful!', 
                `You bought **${item.name}** ${item.emoji} for **${item.price.toLocaleString()}** 🌟 Vibecoins!\n\nNew balance: **${economy.getUserBalance(message.author.id).toLocaleString()}** 🌟 Vibecoins`, 0x00FF00);
            message.channel.send({ embeds: [purchaseEmbed] });
        } else {
            // Show category items
            const category = args[0].toLowerCase();
            const categoryItems = Object.entries(SHOP_ITEMS).filter(([key, item]) => item.category === category);

            if (categoryItems.length === 0) {
                return message.reply('❌ Category not found! Use `sab!shop` to see available categories.');
            }

            let categoryDescription = `**🛍️ ${category.charAt(0).toUpperCase() + category.slice(1)} Shop**\n\n`;

            categoryItems.forEach(([key, item]) => {
                categoryDescription += `${item.emoji} **${item.name}** - ${item.price.toLocaleString()} 🌟 Vibecoins\n`;
                categoryDescription += `   *${item.description}*\n\n`;
            });

            const categoryEmbed = createEmbed(`🛍️ ${category.charAt(0).toUpperCase() + category.slice(1)} Shop`, categoryDescription, 0xFFD700);
            message.channel.send({ embeds: [categoryEmbed] });
        }
    },

    inventory: async (message, economy) => {
        const inventory = economy.getInventory(message.author.id);

        if (!inventory || inventory.length === 0) {
            return message.reply('📦 Your inventory is empty! Visit the shop with `sab!shop` to buy items.');
        }

        let inventoryDescription = `**📦 ${message.author.username}'s Inventory:**\n\n`;

        const itemCounts = {};
        inventory.forEach(itemKey => {
            itemCounts[itemKey] = (itemCounts[itemKey] || 0) + 1;
        });

        Object.entries(itemCounts).forEach(([itemKey, count]) => {
            const item = SHOP_ITEMS[itemKey];
            if (item) {
                inventoryDescription += `${item.emoji} **${item.name}** x${count}\n`;
            }
        });

        const inventoryEmbed = createEmbed('📦 Inventory', inventoryDescription, 0x9932CC);
        message.channel.send({ embeds: [inventoryEmbed] });
    },

    profile: async (message, economy) => {
        const user = message.mentions.users.first() || message.author;
        const profile = economy.getUserProfile(user.id);
        const balance = economy.getUserBalance(user.id);
        const coupleProfile = economy.getCoupleProfile(user.id);
        const family = economy.getUserFamily(user.id);
        const pets = economy.getUserPets(user.id);

        let profileDescription = `**👤 ${user.username}'s Profile**\n\n`;
        profileDescription += `💰 **Balance:** ${balance.toLocaleString()} 🌟 Vibecoins\n`;
        profileDescription += `📊 **Level:** ${profile.level} | **XP:** ${profile.xp.toLocaleString()}\n`;
        profileDescription += `💬 **Messages:** ${profile.chatCount.toLocaleString()}\n`;

        if (coupleProfile) {
            profileDescription += `\n💑 **Relationship Status:** Married\n`;
            profileDescription += `💕 **Love Level:** ${coupleProfile.loveLevel}\n`;
            profileDescription += `📅 **Together for:** ${coupleProfile.daysTogether} days\n`;
        }

        if (family) {
            profileDescription += `\n👨‍👩‍👧‍👦 **Family:** ${family.name}\n`;
            profileDescription += `👥 **Members:** ${family.members.length}\n`;
        }

        if (pets.length > 0) {
            profileDescription += `\n🐾 **Pets:** ${pets.length}\n`;
        }

        const profileEmbed = createEmbed('👤 User Profile', profileDescription, 0x7289DA);
        message.channel.send({ embeds: [profileEmbed] });
    },

    couple: async (message, economy) => {
        const coupleProfile = economy.getCoupleProfile(message.author.id);
        if (!coupleProfile) {
            return message.reply('❌ You are not married! Use `sab!marry @user` to get married.');
        }

        const spouse = await message.guild.members.fetch(coupleProfile.spouse);
        const gifts = coupleProfile.gifts;

        let coupleDescription = `**💑 Couple Profile**\n\n`;
        coupleDescription += `👫 **Partners:** ${message.author.username} & ${spouse.user.username}\n`;
        coupleDescription += `💕 **Love Level:** ${coupleProfile.loveLevel}\n`;
        coupleDescription += `✨ **Couple XP:** ${coupleProfile.coupleXP}\n`;
        coupleDescription += `📅 **Marriage Date:** ${coupleProfile.marriageDate.toDateString()}\n`;
        coupleDescription += `💖 **Days Together:** ${coupleProfile.daysTogether}\n`;
        coupleDescription += `🎁 **Gifts Exchanged:** ${gifts.length}\n`;

        if (gifts.length > 0) {
            coupleDescription += `\n**Recent Gifts:**\n`;
            gifts.slice(-3).forEach(gift => {
                const item = SHOP_ITEMS[gift.gift];
                if (item) {
                    coupleDescription += `${item.emoji} ${item.name} - ${gift.date.toDateString()}\n`;
                }
            });
        }

        const coupleEmbed = createEmbed('💑 Couple Profile', coupleDescription, 0xFF69B4);
        message.channel.send({ embeds: [coupleEmbed] });
    },

    family: async (message, args, economy) => {
        if (args[0] === 'create') {
            const familyName = args.slice(1).join(' ');
            if (!familyName) {
                return message.reply('❌ Please provide a family name! Example: `sab!family create The Smiths`');
            }

            if (economy.getUserFamily(message.author.id)) {
                return message.reply('❌ You are already in a family!');
            }

            const familyId = economy.createFamily(message.author.id, familyName);
            const createEmbed = createEmbed('👨‍👩‍👧‍👦 Family Created!', 
                `Successfully created family: **${familyName}**!\nUse \`sab!family invite @user\` to add members.`, 0x00FF00);
            message.channel.send({ embeds: [createEmbed] });
        } else if (args[0] === 'invite') {
            const invitee = message.mentions.users.first();
            if (!invitee) {
                return message.reply('❌ Please mention someone to invite!');
            }

            const family = economy.getUserFamily(message.author.id);
            if (!family) {
                return message.reply('❌ You are not in a family! Create one first.');
            }

            if (family.creator !== message.author.id) {
                return message.reply('❌ Only the family creator can invite members!');
            }

            if (economy.inviteToFamily(economy.familyMembers.get(message.author.id), invitee.id)) {
                const inviteEmbed = createEmbed('👨‍👩‍👧‍👦 Family Invitation!', 
                    `${invitee.username} has been added to the **${family.name}** family!`, 0x00FF00);
                message.channel.send({ embeds: [inviteEmbed] });
            } else {
                message.reply('❌ Could not invite user to family.');
            }
        } else {
            // Show family profile
            const family = economy.getUserFamily(message.author.id);
            if (!family) {
                return message.reply('❌ You are not in a family! Use `sab!family create <name>` to create one.');
            }

            let familyDescription = `**👨‍👩‍👧‍👦 ${family.name} Family**\n\n`;
            familyDescription += `👥 **Members:** ${family.members.length}\n`;
            familyDescription += `📊 **Family Level:** ${family.level}\n`;
            familyDescription += `✨ **Family XP:** ${family.xp}\n`;
            familyDescription += `📅 **Created:** ${family.created.toDateString()}\n`;
            familyDescription += `🐾 **Family Pets:** ${family.pets.length}\n`;

            const familyEmbed = createEmbed('👨‍👩‍👧‍👦 Family Profile', familyDescription, 0x32CD32);
            message.channel.send({ embeds: [familyEmbed] });
        }
    },

    adopt: async (message, args, economy) => {
        const petType = args[0];
        const petName = args.slice(1).join(' ');

        if (!petType || !petName) {
            return message.reply('❌ Please specify pet type and name! Example: `sab!adopt dog Buddy`');
        }

        const petTypes = ['dog', 'cat', 'dragon', 'phoenix'];
        if (!petTypes.includes(petType.toLowerCase())) {
            return message.reply(`❌ Invalid pet type! Available: ${petTypes.join(', ')}`);
        }

        const petItemKey = `pet_${petType.toLowerCase()}`;
        if (!economy.hasItem(message.author.id, petItemKey)) {
            return message.reply(`❌ You need to buy a ${petType} first from the shop!`);
        }

        const petId = economy.adoptPet(message.author.id, petType, petName);
        economy.removeFromInventory(message.author.id, petItemKey);

        const adoptEmbed = createEmbed('🐾 Pet Adopted!', 
            `You successfully adopted **${petName}** the ${petType}! 🎉\nUse \`sab!pet ${petName}\` to interact with them!`, 0xFF69B4);
        message.channel.send({ embeds: [adoptEmbed] });
    },

    pet: async (message, args, economy) => {
        const pets = economy.getUserPets(message.author.id);

        if (pets.length === 0) {
            return message.reply('❌ You don\'t have any pets! Adopt one with `sab!adopt <type> <name>`');
        }

        if (!args[0]) {
            // Show all pets
            let petsDescription = `**🐾 ${message.author.username}'s Pets**\n\n`;
            pets.forEach(pet => {
                const emoji = pet.type === 'dog' ? '🐶' : pet.type === 'cat' ? '🐱' : pet.type === 'dragon' ? '🐲' : '🔥🦅';
                petsDescription += `${emoji} **${pet.name}** - Level ${pet.level}\n`;
                petsDescription += `   ❤️ Happiness: ${pet.happiness}% | 🍽️ Hunger: ${pet.hunger}%\n\n`;
            });

            const petsEmbed = createEmbed('🐾 Your Pets', petsDescription, 0xFF8C00);
            message.channel.send({ embeds: [petsEmbed] });
        } else {
            // Show specific pet
            const petName = args.join(' ');
            const pet = pets.find(p => p.name.toLowerCase() === petName.toLowerCase());

            if (!pet) {
                return message.reply('❌ Pet not found!');
            }

            const emoji = pet.type === 'dog' ? '🐶' : pet.type === 'cat' ? '🐱' : pet.type === 'dragon' ? '🐲' : '🔥🦅';
            let petDescription = `${emoji} **${pet.name} the ${pet.type}**\n\n`;
            petDescription += `📊 **Level:** ${pet.level}\n`;
            petDescription += `✨ **XP:** ${pet.xp}\n`;
            petDescription += `❤️ **Happiness:** ${pet.happiness}%\n`;
            petDescription += `🍽️ **Hunger:** ${pet.hunger}%\n`;
            petDescription += `📅 **Adopted:** ${pet.adopted.toDateString()}\n`;
            petDescription += `🕐 **Last Interaction:** ${pet.lastInteraction.toDateString()}`;

            const petEmbed = createEmbed(`🐾 ${pet.name}'s Profile`, petDescription, 0xFF8C00);
            message.channel.send({ embeds: [petEmbed] });
        }
    },

    pay: async (message, economy) => {
        const payTarget = message.mentions.users.first();
        const payAmount = parseInt(args[1]);

        if (!payTarget) return message.reply('❌ Please mention someone to pay!');
        if (payTarget.id === message.author.id) return message.reply('❌ You can\'t pay yourself!');
        if (payTarget.bot) return message.reply('❌ You can\'t pay bots!');
        if (!payAmount || payAmount <= 0) return message.reply('❌ Please specify a valid amount!');

        const result = economy.transferMoney(message.author.id, payTarget.id, payAmount);
        if (!result.success) return message.reply(`❌ ${result.error}`);

        economy.addUserXP(message.author.id, 10);
        const payEmbed = createEmbed('💸 Payment Sent!', 
            `${message.author} sent **${payAmount}** 🌟 Vibecoins to ${payTarget}!`, 0x00FF00);
        message.channel.send({ embeds: [payEmbed] });
    },

    work: async (message, economy) => {
        const result = economy.work(message.author.id);
        if (!result.success) return message.reply(`❌ ${result.error}`);

        let workDescription = `You worked as a **${result.job}** and earned **${result.baseAmount}** 🌟 Vibecoins!\n`;
        if (result.bonusAmount > 0) {
            const profile = economy.getUserProfile(message.author.id);
            workDescription += `⭐ **Level ${profile.level} Bonus:** +${result.bonusAmount} 🌟 Vibecoins!\n`;
            workDescription += `💰 **Total Earned:** ${result.amount} 🌟 Vibecoins\n`;
        }
        workDescription += `📊 **XP Gained:** +25 XP\n`;
        workDescription += `💰 **New Balance:** ${result.newBalance.toLocaleString()} 🌟 Vibecoins`;

        const workEmbed = createEmbed('💼 Work Complete!', workDescription, 0x4169E1);
        message.channel.send({ embeds: [workEmbed] });
    },

    gift: async (message, args, economy) => {
        const giftTarget = message.mentions.users.first();

        if (args[0] === 'item') {
            const itemKey = args.slice(2).join('_').toLowerCase();

            if (!giftTarget) return message.reply('❌ Please mention someone to gift to!');
            if (giftTarget.id === message.author.id) return message.reply('❌ You can\'t gift to yourself!');
            if (giftTarget.bot) return message.reply('❌ You can\'t gift to bots!');

            const item = SHOP_ITEMS[itemKey];
            if (!item) return message.reply('❌ Item not found!');

            if (!economy.hasItem(message.author.id, itemKey)) {
                return message.reply(`❌ You don't have **${item.name}** in your inventory!`);
            }

            economy.removeFromInventory(message.author.id, itemKey);
            economy.addToInventory(giftTarget.id, itemKey);
            economy.giveGift(message.author.id, giftTarget.id, itemKey);

            message.channel.send(`🎁 **Item Gift!** 🎁\n\n${message.author} gifted **${item.name}** ${item.emoji} to ${giftTarget}!\n\n*How generous!* ✨`);
            return;
        }

        const giftAmount = parseInt(args[1]);
        if (!giftTarget) return message.reply('❌ Please mention someone to gift to!');
        if (giftTarget.id === message.author.id) return message.reply('❌ You can\'t gift to yourself!');
        if (giftTarget.bot) return message.reply('❌ You can\'t gift to bots!');
        if (!giftAmount || giftAmount <= 0) return message.reply('❌ Please specify a valid amount to gift!');

        const result = economy.transferMoney(message.author.id, giftTarget.id, giftAmount);
        if (!result.success) return message.reply(`❌ ${result.error}`);

        const giftMessages = [
            `🎁 **Generous Gift!** 🎁\n\n${message.author.username} gifted **${giftAmount}** 🌟 Vibecoins to ${giftTarget.username}! 💖\n\n*How wholesome!* ✨`,
            `💝 **Gift Delivered!** 💝\n\n${giftTarget.username} received **${giftAmount}** 🌟 Vibecoins from ${message.author.username}! 🎉\n\n*Spreading the love!* 💕`
        ];
        const randomGiftMessage = giftMessages[Math.floor(Math.random() * giftMessages.length)];
        message.channel.send(randomGiftMessage);
    },

    level: async (message, economy) => {
        const user = message.mentions.users.first() || message.author;
        const profile = economy.getUserProfile(user.id);
        const userPerks = economy.getUserPerks(user.id);

        let levelDescription = `**📊 ${user.username}'s Level Information**\n\n`;
        levelDescription += `🎯 **Current Level:** ${profile.level}\n`;
        levelDescription += `✨ **XP:** ${profile.xp.toLocaleString()} / ${((profile.level) * 1000).toLocaleString()}\n`;
        levelDescription += `📈 **Progress:** ${Math.floor((profile.xp % 1000) / 10)}%\n\n`;

        if (userPerks.badges.length > 0) {
            levelDescription += `🏅 **Badges:** ${userPerks.badges.join(' ')}\n\n`;
        }

        if (userPerks.roles.length > 0) {
            levelDescription += `🎭 **Unlocked Roles:**\n${userPerks.roles.map(role => `• ${role}`).join('\n')}\n\n`;
        }

        if (userPerks.perks.length > 0) {
            levelDescription += `⚡ **Active Perks:**\n${userPerks.perks.map(perk => `• ${perk}`).join('\n')}\n\n`;
        }

        // Show next level perks
        const nextLevelPerks = economy.getLevelPerks(profile.level + 1);
        if (nextLevelPerks) {
            levelDescription += `🔮 **Next Level Rewards (Level ${profile.level + 1}):**\n`;
            if (nextLevelPerks.roles) {
                levelDescription += `🎭 Roles: ${nextLevelPerks.roles.join(', ')}\n`;
            }
            if (nextLevelPerks.perks) {
                levelDescription += `⚡ Perks: ${nextLevelPerks.perks.join(', ')}\n`;
            }
            if (nextLevelPerks.badges) {
                levelDescription += `🏅 Badges: ${nextLevelPerks.badges.join(' ')}\n`;
            }
        }

        const levelEmbed = createEmbed('📊 Level Information', levelDescription, 0x7289DA);
        message.channel.send({ embeds: [levelEmbed] });
    },

    coinflip: async (message, economy) => {
        const betAmount = parseInt(args[0]);
        let choice = args[1]?.toLowerCase();

        // Handle shortcuts
        if (choice === 'h') choice = 'heads';
        if (choice === 't') choice = 'tails';

        if (!betAmount || betAmount <= 0) {
            return message.reply('❌ Please specify a valid bet amount!\nUsage: `sab!cf <amount> <heads/tails>` or `sab!cf <amount> <h/t>`');
        }

        if (!choice || !['heads', 'tails'].includes(choice)) {
            return message.reply('❌ Please choose heads or tails!\nUsage: `sab!cf <amount> <heads/tails>` or `sab!cf <amount> <h/t>`');
        }

        const userBalance = economy.getUserBalance(message.author.id);
        if (userBalance < betAmount) {
            return message.reply(`❌ Insufficient funds! You have **${userBalance.toLocaleString()}** 🌟 Vibecoins but need **${betAmount.toLocaleString()}**.`);
        }

        const flip = Math.random() < 0.5 ? 'heads' : 'tails';
        const won = flip === choice;
        const winAmount = won ? betAmount : -betAmount;

        economy.updateUserBalance(message.author.id, winAmount);
        economy.addUserXP(message.author.id, won ? 20 : 5);

        const flipEmoji = flip === 'heads' ? '🪙' : '🔄';
        const resultEmoji = won ? '🎉' : '💸';

        let flipDescription = `${flipEmoji} **The coin landed on: ${flip.toUpperCase()}!**\n\n`;
        flipDescription += `${resultEmoji} ${won ? 'YOU WON!' : 'You lost...'}\n`;
        flipDescription += `💰 **${won ? 'Won' : 'Lost'}:** ${Math.abs(winAmount).toLocaleString()} 🌟 Vibecoins\n`;
        flipDescription += `📊 **XP Gained:** +${won ? 20 : 5} XP\n`;
        flipDescription += `💰 **New Balance:** ${economy.getUserBalance(message.author.id).toLocaleString()} 🌟 Vibecoins`;

        const flipEmbed = createEmbed(`🪙 Coin Flip ${won ? 'Victory!' : 'Result'}`, flipDescription, won ? 0x00FF00 : 0xFF0000);
        message.channel.send({ embeds: [flipEmbed] });
    },

    leaderboard: async (message, economy) => {
        const allUsers = [];

        // Get all users with their balances and levels
        for (const [userId, profile] of economy.userProfiles) {
            try {
                const user = await message.client.users.fetch(userId);
                const balance = economy.getUserBalance(userId);

                allUsers.push({
                    userId,
                    username: user.username,
                    balance,
                    level: profile.level,
                    xp: profile.xp,
                    chatCount: profile.chatCount
                });
            } catch (error) {
                console.log('Error fetching user for leaderboard:', error);
            }
        }

        // Sort by balance (richest first)
        allUsers.sort((a, b) => b.balance - a.balance);

        if (allUsers.length === 0) {
            return message.reply('📊 No users found in the leaderboard yet!');
        }

        const leaderboardEmbed = createEmbed('🏆 VibeBot Leaderboard 🏆', '', 0xFFD700);

        let description = '**💰 Richest Users in the Server! 💰**\n\n';

        allUsers.slice(0, 10).forEach((user, index) => {
            const medals = ['🥇', '🥈', '🥉'];
            const medal = medals[index] || `${index + 1}.`;

            description += `${medal} **${user.username}**\n`;
            description += `   💰 ${user.balance.toLocaleString()} 🌟 | 📊 Level ${user.level} | 💬 ${user.chatCount} messages\n\n`;
        });

        leaderboardEmbed.setDescription(description);
        leaderboardEmbed.setFooter({ text: 'Keep earning to climb the leaderboard! 💪' });

        message.channel.send({ embeds: [leaderboardEmbed] });
    },

    levelboard: async (message, economy) => {
        const allUsers = [];

        // Get all users with their levels
        for (const [userId, profile] of economy.userProfiles) {
            try {
                const user = await message.client.users.fetch(userId);

                allUsers.push({
                    userId,
                    username: user.username,
                    level: profile.level,
                    xp: profile.xp,
                    chatCount: profile.chatCount
                });
            } catch (error) {
                console.log('Error fetching user for levelboard:', error);
            }
        }

        // Sort by level (highest first), then by XP
        allUsers.sort((a, b) => {
            if (b.level !== a.level) return b.level - a.level;
            return b.xp - a.xp;
        });

        if (allUsers.length === 0) {
            return message.reply('📊 No users found in the levelboard yet!');
        }

        const levelboardEmbed = createEmbed('📊 Level Leaderboard 📊', '', 0x7289DA);

        let description = '**⭐ Highest Level Users in the Server! ⭐**\n\n';

        allUsers.slice(0, 10).forEach((user, index) => {
            const medals = ['🥇', '🥈', '🥉'];
            const medal = medals[index] || `${index + 1}.`;

            description += `${medal} **${user.username}**\n`;
            description +=`   📊 Level ${user.level} | ✨ ${user.xp.toLocaleString()} XP | 💬 ${user.chatCount} messages\n\n`;
        });

        levelboardEmbed.setDescription(description);
        levelboardEmbed.setFooter({ text: 'Keep chatting to level up! 🚀' });

        message.channel.send({ embeds: [levelboardEmbed] });
    },

    beg: async (message, economy) => {
        const result = economy.beg(message.author.id);
        if (!result.success) return message.reply(`❌ ${result.error}`);

        if (!result.earned) {
            const begEmbed = createEmbed('😔 Begging Failed', result.message, 0xFF6B6B);
            message.channel.send({ embeds: [begEmbed] });
        } else {
            economy.addUserXP(message.author.id, 10);
            let begDescription = `${result.message}\n\n`;
            begDescription += `💰 **Earned:** ${result.amount} 🌟 Vibecoins\n`;
            begDescription += `📊 **XP Gained:** +10 XP\n`;
            begDescription += `💰 **New Balance:** ${result.newBalance.toLocaleString()} 🌟 Vibecoins`;

            const begEmbed = createEmbed('🥺 Begging Success!', begDescription, 0x00FF00);
            message.channel.send({ embeds: [begEmbed] });
        }
    },

    steal: async (message, economy) => {
        const result = economy.steal(message.author.id);
        if (!result.success) return message.reply(`❌ ${result.error}`);

        if (!result.earned) {
            const stealEmbed = createEmbed('🚫 Stealing Failed', result.message, 0xFF6B6B);
            message.channel.send({ embeds: [stealEmbed] });
        } else {
            economy.addUserXP(message.author.id, 15);
            let stealDescription = `${result.message}\n\n`;
            stealDescription += `💰 **Stolen:** ${result.amount} 🌟 Vibecoins\n`;
            stealDescription += `📊 **XP Gained:** +15 XP\n`;
            stealDescription += `💰 **New Balance:** ${result.newBalance.toLocaleString()} 🌟 Vibecoins`;

            const stealEmbed = createEmbed('😈 Stealing Success!', stealDescription, 0x9932CC);
            message.channel.send({ embeds: [stealEmbed] });
        }
    },

    pray: async (message, economy) => {
        const result = economy.pray(message.author.id);
        if (!result.success) return message.reply(`❌ ${result.error}`);

        economy.addUserXP(message.author.id, 20);
        let prayDescription = `${result.message}\n\n`;
        prayDescription += `💰 **Blessed with:** ${result.amount} 🌟 Vibecoins\n`;
        prayDescription += `📊 **XP Gained:** +20 XP\n`;
        prayDescription += `💰 **New Balance:** ${result.newBalance.toLocaleString()} 🌟 Vibecoins`;

        const prayEmbed = createEmbed('🙏 Prayer Answered!', prayDescription, 0xFFD700);
        message.channel.send({ embeds: [prayEmbed] });
    },

    gamble: async (message, economy) => {
        const betAmount = parseInt(args[0]);
        if (!betAmount || betAmount <= 0) {
            return message.reply('❌ Please specify a valid bet amount!');
        }

        const userBalance = economy.getUserBalance(message.author.id);
        if (userBalance < betAmount) {
            return message.reply(`❌ Insufficient funds! You have **${userBalance.toLocaleString()}** 🌟 Vibecoins but need **${betAmount.toLocaleString()}**.`);
        }

        const win = Math.random() < 0.4; // 40% chance to win
        const multiplier = win ? (Math.random() * 1.5 + 1.5) : 0; // 1.5x to 3x multiplier
        const winAmount = win ? Math.floor(betAmount * multiplier) - betAmount : -betAmount;

        economy.updateUserBalance(message.author.id, winAmount);
        economy.addUserXP(message.author.id, win ? 25 : 10);

        const resultEmoji = win ? '🎰' : '💸';
        let gambleDescription = `${resultEmoji} ${win ? 'JACKPOT! You won!' : 'You lost...'}\n\n`;

        if (win) {
            gambleDescription += `🎉 **Multiplier:** ${multiplier.toFixed(2)}x\n`;
            gambleDescription += `💰 **Won:** ${Math.abs(winAmount).toLocaleString()} 🌟 Vibecoins\n`;
        } else {
            gambleDescription += `💸 **Lost:** ${Math.abs(winAmount).toLocaleString()} 🌟 Vibecoins\n`;
        }

        gambleDescription += `📊 **XP Gained:** +${win ? 25 : 10} XP\n`;
        gambleDescription += `💰 **New Balance:** ${economy.getUserBalance(message.author.id).toLocaleString()} 🌟 Vibecoins`;

        const gambleEmbed = createEmbed(`🎰 Gambling ${win ? 'Win!' : 'Loss'}`, gambleDescription, win ? 0x00FF00 : 0xFF0000);
        message.channel.send({ embeds: [gambleEmbed] });
    },

    slots: async (message, economy) => {
        const betAmount = parseInt(args[0]);
        if (!betAmount || betAmount <= 0) {
            return message.reply('❌ Please specify a valid bet amount!');
        }

        const userBalance = economy.getUserBalance(message.author.id);
        if (userBalance < betAmount) {
            return message.reply(`❌ Insufficient funds! You have **${userBalance.toLocaleString()}** 🌟 Vibecoins but need **${betAmount.toLocaleString()}**.`);
        }

        const symbols = ['🍒', '🍊', '🍋', '🍇', '⭐', '💎', '7️⃣'];
        const reels = [
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)]
        ];

        let multiplier = 0;
        if (reels[0] === reels[1] && reels[1] === reels[2]) {
            // All three match
            if (reels[0] === '💎') multiplier = 10;
            else if (reels[0] === '7️⃣') multiplier = 8;
            else if (reels[0] === '⭐') multiplier = 5;
            else multiplier = 3;
        } else if (reels[0] === reels[1] || reels[1] === reels[2] || reels[0] === reels[2]) {
            // Two match
            multiplier = 1.5;
        }

        const winAmount = multiplier > 0 ? Math.floor(betAmount * multiplier) - betAmount : -betAmount;
        economy.updateUserBalance(message.author.id, winAmount);
        economy.addUserXP(message.author.id, multiplier > 0 ? 20 : 5);

        let slotsDescription = `🎰 **SLOT MACHINE** 🎰\n\n`;
        slotsDescription += `[ ${reels.join(' | ')} ]\n\n`;

        if (multiplier > 0) {
            slotsDescription += `🎉 **WIN!** 🎉\n`;
            slotsDescription += `💫 **Multiplier:** ${multiplier}x\n`;
            slotsDescription += `💰 **Won:** ${Math.abs(winAmount).toLocaleString()} 🌟 Vibecoins\n`;
        } else {
            slotsDescription += `💸 **No match!** Better luck next time!\n`;
            slotsDescription += `💰 **Lost:** ${Math.abs(winAmount).toLocaleString()} 🌟 Vibecoins\n`;
        }

        slotsDescription += `📊 **XP Gained:** +${multiplier > 0 ? 20 : 5} XP\n`;
        slotsDescription += `💰 **New Balance:** ${economy.getUserBalance(message.author.id).toLocaleString()} 🌟 Vibecoins`;

        const slotsEmbed = createEmbed('🎰 Slot Machine', slotsDescription, multiplier > 0 ? 0x00FF00 : 0xFF6B6B);
        message.channel.send({ embeds: [slotsEmbed] });
    },

    // Couple Adventures
    coupleadventure: async (message, economy) => {
        if (!economy.isMarried(message.author.id)) {
            return message.reply('❌ You need to be married to go on couple adventures!');
        }

        const spouse = economy.getSpouse(message.author.id);
        const coupleProfile = economy.getCoupleProfile(message.author.id);

        if (coupleProfile.loveLevel < 100) {
            return message.reply(`❌ You need at least 100 love XP to go on adventures! Current: ${coupleProfile.loveLevel}`);
        }

        if (!economy.canCoupleAdventure(message.author.id)) {
            return message.reply('❌ You can only go on one adventure per day! Try again tomorrow.');
        }

        const adventures = [
            {
                name: 'Romantic Picnic',
                reward: { coins: 5000, loveXP: 50 },
                description: 'You and your partner enjoyed a beautiful picnic under the stars! 🌟🧺'
            },
            {
                name: 'Beach Walk',
                reward: { coins: 3000, loveXP: 30 },
                description: 'You walked hand in hand along the sunset beach! 🏖️💕'
            },
            {
                name: 'Movie Night',
                reward: { coins: 2000, loveXP: 25 },
                description: 'You cuddled up for a cozy movie marathon! 🍿💖'
            },
            {
                name: 'Restaurant Date',
                reward: { coins: 8000, loveXP: 75 },
                description: 'You had a fancy dinner at a 5-star restaurant! 🍽️✨'
            },
            {
                name: 'Adventure Park',
                reward: { coins: 10000, loveXP: 100 },
                description: 'You conquered thrilling rides together! What an adrenaline rush! 🎢🎡'
            }
        ];

        const adventure = adventures[Math.floor(Math.random() * adventures.length)];
        
        economy.updateUserBalance(message.author.id, adventure.reward.coins);
        economy.updateUserBalance(spouse, adventure.reward.coins);
        economy.addLoveXP(message.author.id, adventure.reward.loveXP);
        economy.addLoveXP(spouse, adventure.reward.loveXP);
        economy.setCoupleAdventureCooldown(message.author.id);

        const adventureEmbed = createEmbed('💑 Couple Adventure!', 
            `**${adventure.name}**\n\n${adventure.description}\n\n` +
            `💰 **Rewards for both partners:**\n` +
            `• ${adventure.reward.coins.toLocaleString()} 🌟 Vibecoins\n` +
            `• ${adventure.reward.loveXP} Love XP\n\n` +
            `💕 Your love grows stronger together! 💕`, 0xFF69B4);
        
        message.channel.send({ embeds: [adventureEmbed] });
    },

    // Date Game
    datenight: async (message, economy) => {
        if (!economy.isMarried(message.author.id)) {
            return message.reply('❌ You need to be married to have date nights!');
        }

        const spouse = economy.getSpouse(message.author.id);
        const coupleProfile = economy.getCoupleProfile(message.author.id);

        const dateActivities = [
            { activity: 'cooking together', points: 20, cost: 1000 },
            { activity: 'dancing', points: 30, cost: 2000 },
            { activity: 'stargazing', points: 25, cost: 500 },
            { activity: 'gaming marathon', points: 35, cost: 3000 },
            { activity: 'spa day', points: 40, cost: 5000 }
        ];

        const randomActivity = dateActivities[Math.floor(Math.random() * dateActivities.length)];
        
        const userBalance = economy.getUserBalance(message.author.id);
        if (userBalance < randomActivity.cost) {
            return message.reply(`❌ You need ${randomActivity.cost.toLocaleString()} 🌟 Vibecoins for this date activity!`);
        }

        economy.updateUserBalance(message.author.id, -randomActivity.cost);
        economy.addLoveXP(message.author.id, randomActivity.points);
        economy.addLoveXP(spouse, randomActivity.points);

        const dateEmbed = createEmbed('💕 Date Night!', 
            `You and your partner spent the evening **${randomActivity.activity}**! 💖\n\n` +
            `💰 **Cost:** ${randomActivity.cost.toLocaleString()} 🌟 Vibecoins\n` +
            `💕 **Love XP Gained:** ${randomActivity.points} (both partners)\n\n` +
            `*Your bond grows stronger! 💞*`, 0xFF1493);

        message.channel.send({ embeds: [dateEmbed] });
    },

    // Family Adventures
    familyadventure: async (message, economy) => {
        const family = economy.getUserFamily(message.author.id);
        if (!family) {
            return message.reply('❌ You need to be in a family to go on family adventures!');
        }

        if (!economy.canFamilyAdventure(family.id)) {
            return message.reply('❌ Your family can only go on one adventure per day!');
        }

        const familyAdventures = [
            {
                name: 'Family Camping Trip',
                reward: { coins: 8000, familyXP: 100 },
                description: 'The whole family enjoyed roasting marshmallows under the stars! 🏕️🔥'
            },
            {
                name: 'Theme Park Visit',
                reward: { coins: 12000, familyXP: 150 },
                description: 'Everyone screamed with joy on the roller coasters! 🎢🎡'
            },
            {
                name: 'Family Game Night',
                reward: { coins: 5000, familyXP: 75 },
                description: 'Laughter filled the house during board game chaos! 🎲🃏'
            },
            {
                name: 'Beach Vacation',
                reward: { coins: 15000, familyXP: 200 },
                description: 'Sun, sand, and smiles made perfect family memories! 🏖️☀️'
            },
            {
                name: 'Museum Tour',
                reward: { coins: 6000, familyXP: 80 },
                description: 'Everyone learned something new and exciting! 🏛️📚'
            }
        ];

        const adventure = familyAdventures[Math.floor(Math.random() * familyAdventures.length)];
        
        // Reward all family members
        family.members.forEach(memberId => {
            economy.updateUserBalance(memberId, adventure.reward.coins);
        });

        economy.addFamilyXP(family.id, adventure.reward.familyXP);
        economy.setFamilyAdventureCooldown(family.id);

        const familyAdventureEmbed = createEmbed('👨‍👩‍👧‍👦 Family Adventure!', 
            `**${adventure.name}**\n\n${adventure.description}\n\n` +
            `💰 **Rewards for all family members:**\n` +
            `• ${adventure.reward.coins.toLocaleString()} 🌟 Vibecoins each\n` +
            `• ${adventure.reward.familyXP} Family XP\n\n` +
            `👨‍👩‍👧‍👦 Family bonds grow stronger! 👨‍👩‍👧‍👦`, 0x32CD32);
        
        message.channel.send({ embeds: [familyAdventureEmbed] });
    },

    // Birthday and Anniversary System
    celebrate: async (message, args, economy) => {
        const celebrationType = args[0]?.toLowerCase();
        
        if (celebrationType === 'birthday') {
            const birthdayUser = message.mentions.users.first();
            if (!birthdayUser) {
                return message.reply('❌ Please mention someone for their birthday celebration!');
            }

            const birthdayReward = 25000;
            economy.updateUserBalance(birthdayUser.id, birthdayReward);
            economy.addUserXP(birthdayUser.id, 500);

            const birthdayEmbed = createEmbed('🎂 Birthday Celebration!', 
                `🎉 Happy Birthday ${birthdayUser}! 🎉\n\n` +
                `🎁 **Birthday Gifts:**\n` +
                `• ${birthdayReward.toLocaleString()} 🌟 Vibecoins\n` +
                `• 500 XP\n` +
                `• 🎂 Birthday Badge\n\n` +
                `*May your special day be filled with joy! 🎈*`, 0xFFD700);

            message.channel.send({ embeds: [birthdayEmbed] });

        } else if (celebrationType === 'anniversary') {
            if (!economy.isMarried(message.author.id)) {
                return message.reply('❌ You need to be married to celebrate an anniversary!');
            }

            const spouse = economy.getSpouse(message.author.id);
            const coupleProfile = economy.getCoupleProfile(message.author.id);
            const monthsMarried = Math.floor(coupleProfile.daysTogether / 30);
            const anniversaryReward = monthsMarried * 10000;

            economy.updateUserBalance(message.author.id, anniversaryReward);
            economy.updateUserBalance(spouse, anniversaryReward);
            economy.addLoveXP(message.author.id, monthsMarried * 50);
            economy.addLoveXP(spouse, monthsMarried * 50);

            const anniversaryEmbed = createEmbed('💒 Anniversary Celebration!', 
                `💕 Happy ${monthsMarried} Month Anniversary! 💕\n\n` +
                `🎁 **Anniversary Gifts for both partners:**\n` +
                `• ${anniversaryReward.toLocaleString()} 🌟 Vibecoins each\n` +
                `• ${monthsMarried * 50} Love XP each\n` +
                `• 💒 Anniversary Badge\n\n` +
                `*Here's to many more months of love! 💖*`, 0xFF69B4);

            message.channel.send({ embeds: [anniversaryEmbed] });
        } else {
            message.reply('❌ Usage: `sab!celebrate birthday @user` or `sab!celebrate anniversary`');
        }
    }
};