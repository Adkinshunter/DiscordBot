const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior } = require('@discordjs/voice');
const { createReadStream } = require('fs');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
    if (message.content === '!play') {
        const voiceChannel = message.member.voice.channel;

        if (voiceChannel) {
            try {
                const connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: voiceChannel.guild.id,
                    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                    selfDeaf: false,
                });

                const player = createAudioPlayer({
                    behaviors: {
                        noSubscriber: NoSubscriberBehavior.Pause,
                    },
                });

                player.on('stateChange', (oldState, newState) => {
                    console.log(`State change: ${oldState.status} => ${newState.status}`);
                });

                player.on('error', (error) => {
                    console.error(`Error: ${error.message}`);
                });

                const resource = createAudioResource(createReadStream('C:/Users/Adkins/Desktop/WizardWav/files/Wizard.wav'));

                player.play(resource);
                connection.subscribe(player);

            } catch (error) {
                console.error(`An error occurred: ${error.message}`);
            }
        } else {
            message.reply('You need to be in a voice channel to use this command!');
        }
    }
});


client.login('MTE4ODk4MzI3MDQwNzQyNjE1OQ.G9Zdd9.6pfsWWdSeA1Y1ItI6REGyyE_B18AnXZKQh8FnM');