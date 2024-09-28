import { getVods } from '$lib/getVods';

export async function load() {
	return getVods();
}
