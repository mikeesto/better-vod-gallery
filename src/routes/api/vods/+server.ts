import { json } from '@sveltejs/kit';
import { getVods } from '$lib/getVods';

export async function POST({ request }) {
	const { pagination } = await request.json();

	const vods = await getVods(pagination);

	return json(vods);
}
