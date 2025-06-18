
const { EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const yts = require('youtube-search-api');

function createEmbed(title, description, color = 0x00AE86) {
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setTimestamp();
}

// Music system state
const musicState = new Map();

function getMusicState(guildId) {
    if (!musicState.has(guildId)) {
        musicState.set(guildId, {
            queue: [],
            isPlaying: false,
            connection: null,
            player: null,
            currentSong: null,
            volume: 50,
            loop: false,
            shuffle: false
        });
    }
    return musicState.get(guildId);
}

async function playSong(guildState, song) {
    if (!guildState.connection) return false;

    try {
        console.log(`Attempting to play: ${song.title}`);
        
        // Enhanced ytdl options for better compatibility
        const stream = ytdl(song.url, {
            filter: 'audioonly',
            quality: 'lowestaudio',
            highWaterMark: 1 << 25,
            requestOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Sec-Fetch-Mode': 'navigate'
                }
            }
        });

        const resource = createAudioResource(stream, {
            inputType: 'arbitrary',
            inlineVolume: true
        });

        if (!guildState.player) {
            guildState.player = createAudioPlayer();
            guildState.connection.subscribe(guildState.player);
        }

        // Set volume
        if (resource.volume) {
            resource.volume.setVolume(guildState.volume / 100);
        }

        guildState.player.play(resource);
        guildState.currentSong = song;
        guildState.isPlaying = true;

        console.log(`Now playing: ${song.title}`);
        return true;
    } catch (error) {
        console.error('Error playing song:', error);
        return false;
    }
}

async function playNext(guildId) {
    const state = getMusicState(guildId);
    
    if (state.loop && state.currentSong) {
        // If looping, play current song again
        await playSong(state, state.currentSong);
        return;
    }
    
    if (state.queue.length === 0) {
        state.isPlaying = false;
        state.currentSong = null;
        return;
    }

    let nextSong;
    if (state.shuffle) {
        // Random song from queue
        const randomIndex = Math.floor(Math.random() * state.queue.length);
        nextSong = state.queue.splice(randomIndex, 1)[0];
    } else {
        // Next song in order
        nextSong = state.queue.shift();
    }
    
    await playSong(state, nextSong);
}

// Enhanced YouTube search function
async function searchYouTube(query) {
    try {
        console.log(`Searching for: ${query}`);
        const results = await yts.GetListByKeyword(query, false, 5);
        
        if (!results.items || results.items.length === 0) {
            return null;
        }

        const video = results.items[0];
        return {
            title: video.title,
            url: `https://www.youtube.com/watch?v=${video.id}`,
            duration: video.length?.simpleText || 'Unknown',
            thumbnail: video.thumbnail?.thumbnails?.[0]?.url || `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`,
            channel: video.channelTitle || 'Unknown',
            videoId: video.id
        };
    } catch (error) {
        console.error('YouTube search error:', error);
        return null;
    }
}

