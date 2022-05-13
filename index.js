const fs = require('node:fs');
// Require the necessary discord.js classes
const { Client, Intents, Collection } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if(event.once){
		client.once(event.name, async(...args) => {
			try {
				await event.execute(...args);
			}
			catch(error) {
				console.log(`ERROR: ${error}`);
			// somehow reply to the user that made the interaction that you failed
			}
		});
	}
	else{
		client.on(event.name, async(...args) => {
			try {
				await event.execute(...args);
			}
			catch(error){
				console.log(`ERROR: ${error}`);
			}
		})
	}
}
//perform the command now
client.on('interactionCreate', async interaction => {
    if(!interaction.isCommand()) return; //not command? then turn.
	
	const command = client.commands.get(interaction.commandName);
	if(!command)
		return;

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.log(error);
		await interaction.reply({
			content: "i fked up sorri",
			ephemeral: true
		});
	}
});
// Login to Discord with your client's token
client.login(token);
