<script lang="ts">
	interface Video {
		id: string;
		title: string;
		thumbnail: string;
		createdAt: string;
		username: string;
		views: number;
		duration: string;
		url: string;
	}

	export let data: { vods: Video[] };
</script>

<h1 class="text-2xl font-bold mb-6">Better VOD Gallery</h1>
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
			<div class="p-3">
				<h2 class="font-semibold text-sm mb-1 line-clamp-2">{video.title}</h2>
				<p class="text-gray-600 text-xs">{video.username}</p>
				<p class="text-gray-600 text-xs">{video.views} views • {video.createdAt}</p>
			</div>
		</div>
	{/each}
</div>
