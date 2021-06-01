import * as Discord from 'discord.js';
import * as dotenv from 'dotenv';
import { lyricsByTitleAndArtist } from '../services/lyrics';
dotenv.config();

const TITLE_AND_ARTIST_REGEX = /^(\S)(.+)(\s)(-)(\s)(\S)(.*)$/;
const CHARACTER_LIMIT = parseInt(process.env.CHARACTER_LIMIT);

export const lyricsMessageHandler = async (message: Discord.Message, client: Discord.Client) => {
	const content = message.content;

	if (!content || !content.startsWith('!lyrics ')) {
		return;
	}

	const searchTerm = content.replace('!lyrics ', '');
	const titleAndArtist = extractTitleAndArtist(searchTerm);

	if (!titleAndArtist) {
		return message.reply('Please use the SONG TITLE - ARTIST format');
	}

	const [title, artist] = titleAndArtist;

	const lyrics = await lyricsByTitleAndArtist(title, artist);

	if (!lyrics) {
		return message.reply(`No lyrics found for ${searchTerm}`);
	}

	return lyricsResponse(message, client, lyrics, true);
}

const extractTitleAndArtist = (searchTerm: string) => {
	const regexMatch = TITLE_AND_ARTIST_REGEX.test(searchTerm);

	if (!regexMatch) {
		return false;
	}

	const dashIndex = searchTerm.indexOf('-');
	const title = searchTerm.substring(0, dashIndex).trim();
	const artist = searchTerm.substring(dashIndex + 1, searchTerm.length).trim();

	return [title, artist];
}

const lyricsResponse = (message: Discord.Message, client: Discord.Client, lyrics: string, firstMessage: boolean): any => {
	const channel = extractChannelFromMessageAndClient(message, client);

	if (lyrics.length <= CHARACTER_LIMIT) {
		return firstMessage ? message.reply('\n' + lyrics) : (channel as Discord.TextChannel).send(lyrics);
	}

	const cutToSize = lyrics.substring(0, CHARACTER_LIMIT);
	const lastNewLineIndex = cutToSize.lastIndexOf('\n');
	const cutToLastNewLine = cutToSize.substring(0, lastNewLineIndex);
	const remainder = lyrics.substring(lastNewLineIndex, lyrics.length);

	firstMessage ? message.reply('\n' + cutToLastNewLine) : (channel as Discord.TextChannel).send(cutToLastNewLine);

	return lyricsResponse(message, client, remainder, false);
}

const extractChannelFromMessageAndClient = (message: Discord.Message, client: Discord.Client) => {
	const channelId = message.channel.id;
	return client.channels.cache.get(channelId);
}