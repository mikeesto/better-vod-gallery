export function formatViews(views: number): string {
	if (views >= 1000000) {
		return (views / 1000000).toFixed(1) + 'M';
	} else if (views >= 1000) {
		return (views / 1000).toFixed(1) + 'K';
	}
	return views.toString();
}

export function formatDuration(duration: string) {
	const hoursMatch = duration.match(/(\d+)h/);
	const minutesMatch = duration.match(/(\d+)m/);
	const secondsMatch = duration.match(/(\d+)s/);

	const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
	const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;
	const seconds = secondsMatch ? parseInt(secondsMatch[1], 10) : 0;

	const paddedMinutes = String(minutes).padStart(2, '0');
	const paddedSeconds = String(seconds).padStart(2, '0');

	if (hours > 0) {
		const paddedHours = String(hours).padStart(2, '0');
		return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
	} else {
		return `${paddedMinutes}:${paddedSeconds}`;
	}
}
