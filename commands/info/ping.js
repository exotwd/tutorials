const { MessageEmbed } = require('discord.js')
module.exports = {
    name : 'ping', //jméno příkazu
    category : 'info', //kazegorie
    description : 'Returns latency and API ping', //popis

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {
        const msg = await message.channel.send(`🏓 Pinguji...`)
        const embed = new MessageEmbed() //nový embed
            .setTitle('Pong!') //nadpis
            .setDescription(`WebSocket ping je ${client.ws.ping}MS\nMessage edit ping je ${Math.floor(msg.createdAt - message.createdAt)}MS!`) //vypočítá ping
            await message.channel.send(embed) // poslat
            msg.delete() //smazat první zprávu

    }
}
