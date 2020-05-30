<script>
	export let id = 'some-id';
	export let me = false;

	// if not me, call peer, display his video

	// if me, display my video, modify occupants on call
</script>

<div class={me ? 'me' : ''}>
	{id}
</div>

<style>
	div {
		border: 3px dashed lightgrey;
		width: 480px;
		height: 240px;
		margin: 20px 0px;
	}

	.me {
		border-color: green;
	}
</style>