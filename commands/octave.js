const { SlashCommandBuilder } = require('@discordjs/builders');
const { exec } = require('child_process');
const chokidar = require('chokidar');

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
        let input = interaction.options.data[0].value;
        let regex = [/ls/, /mkdir/, /cd/, /pwd/, /\.\./];
        for(let rt of regex) {
            if(rt.exec(input) !== null) {
                await interaction.reply("Access denied");
                console.log(`${interaction.user.tag} was being sneaky`);
                return;
            }
        }
        const child = exec(`octave --eval '${interaction.options.data[0].value}'`, async function (error, stdout, stderr) {
            if (error) {
                console.log(error.stack);
                console.log('Error code: ' + error.code);
                console.log('Signal received: ' + error.signal);
                await interaction.reply(`Error Code: ${error.code} | Signal recieved: ${error.signal}`);
                await interaction.channel.send(`${stderr}`);
            }
            else {
                console.log('Child Process STDOUT: ' + stdout);
                if(stdout !== "")
                    await interaction.reply(stdout);
                else
                    await interaction.reply("Octave sent back no reply...");
            }

            }
        );
    }
}