import { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET } from '$env/static/private';
import { formatDistanceToNow } from 'date-fns';
import { formatViews, formatDuration } from '$lib';

async function getUserDetails(userIds: string[], oauthToken: string) {
	const response = await fetch(`https://api.twitch.tv/helix/users?id=${userIds.join('&id=')}`, {
		headers: {
			'Client-ID': TWITCH_CLIENT_ID,
			Authorization: `Bearer ${oauthToken}`
		}
	});

	const data = await response.json();
	return data.data;
}

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

async function getCategoryId(oauthToken: string) {
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

async function getVODsByCategory(
	categoryId: string,
	oauthToken: string,
	cursor?: string,
	language: string = 'en',
	period: string = 'week',
	sort: string = 'views'
) {
	const baseUrl = 'https://api.twitch.tv/helix/videos';
	const params = new URLSearchParams({
		game_id: categoryId,
		sort: sort,
		period: period,
		type: 'archive',
		first: '15'
	});

	if (language !== 'all') {
		params.append('language', language);
	}

	if (cursor) {
		params.append('after', cursor);
	}

	const url = `${baseUrl}?${params.toString()}`;

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${oauthToken}`,
			'Client-Id': TWITCH_CLIENT_ID,
			'accept-language': 'YOUWHAT' // https://github.com/twitchdev/issues/issues/651 lol
		}
	});

	const data = await response.json();
	// console.log('VOD data:', JSON.stringify(data, null, 2));
	return { vods: data.data, pagination: data.pagination };
}

export async function getVods(cursor?: string, language?: string, period?: string, sort?: string) {
	const oauthToken = await getOAuthToken();
	const categoryId = await getCategoryId(oauthToken);
	const { vods, pagination } = await getVODsByCategory(
		categoryId,
		oauthToken,
		cursor,
		language,
		period,
		sort
	);

	const userIds = [...new Set(vods.map((vod) => vod.user_id))] as string[];

	const users = await getUserDetails(userIds, oauthToken);

	const userMap = new Map<string, string>();
	users.forEach((user) => userMap.set(user.id, user.profile_image_url));

	const formattedVods = vods.map((vod) => {
		return {
			id: vod.id,
			title: vod.title,
			thumbnail: vod.thumbnail_url.replace('%{width}', '320').replace('%{height}', '180'),
			createdAt: formatDistanceToNow(new Date(vod.created_at), { addSuffix: true }),
			username: vod.user_name,
			views: formatViews(vod.view_count),
			duration: formatDuration(vod.duration),
			url: vod.url,
			profileImage: userMap.get(vod.user_id),
			profileUrl: `https://www.twitch.tv/${vod.user_login}`
		};
	});

	return { vods: formattedVods, pagination: pagination.cursor };
}
