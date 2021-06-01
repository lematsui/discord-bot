import * as dotenv from 'dotenv';
import * as Discord from 'discord.js';
import { messageHandler } from './handlers/index'
import { Logger } from 'tslog';
dotenv.config();

const log: Logger = new Logger();
const client = new Discord.Client();

client.login(process.env.DISCORD_TOKEN);

client.on('ready', () => {
  log.info(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
	return messageHandler(message, client);
});