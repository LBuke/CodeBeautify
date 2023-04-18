export const data = {
    name: 'messageCreate',
    once: false,
    async execute(message, bot) {
        if (message.author.bot)
            return;

        if (message.content.startsWith('```') && message.content.endsWith('```')) {
            const content = message.content.substring(4, message.content.length - 3);

            await message.delete();

            const code = encodeURIComponent(content);
            const link = `https://kod.so/gen?code=${code}&watermark=cubecolony.net&background=blue&codeLineHeight=1&codeFontSize=12&borderRadius=16&tabSize=3&header=0`;

            const exampleEmbed = { image: { url: link } };
            message.channel.send({ embeds: [exampleEmbed] });
        }
    }
}
