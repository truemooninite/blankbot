const Discord = require("discord.js");

const config = require("./config");

const client = new Discord.Client();

let chatChannel = '';

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
};

// Listeners:

client.on("ready", () => {
	console.clear();
	console.log(`Success: ${client.user.username} is now connected.\nGuilds: ${client.guilds.size}\nChannels: ${client.channels.size}\nUsers: ${client.users.size}\n`);
	client.user.setActivity(`on ${client.guilds.size} servers`);
	chatChannel = client.guilds.find('id', config.secondaryServerID).channels.find('name', config.chatChannel);
});

client.on("disconnect", () => {
	console.log(`Terminated`);

	process.exit();
});


client.on("guildCreate", guild => {
	console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
	client.user.setActivity(`on ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
	console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
	client.user.setActivity(`on ${client.guilds.size} servers`);
});

client.on('guildMemberAdd', member => {
	if (member.guild.id === '414067776089751572') member.guild.channels.find('name', 'welcome').send(`Welcome ${member.user}!`);
});

client.on('guildMemberRemove', member => {
	if (member.guild.id === '414067776089751572') member.guild.channels.find('name', 'welcome').send(`Looks like ${member.user.username} couldn't handle the split. Now they're in the gutter where they belong.`);
});

client.on("message", async message => {
	//chatChannel.send(message.author.username);
	if (message.author.bot) return;

	if (message.channel != chatChannel) return;

	let args = message.content.slice(config.prefix.length).trim();
	let command = args.shift().toLowerCase();

	if (command === "ping") {
		let m = await message.channel.send("Ping?");
		m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
		console.log(`Ping sent by: ${message.author.username}`);
		console.log(`Latency is: ${Math.round(client.ping)}ms`);
		let ava = client.guilds.find('name', config.sname).available;
		console.log(`Server available: ${ava}`);
	}

	if (command === "shoo") {
		client.user.setStatus('invisible');
		client.destroy();
	}
});

client.login(config.creds.discord.token);
