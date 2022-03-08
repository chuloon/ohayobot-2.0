module.exports = {
    name: 'team',
    description: 'Adds a player to a team, or creates it if there isn\'t a matching team already',
    usage: '<team-name>',
    async execute(message, args) {
        if(args.length !== 1) return;

        let teamRole;
        let teamTextChannel;
        const teamName = args[0].replaceAll(' ', '-').toLowerCase();
        
        if(!doesTeamExist(teamName, message.guild.roles.cache)) {
            teamRole = await createTeamRole(teamName, message.guild.roles)
            const teamCategory = await createTeamCategory(teamName, message.guild, teamRole);
            teamTextChannel = await createTeamTextChannel(message.guild, teamCategory);
            await createTeamVoiceChannel(message.guild, teamCategory);
        }
        else {
            teamRole = await message.guild.roles.cache.filter(role => role.name === `team-${teamName}`);
            const teamCategory = message.guild.channels.cache.filter(channel => channel.type == "GUILD_CATEGORY" && channel.name == teamName).first();
            teamTextChannel = message.guild.channels.cache.filter(channel => channel.parentId == teamCategory.id && channel.name == "team-chat").first();
        }
        
        await message.member.roles.add(teamRole);

        await teamTextChannel.send(`Welcome to the team, <@${message.author.id}>! *One of us, one of us*`)
        message.delete();
    }
}

doesTeamExist = (teamName, roles) => {
    const filteredRoles = roles.filter(role => role.name == `team-${teamName}`);
    let filteredArray = Array.from(filteredRoles);
    filteredArray = [...filteredArray];
    return filteredArray.length > 0;
}

const createTeamRole = async (teamName, roles) => {
    return await roles.create({
        name: `team-${teamName}`,
        color: 'YELLOW',
        reason: 'Register a new team',
        mentionable: true
    })
}

const createTeamCategory = async (teamName, guild, teamRole) => {
    const everyoneRole = guild.roles.cache.filter(role => role.name == '@everyone').first();
    return await guild.channels.create(teamName, {
        type: 'GUILD_CATEGORY',
        permissionOverwrites: [
            {
                id: teamRole,
                allow: ['VIEW_CHANNEL']
            },
            {
                id: everyoneRole,
                deny: ['VIEW_CHANNEL']
            }
        ]
    });
}

const createTeamTextChannel = async (guild, teamCategory) => {
    return await guild.channels.create('team-chat', {
        type: 'GUILD_TEXT',
        parent: teamCategory
    });
}

const createTeamVoiceChannel = async (guild, teamCategory) => {
    return await guild.channels.create('team-voice', {
        type: 'GUILD_VOICE',
        parent: teamCategory
    });
}