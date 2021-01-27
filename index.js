const {Collection, Client, Discord} = require('discord.js') 
const fs = require('fs')
const client = new Client({
    disableEveryone: true
})
const config = require('./config.json') //požaduje config.json
const prefix = config.prefix //kde je prefix
const token = config.token //kde je token
client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");
["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
}); 
client.on('ready', () => { 
    client.user.setActivity(`${prefix}help`) //nastaví status
    console.log(`${client.user.username} ✅`)
})
client.on('message', async message =>{
    if(message.author.bot) return; 
    if(!message.content.startsWith(prefix)) return; //pokud začíná prefixem
    if(!message.guild) return; 
    if(!message.member) message.member = await message.guild.fetchMember(message);
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if(cmd.length == 0 ) return;
    let command = client.commands.get(cmd)
    if(!command) command = client.commands.get(client.aliases.get(cmd));
    if(command) command.run(client, message, args) 
})
client.login(token) //přihlášení tokenem
