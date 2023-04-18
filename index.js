import fs from 'fs';
import { Client, Intents, Collection } from 'discord.js';
import { config } from './config.js';

const bot = new Client({
    partials: [ 'MESSAGE', 'CHANNEL', 'REACTION' ],
    intents: [ Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.MESSAGE_CONTENT ]
});

bot.commands = new Collection();

const commandFiles = fs.readdirSync('./commands/').filter(f => f.endsWith('.js'))
for (const file of commandFiles) {
    const props = await import(`./commands/${file}`)
    console.log(`${file} loaded`)
    bot.commands.set(props.data.config.name, props)
}

const commandSubFolders = fs.readdirSync('./commands/').filter(f => !f.endsWith('.js'))
commandSubFolders.forEach(async folder => {
    const commandFiles = fs.readdirSync(`./commands/${folder}/`).filter(f => f.endsWith('.js'))
    for (const file of commandFiles) {
        const props = await import(`./commands/${folder}/${file}`)
        console.log(`${file} loaded from ${folder}`)
        bot.commands.set(props.config.name, props)
    }
});

// Load Event files from events folder
const eventFiles = fs.readdirSync('./events/').filter(f => f.endsWith('.js'))
for (const file of eventFiles) {
    console.log(`${file} loaded`)
    const event = await import(`./events/${file}`)
    if(event.data.once) {
        bot.once(event.data.name, (...args) => event.data.execute(...args, bot))
    } else {
        bot.on(event.data.name, (...args) => event.data.execute(...args, bot))
    }
}

//Command Manager
bot.on("messageCreate", async message => {
    //Check if author is a bot or the message was sent in dms and return
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    //get prefix from config and prepare message so it can be read as a command
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    //Check for prefix
    if(!cmd.startsWith('!')) return;

    //Get the command from the commands collection and then if the command is found run the command file
    let commandFile = bot.commands.get(cmd.slice(prefix.length));
    if(commandFile) commandFile.run(bot,message,args);
});

(async () => {
    await bot.login(config.token);
})();
