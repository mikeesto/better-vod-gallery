<script lang="ts">
	import { onMount } from 'svelte';

	interface Video {
		id: string;
		title: string;
		thumbnail: string;
		createdAt: string;
		username: string;
		views: number;
		duration: string;
		url: string;
		profileImage: string;
		profileUrl: string;
	}

	export let data: { vods: Video[]; pagination: string | null };

	let isFetching = false;
	let language = 'en';
	let period = 'week';
	let sortBy = 'views';

	const fetchVods = async (isScrollEvent = false) => {
		if (isFetching) return;
		isFetching = true;

		const requestBody = isScrollEvent
			? { pagination: data.pagination, language, period, sortBy }
			: { language, period, sortBy };

		try {
			const res = await fetch('/api/vods', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(requestBody)
			});

			const newData = await res.json();

			if (newData.vods.length > 0) {
				data.vods = isScrollEvent ? [...data.vods, ...newData.vods] : newData.vods;
				data.pagination = newData.pagination;
			}
		} catch (error) {
			console.error('Error fetching VODs:', error);
		} finally {
			isFetching = false;
		}
	};

	onMount(() => {
		const handleScroll = async () => {
			if (
				!isFetching &&
				window.innerHeight + window.scrollY >= document.body.offsetHeight - 350 &&
				data.pagination
			) {
				await fetchVods(true);
			}
		};

		window.addEventListener('scroll', handleScroll);

		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<div class="max-w-[2000px] m-auto p-3">
	<h1 class="text-2xl font-bold mb-6">Better VOD Gallery</h1>
	<div class="mb-4">
		<span>Language:</span>
		<select
			class="border border-gray-300 rounded-md p-1"
			bind:value={language}
			on:change={() => fetchVods()}
		>
			<option value="en">English</option>
			<option value="all">All</option>
		</select>
		<span class="ml-2">Period:</span>
		<select
			class="border border-gray-300 rounded-md p-1"
			bind:value={period}
			on:change={() => fetchVods()}
		>
			<option value="week">Last week</option>
			<option value="day">Last day</option>
			<option value="month">Last month</option>
			<option value="all">All</option>
		</select>
		<span class="ml-2">Sort by:</span>
		<select
			class="border border-gray-300 rounded-md p-1"
			bind:value={sortBy}
			on:change={() => fetchVods()}
		>
			<option value="views">Highest views</option>
			<option value="trending">Highest trending</option>
			<option value="time">Most recent</option>
		</select>
	</div>
	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
		{#each data.vods as video}
			<div class="bg-white rounded-lg shadow-md overflow-hidden">
				<a href={video.url} class="block relative">
					<img src={video.thumbnail} alt={video.title} class="w-full h-48 object-cover" />
					<span
						class="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded"
					>
						{video.duration}
					</span>
				</a>

				<div class="p-3 grid grid-cols-1 gap-2">
					<a href={video.url}>
						<h2 class="font-semibold text-sm hover:cursor-pointer hover:text-blue-500">
							{video.title}
						</h2>
					</a>

					<a href={video.profileUrl} class="hover:cursor-pointer">
						<div class="flex items-center space-x-2">
							<img src={video.profileImage} alt={video.username} class="w-6 h-6 rounded-full" />
							<p class="text-gray-600 text-xs">{video.username}</p>
						</div>
					</a>
					<p class="text-gray-600 text-xs">{video.views} views • {video.createdAt}</p>
				</div>
			</div>
		{/each}
	</div>
</div>
