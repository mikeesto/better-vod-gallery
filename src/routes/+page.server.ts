import { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET } from '$env/static/private';
import { formatViews } from '$lib';

export async function load({ params }) {
	async function getOAuthToken() {
		const clientId = TWITCH_CLIENT_ID;
		const clientSecret = TWITCH_CLIENT_SECRET;

		const response = await fetch('https://id.twitch.tv/oauth2/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				client_id: clientId,
				client_secret: clientSecret,
				grant_type: 'client_credentials'
			})
		});

		const data = await response.json();
		return data.access_token;
	}

	async function getCategoryId(oauthToken) {
		const response = await fetch(
			`https://api.twitch.tv/helix/games?name=Software%20and%20Game%20Development&period=week&type=archive`,
			{
				headers: {
					'Client-ID': TWITCH_CLIENT_ID,
					Authorization: `Bearer ${oauthToken}`
				}
			}
		);

		const data = await response.json();
		return data.data[0].id;
	}

	async function getVODsByCategory(categoryId, oauthToken) {
		const url = `https://api.twitch.tv/helix/videos?game_id=${categoryId}&sort=views&period=week&type=archive&language=en`;

		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${oauthToken}`,
				'Client-Id': TWITCH_CLIENT_ID,
				'accept-language': 'YOUWHAT' // https://github.com/twitchdev/issues/issues/651 lol
			}
		});

		const data = await response.json();
		console.log('VOD data:', JSON.stringify(data, null, 2));
		return data.data;
	}

	const oauthToken = await getOAuthToken();
	const categoryId = await getCategoryId(oauthToken);
	const vods = await getVODsByCategory(categoryId, oauthToken);

	const formattedVods = vods.map((vod) => {
		return {
			id: vod.id,
			title: vod.title,
			thumbnail: vod.thumbnail_url.replace('%{width}', '320').replace('%{height}', '180'),
			createdAt: vod.created_at,
			username: vod.user_name,
			views: formatViews(vod.view_count),
			duration: vod.duration,
			url: vod.url
		};
	});

	return { vods: formattedVods };
}
