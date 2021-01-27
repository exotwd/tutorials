const { MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");
const prefix = require("../../config.json").prefix;

module.exports = {
  name: "help", //jméno příkazu
  aliases : ['h'], //další možnosti příkazu
  description: "Ukáže dostupné příkazy.", //popis příkazu
  run: async (client, message, args) => {


    const roleColor = 
      message.guild.me.displayHexColor === "#000000"
        ? "#ffffff"
        : message.guild.me.displayHexColor;

    if (!args[0]) {
      let categories = [];

      readdirSync("./commands/").forEach((dir) => { //v adresáři commands pro každou složku typu příkazů
        const commands = readdirSync(`./commands/${dir}/`).filter((file) =>  //filtruje soubor
          file.endsWith(".js") //pokud soubor končí s .js 
        );

        const cmds = commands.map((command) => { 
          let file = require(`../../commands/${dir}/${command}`);

          if (!file.name) return "Není uvedeno jméno příkazu."; //pokud není napsáno jméno příkazu vypíše error

          let name = file.name.replace(".js", ""); //vymaže .js

          return `\`${name}\``;  //do help napíše jméno bez .js
        });

        let data = new Object();

        data = {
          name: dir.toUpperCase(),
          value: cmds.length === 0 ? "In progress." : cmds.join(" "),
        };

        categories.push(data);
      });

      const embed = new MessageEmbed() //Embed help zprávy
        .setTitle("📬 Need help? Here are all of my commands:") //Nadpis 
        .addFields(categories) //Kategorie
        .setDescription( 
          `Použij\`${prefix}help\` pro informace o konkrétím příkazu. Například: \`${prefix}help ban\`.`
        )
        .setFooter( 
          `${message.author.tag}`,  //kdo příkaz použil
          message.author.displayAvatarURL({ dynamic: true }) //avatar toho kdo použil příkaz
        )
        .setTimestamp() //čas kdy bylo odesláno
        .setColor(roleColor); //barva
      return message.channel.send(embed);
    } else {
      const command =
        client.commands.get(args[0].toLowerCase()) ||
        client.commands.find(
          (c) => c.aliases && c.aliases.includes(args[0].toLowerCase())
        );

      if (!command) { //pokud takový příkaz nebyl nalezen
        const embed = new MessageEmbed() //embed
          .setTitle(`neznámý příkaz! Use \`${prefix}help\` pro všechny příkazy!`) //error zpráva
          .setColor("FF0000"); //barva
        return message.channel.send(embed); //odešle
      }

      const embed = new MessageEmbed() //nový embed
        .setTitle("Detaily O příkazu:") //Nadpis
        .addField("PREFIX:", `\`${prefix}\``) //prefix bota
        .addField( 
          "Příkaz:",
          command.name ? `\`${command.name}\`` : "-."
        )
        .addField( 
          "ALIASY:", //aliasy
          command.aliases
            ? `\`${command.aliases.join("` `")}\``
            : "Žádné aliasy." 
        )
        .addField(
          "USAGE:",
          command.usage
            ? `\`${prefix}${command.name} ${command.usage}\``
            : `\`${prefix}${command.name}\``
        )
        .addField( //popis příkazu
          "POPIS:",
          command.description
            ? command.description
            : "No description for this command."
        )
        .setFooter( 
          `${message.author.tag}`, //Kdo použil příkaz
          message.author.displayAvatarURL({ dynamic: true }) 
        )
        .setTimestamp() //datum
        .setColor(roleColor); //barva
      return message.channel.send(embed); //poslat
    }
  },
};
