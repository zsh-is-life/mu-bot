const { SlashCommandBuilder } = require('@discordjs/builders');
const { exec } = require('child_process')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('octave')
        .setDescription('Run Octave code!')
        .addStringOption(option =>
            option.setName('input')
            .setDescription('input for Octave to run')
            .setRequired(true)
            ),

    async execute(interaction) {
        const child = exec(`octave --eval '${interaction.options.data[0].value}'`, function (error, stdout, stderr) {
            if (error) {
                console.log(error.stack);
                console.log('Error code: ' + error.code);
                console.log('Signal received: ' + error.signal);
                interaction.reply(`Error Code: ${error.code} | Signal recieved: ${error.signal}`);
                interaction.channel.send(`${stderr}`);
            }
            else {
                console.log('Child Process STDOUT: ' + stdout);
                if(stdout !== "")
                    interaction.reply(stdout);
                else
                    interaction.reply("Octave sent back no reply...");
            }

            }
        );
    }
}