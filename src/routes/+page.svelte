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

<h1>Better VOD Gallery</h1>
{#each data.vods as video}
	<div>
		<a href={video.url}>
			<img src={video.thumbnail} alt={video.title} />
		</a>
		<p>{video.title}</p>
		<p>{video.username}</p>
		<p>{video.views} views</p>
		<p>{video.duration}</p>
		<p>{video.createdAt}</p>
	</div>
{/each}
