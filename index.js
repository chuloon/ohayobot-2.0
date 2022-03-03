const fs = require('fs');

const Discord = require('discord.js');
const client = new Discord.Client({ 
    intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
 });

const { prefix, token } = require('./config.json');
const { handleGameReaction, handleGameReactionRemoval } = require('./reaction-handling');

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

commandFiles.forEach((file) => {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
});

client.once('ready', () => {
    console.log("Ohayobot online");
});

client.on('messageCreate', message => {
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);
    
    if (!client.commands.has(commandName)) return;
    if(message.channel.name == undefined) {
        message.reply("Your commands must be within the server, not through DMs.");
        return;
    }
    else if(message.channel.name != "command-spam" && commandName != "admin") {
        const data = ["To not spam your fellow players, we\'ve restricted commands to the #command-spam channel."];

        message.author.send(data, { split: true });
        message.delete();
        return;
    }

    try {
        command.execute(message, args);
    }
    catch (ex) {
        console.error(ex);
        message.reply('There was an error executing that command');
    }
});

client.on('messageReactionAdd', async (reaction) => {
    if(reaction.partial) {
        try {
            await reaction.fetch();
        }
        catch(ex) {
            console.error("Something went wrong", error);
            return
        }
    }

    // This is a hard coded message ID of the message we want to use
    if(reaction.message.id == 945765531460452402) {
        handleGameReaction(reaction);
    }
});

client.on('messageReactionRemove', async (reaction) => {
    if(reaction.partial) {
        try {
            await reaction.fetch();
        }
        catch(ex) {
            console.error("Something went wrong", error);
            return
        }
    }

    if(reaction.message.id == 945765531460452402) {
        handleGameReactionRemoval(reaction);
    }
});

// client.login(process.env.BOT_TOKEN);
client.login(token);