export const data = {
    name: 'ready',
    once: true,
    execute(bot) {
        console.log(`${bot.user.username} is online on ${bot.guilds.cache.size} servers!`);
        bot.user.setPresence({ activities: [{ name: `${bot.guilds.cache.size} servers!`}] });
    }
}

function fizzbuzz() {
    for (let i = 0; i < 100; i++) {
        if (i % 3 === 0 && i % 5 === 0) console.log('FizzBuzz');
        else if (i % 3 === 0) console.log('Fizz');
        else if (i % 5 === 0) console.log('Buzz');
        else console.log(i);
    }
}
