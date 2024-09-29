import { json } from '@sveltejs/kit';
import { getVods } from '$lib/getVods';

export async function POST({ request }) {
	const { pagination, language, period, sortBy } = await request.json();

	const vods = await getVods(pagination, language, period, sortBy);

	return json(vods);
}
