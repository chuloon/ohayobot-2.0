module.exports = {
    name: 'team',
    description: 'Adds a player to a team, or creates it if there isn\'t a matching team already',
    usage: '<team-name>',
    execute(message, args) {
        if(args.length !== 1) return;

        if(!doesTeamExist(args[0], message.guild.roles.cache)) {
            //create category
            //create text
            //create voice
        }
        
        
        //add author to role

        //send welcome message
    }
}

doesTeamExist = (teamName, roles) => {
    const filteredRoles = roles.filter(role => role.name == teamName);
    let filteredArray = Array.from(filteredRoles);
    filteredArray = [...filteredArray];
    return filteredArray.length > 0;
}