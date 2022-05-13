const { SlashCommandBuilder, SelectMenuOptionBuilder } = require('@discordjs/builders');
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
        let regex = [/ls/, /mkdir/, /cd/, /pwd/, /\.\./, /print.*\/.*\.(jpg|png)/, /edit/, /movefile/, /.*link/, /rmdir/, /mkfifo/, /umask/, /.stat/, /isdir/, /readdir/, /file_in_path/, /recycle/, /delete/, /glob/, /copyfile/, /rename/, /"/];
        for(let rt of regex) {
            if(rt.exec(input) !== null) {
                await interaction.reply("Access denied");
                console.log(rt);
                console.log(`${interaction.user.tag} was being sneaky`);
                return;
            }
        }

        if(/plot/.exec(input) !== null) {
            input = input + '; print -djpg temp.jpg';
        }

        const child = exec(`octave --eval "${input}"`, async function (error, stdout, stderr) {
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
                    await interaction.reply("...");
            }

        }
        );
        chokidar.watch('temp.jpg').once('change', async (event, path) => {
            await new Promise(resolve => setTimeout(resolve, 100));
            await interaction.channel.send({files: ["./temp.jpg"]});
        });
        
    }
}