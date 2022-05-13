const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports  = {
    data: new SlashCommandBuilder()
	.setName('echo')
	.setDescription('Replies with your input!')
	.addStringOption(option =>
		option.setName('input')
			.setDescription('The input to echo back')
			.setRequired(true)),
    async execute(interaction) { //interaction is CommandInteraction type
        interaction.reply(interaction.options.data[0].value);
    }
};