module.exports = {
    play: async (message, args) => {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply('❌ You need to be in a voice channel to play music!');
        }

        if (!args.length) {
            return message.reply('❌ Please provide a song name or YouTube URL!\n\n**Examples:**\n`sab!play Never Gonna Give You Up`\n`sab!play https://www.youtube.com/watch?v=dQw4w9WgXcQ`');
        }

        const query = args.join(' ');
        const state = getMusicState(message.guild.id);

        // Show searching message
        const searchEmbed = createEmbed('🔍 Searching...', `Looking for: **${query}**`, 0xFFD700);
        const searchMsg = await message.channel.send({ embeds: [searchEmbed] });

        try {
            let songInfo;
            
            if (ytdl.validateURL(query)) {
                // Direct YouTube URL
                try {
                    const info = await ytdl.getInfo(query);
                    songInfo = {
                        title: info.videoDetails.title,
                        url: query,
                        duration: Math.floor(info.videoDetails.lengthSeconds / 60) + ':' + 
                                String(info.videoDetails.lengthSeconds % 60).padStart(2, '0'),
                        thumbnail: info.videoDetails.thumbnails[0]?.url,
                        channel: info.videoDetails.author.name,
                        videoId: info.videoDetails.videoId
                    };
                } catch (error) {
                    await searchMsg.delete().catch(() => {});
                    return message.reply('❌ Invalid YouTube URL or video is unavailable!');
                }
            } else {
                // Search for song
                songInfo = await searchYouTube(query);
                if (!songInfo) {
                    await searchMsg.delete().catch(() => {});
                    return message.reply('❌ No songs found with that query! Try a different search term.');
                }
            }

            const song = {
                title: songInfo.title,
                url: songInfo.url,
                duration: songInfo.duration,
                thumbnail: songInfo.thumbnail,
                channel: songInfo.channel,
                requestedBy: message.author.username,
                requestedById: message.author.id
            };

            // Join voice channel if not connected
            if (!state.connection || state.connection.state.status === VoiceConnectionStatus.Destroyed) {
                try {
                    state.connection = joinVoiceChannel({
                        channelId: voiceChannel.id,
                        guildId: message.guild.id,
                        adapterCreator: message.guild.voiceAdapterCreator,
                        selfDeaf: true,
                        selfMute: false
                    });

                    state.player = createAudioPlayer();
                    state.connection.subscribe(state.player);

                    // Handle connection events
                    state.connection.on(VoiceConnectionStatus.Ready, () => {
                        console.log('🎵 Successfully connected to voice channel!');
                    });

                    state.connection.on(VoiceConnectionStatus.Disconnected, () => {
                        console.log('🔇 Voice connection disconnected');
                        setTimeout(() => {
                            if (state.connection?.state.status === VoiceConnectionStatus.Disconnected) {
                                state.connection?.destroy();
                                state.connection = null;
                                state.player = null;
                                state.isPlaying = false;
                            }
                        }, 5000);
                    });

                    // Handle player events
                    state.player.on(AudioPlayerStatus.Idle, () => {
                        console.log('Song finished, playing next...');
                        setTimeout(() => playNext(message.guild.id), 2000);
                    });

                    state.player.on('error', error => {
                        console.error('Audio player error:', error);
                        message.channel.send('❌ An error occurred while playing audio. Skipping to next song...');
                        setTimeout(() => playNext(message.guild.id), 2000);
                    });

                } catch (error) {
                    console.error('Error joining voice channel:', error);
                    await searchMsg.delete().catch(() => {});
                    return message.reply('❌ Failed to join voice channel! Make sure I have the right permissions.\n\n**Required Permissions:**\n• Connect\n• Speak\n• View Channel');
                }
            }

            await searchMsg.delete().catch(() => {});

            // Add to queue
            if (!state.isPlaying && state.queue.length === 0) {
                // Play immediately
                state.queue.push(song);
                const success = await playSong(state, state.queue.shift());
                
                if (success) {
                    const playingEmbed = createEmbed('🎵 Now Playing', 
                        `**${song.title}**\n` +
                        `🎤 **Channel:** ${song.channel}\n` +
                        `👤 **Requested by:** ${song.requestedBy}\n` +
                        `⏱️ **Duration:** ${song.duration}\n` +
                        `🔊 **Volume:** ${state.volume}%`, 0x00FF00);
                    
                    if (song.thumbnail) {
                        playingEmbed.setThumbnail(song.thumbnail);
                    }
                    
                    message.channel.send({ embeds: [playingEmbed] });
                } else {
                    message.reply('❌ Failed to play the song. The video might be unavailable or age-restricted.');
                }
            } else {
                // Add to queue
                state.queue.push(song);
                
                const queueEmbed = createEmbed('➕ Added to Queue', 
                    `**${song.title}**\n` +
                    `🎤 **Channel:** ${song.channel}\n` +
                    `👤 **Requested by:** ${song.requestedBy}\n` +
                    `📋 **Position:** ${state.queue.length}\n` +
                    `⏱️ **Duration:** ${song.duration}`, 0xFFD700);
                
                if (song.thumbnail) {
                    queueEmbed.setThumbnail(song.thumbnail);
                }
                
                message.channel.send({ embeds: [queueEmbed] });
            }

        } catch (error) {
            console.error('Music play error:', error);
            await searchMsg.delete().catch(() => {});
            message.reply('❌ An error occurred while trying to play the song. This might be due to:\n• Video being unavailable\n• Age restrictions\n• Copyright blocks\n\nTry a different song!');
        }
    },

    pause: async (message) => {
        const state = getMusicState(message.guild.id);
        
        if (!state.player || !state.isPlaying) {
            return message.reply('❌ No music is currently playing!');
        }

        if (state.player.state.status === AudioPlayerStatus.Paused) {
            return message.reply('❌ Music is already paused!');
        }

        state.player.pause();
        
        const pauseEmbed = createEmbed('⏸️ Music Paused', 
            `**${state.currentSong?.title}** has been paused.\n\nUse \`sab!resume\` to continue playing.`, 0xFFAA00);
        message.channel.send({ embeds: [pauseEmbed] });
    },

    resume: async (message) => {
        const state = getMusicState(message.guild.id);
        
        if (!state.player) {
            return message.reply('❌ No music is currently paused!');
        }

        if (state.player.state.status !== AudioPlayerStatus.Paused) {
            return message.reply('❌ Music is not paused!');
        }

        state.player.unpause();
        
        const resumeEmbed = createEmbed('▶️ Music Resumed', 
            `**${state.currentSong?.title}** has been resumed.`, 0x00FF00);
        message.channel.send({ embeds: [resumeEmbed] });
    },

    skip: async (message) => {
        const state = getMusicState(message.guild.id);
        
        if (!state.player || !state.isPlaying) {
            return message.reply('❌ No music is currently playing!');
        }

        const skippedSong = state.currentSong;
        state.player.stop();
        
        const skipEmbed = createEmbed('⏭️ Song Skipped', 
            `Skipped: **${skippedSong?.title}**\n\n${state.queue.length > 0 ? 'Playing next song...' : 'Queue is empty!'}`, 0xFFAA00);
        message.channel.send({ embeds: [skipEmbed] });
    },

    stop: async (message) => {
        const state = getMusicState(message.guild.id);
        
        if (!state.connection) {
            return message.reply('❌ I\'m not connected to a voice channel!');
        }

        state.queue = [];
        state.isPlaying = false;
        state.currentSong = null;
        state.loop = false;
        state.shuffle = false;
        
        if (state.player) {
            state.player.stop();
        }
        
        if (state.connection) {
            state.connection.destroy();
            state.connection = null;
            state.player = null;
        }

        const stopEmbed = createEmbed('⏹️ Music Stopped', 
            'Music stopped and disconnected from voice channel.\n\nThanks for listening! 🎵', 0xFF0000);
        message.channel.send({ embeds: [stopEmbed] });
    },

    queue: async (message) => {
        const state = getMusicState(message.guild.id);
        
        if (!state.currentSong && state.queue.length === 0) {
            return message.reply('❌ The music queue is empty!\n\nAdd some songs with `sab!play <song name>`');
        }

        let queueDescription = '';
        
        if (state.currentSong) {
            queueDescription += `🎵 **Now Playing:**\n**${state.currentSong.title}**\n🎤 ${state.currentSong.channel}\n👤 Requested by: ${state.currentSong.requestedBy}\n⏱️ Duration: ${state.currentSong.duration}\n\n`;
        }
        
        if (state.queue.length > 0) {
            queueDescription += `📋 **Queue (${state.queue.length} songs):**\n`;
            state.queue.slice(0, 10).forEach((song, index) => {
                queueDescription += `**${index + 1}.** ${song.title}\n   🎤 ${song.channel} | 👤 ${song.requestedBy} | ⏱️ ${song.duration}\n`;
            });
            
            if (state.queue.length > 10) {
                queueDescription += `\n... and **${state.queue.length - 10}** more songs`;
            }
        } else if (state.currentSong) {
            queueDescription += `📋 **Queue is empty!**\nAdd more songs with \`sab!play <song name>\``;
        }

        // Add current settings
        queueDescription += `\n\n⚙️ **Settings:**\n🔊 Volume: ${state.volume}%\n🔄 Loop: ${state.loop ? 'On' : 'Off'}\n🔀 Shuffle: ${state.shuffle ? 'On' : 'Off'}`;

        const queueEmbed = createEmbed('🎵 Music Queue', queueDescription, 0x9932CC);
        message.channel.send({ embeds: [queueEmbed] });
    },

    nowplaying: async (message) => {
        const state = getMusicState(message.guild.id);
        
        if (!state.currentSong) {
            return message.reply('❌ No music is currently playing!\n\nStart listening with `sab!play <song name>`');
        }

        const npEmbed = createEmbed('🎵 Now Playing', 
            `**${state.currentSong.title}**\n\n` +
            `🎤 **Channel:** ${state.currentSong.channel}\n` +
            `👤 **Requested by:** ${state.currentSong.requestedBy}\n` +
            `⏱️ **Duration:** ${state.currentSong.duration}\n` +
            `🔊 **Volume:** ${state.volume}%\n` +
            `🔄 **Loop:** ${state.loop ? 'On' : 'Off'}\n` +
            `🔀 **Shuffle:** ${state.shuffle ? 'On' : 'Off'}\n` +
            `📋 **Songs in queue:** ${state.queue.length}\n` +
            `🎵 **Status:** ${state.isPlaying ? 'Playing' : 'Paused'}`, 0x00AE86);
        
        if (state.currentSong.thumbnail) {
            npEmbed.setThumbnail(state.currentSong.thumbnail);
        }
        
        message.channel.send({ embeds: [npEmbed] });
    },

    volume: async (message, args) => {
        const state = getMusicState(message.guild.id);
        
        if (!args[0]) {
            const volumeEmbed = createEmbed('🔊 Current Volume', 
                `Current volume is set to **${state.volume}%**\n\nUse \`sab!volume <0-100>\` to change it!`, 0x00AE86);
            return message.channel.send({ embeds: [volumeEmbed] });
        }

        const volume = parseInt(args[0]);
        if (isNaN(volume) || volume < 0 || volume > 100) {
            return message.reply('❌ Please provide a volume between **0** and **100**!\n\nExample: `sab!volume 50`');
        }

        state.volume = volume;
        
        if (state.player && state.player.state.resource && state.player.state.resource.volume) {
            state.player.state.resource.volume.setVolume(volume / 100);
        }

        const volumeEmbed = createEmbed('🔊 Volume Changed', 
            `Volume set to **${volume}%**${volume === 0 ? ' (Muted)' : volume === 100 ? ' (Maximum)' : ''}`, 0x00FF00);
        message.channel.send({ embeds: [volumeEmbed] });
    },

    // New commands for enhanced functionality
    loop: async (message) => {
        const state = getMusicState(message.guild.id);
        
        if (!state.currentSong) {
            return message.reply('❌ No music is currently playing!');
        }

        state.loop = !state.loop;
        
        const loopEmbed = createEmbed(`🔄 Loop ${state.loop ? 'Enabled' : 'Disabled'}`, 
            `Loop is now **${state.loop ? 'ON' : 'OFF'}**\n\n${state.loop ? 'Current song will repeat!' : 'Queue will play normally.'}`, 
            state.loop ? 0x00FF00 : 0xFF6B6B);
        message.channel.send({ embeds: [loopEmbed] });
    },

    shuffle: async (message) => {
        const state = getMusicState(message.guild.id);
        
        if (state.queue.length === 0) {
            return message.reply('❌ Queue is empty! Add some songs first.');
        }

        state.shuffle = !state.shuffle;
        
        const shuffleEmbed = createEmbed(`🔀 Shuffle ${state.shuffle ? 'Enabled' : 'Disabled'}`, 
            `Shuffle is now **${state.shuffle ? 'ON' : 'OFF'}**\n\n${state.shuffle ? 'Songs will play randomly!' : 'Songs will play in order.'}`, 
            state.shuffle ? 0x00FF00 : 0xFF6B6B);
        message.channel.send({ embeds: [shuffleEmbed] });
    },

    clear: async (message) => {
        const state = getMusicState(message.guild.id);
        
        if (state.queue.length === 0) {
            return message.reply('❌ Queue is already empty!');
        }

        const clearedCount = state.queue.length;
        state.queue = [];
        
        const clearEmbed = createEmbed('🗑️ Queue Cleared', 
            `Removed **${clearedCount}** songs from the queue!\n\nCurrent song will continue playing.`, 0xFFAA00);
        message.channel.send({ embeds: [clearEmbed] });
    }
};
