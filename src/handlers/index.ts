import * as Discord from 'discord.js';
import  { lyricsMessageHandler } from './lyrics';

const handlers: Array<any> = [lyricsMessageHandler];

export const messageHandler = (message: Discord.Message, client: Discord.Client) => {
	return handlers.forEach(handler => {
		return handler(message, client);
	});
};