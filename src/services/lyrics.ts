// @ts-ignore TODO: no types and can't get the declarations thing to work
import { getLyrics } from 'genius-lyrics-api';

export const lyricsByTitleAndArtist = (title: string, artist: string) => {
	const options = {
		apiKey: process.env.GENIUS_TOKEN,
		artist: artist,
		title: title,
		optimizeQuery: true
	}

	return getLyrics(options);
}