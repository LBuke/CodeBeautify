import fs from 'fs';
import { Client, Intents } from 'discord.js';
import { config } from './config.js';

const bot = new Client({
    partials: [ 'MESSAGE', 'CHANNEL', 'REACTION' ],
    intents: [ Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.MESSAGE_CONTENT ]
});

// Load Event files from events folder
const eventFiles = fs.readdirSync('./events/').filter(f => f.endsWith('.js'))
(async () => {
    for (const file of eventFiles) {
        console.log(`${file} loaded`)
        const event = await import(`./events/${file}`)
        if(event.data.once) {
            bot.once(event.data.name, (...args) => event.data.execute(...args, bot))
        } else {
            bot.on(event.data.name, (...args) => event.data.execute(...args, bot))
        }
    }
})()

(async () => {
    await bot.login(config.token);
})();
