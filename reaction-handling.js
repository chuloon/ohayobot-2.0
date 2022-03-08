const validGames = ['league-of-legends', 'rocket-league', 'valorant', 'partyparrot'];
const handleGameReaction = async (reaction) => {
    emojiName = reaction.emoji.name;
    if(validGames.includes(emojiName)) {
        for(let i = 0; i < validGames.length; i++) {
            if(emojiName == validGames[i]) {
                const serverRoles = reaction.message.guild.roles.cache;
                let gameData = {};
                if(!doesRoleExist(emojiName, serverRoles)) {
                    gameData = await addNewGame(reaction);
                }
                else {
                    gameData.gameRole = reaction.message.guild.roles.cache.filter(role => role.name == emojiName).first();
                    gameData.gameTextChannel = reaction.message.guild.channels.cache.filter(channel => channel.name === `${emojiName}-chat`).first();
                }
                reaction.message.member.roles.add(gameData.gameRole);
                await sendWelcomeMessage(gameData.gameTextChannel, reaction.message.author);
            }
        }
    }
    else {
        await reaction.remove();
    }
}

const handleGameReactionRemoval = async (reaction) => {
    const emojiName = reaction.emoji.name;
    const gameRole = reaction.message.guild.roles.cache.filter(role => role.name == emojiName).first();
    await reaction.message.member.roles.remove(gameRole);
}

const addNewGame = async (reaction) => {
    const gameRole = await addGameRole(reaction.message.guild.roles);
    const gameCategory = await addGameCategory(reaction.emoji.name, reaction.message.guild, gameRole);
    const gameTextChannel = await addGameTextChannels(reaction.emoji.name, reaction.message.guild, gameCategory);
    await addGameVoiceChannels(reaction.emoji.name, reaction.message.guild, gameCategory);
    

    const gameData = {
        gameRole: gameRole,
        gameTextChannel: gameTextChannel
    }

    return gameData;
}

const addGameRole = async (roles) => {
    return await roles.create({
        name: emojiName,
        color: 'RANDOM',
        reason: 'Add new game role',
        mentionable: true
    });
}

const addGameCategory = async (name, guild, gameRole) => {
    const everyoneRole = guild.roles.cache.filter(role => role.name == '@everyone').first();
    return await guild.channels.create(name, {
        type: 'GUILD_CATEGORY',
        permissionOverwrites: [
            {
                id: gameRole,
                allow: ['VIEW_CHANNEL']
            },
            {
                id: everyoneRole,
                deny: ['VIEW_CHANNEL']
            }
        ]
    });
}

const addGameTextChannels = async (name, guild, gameCategory) => {
    return await guild.channels.create(`${name}-chat`, {
        type: 'GUILD_TEXT',
        parent: gameCategory
    })
}

const addGameVoiceChannels = async (name, guild, gameCategory) => {
    return await guild.channels.create(`${name}-voice`, {
        type: 'GUILD_VOICE',
        parent: gameCategory
    })
}

const sendWelcomeMessage = async (gameTextChannel, author) => {
    return await gameTextChannel.send(`Welcome, <@${author.id}>, let's play a game!`)
}

const doesRoleExist = (roleName, serverRoles) => {
    const filteredRoles = serverRoles.filter(role => { return role.name == roleName });
    let filteredArray = Array.from(filteredRoles);
    filteredArray = [...filteredArray];
    return filteredArray.length > 0
}

module.exports = { handleGameReaction, handleGameReactionRemoval };