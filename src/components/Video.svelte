<script>
	import { createEventDispatcher } from 'svelte';
	import { onMount, afterUpdate } from 'svelte';

	export let id = 'some-id';	
	export let me = false;
	export let stream;

	let vid;
	onMount(() => {
		vid.srcObject = stream;
		vid.onloadedmetadata = () => vid.play();
		console.log('mount: ', stream);
	});

	afterUpdate(() => {
		vid.srcObject = stream;
		vid.onloadedmetadata = () => vid.play();
		console.log('update: ', stream);
	});
</script>

<div id={id} class={me ? 'me' : ''}>
	{id}
	<video bind:this={vid} muted={me ? true : false}></video>
</div>

<style>
	div {
		display: flex;
		border: 3px dashed lightgrey;
		width: 480px;
		height: 240px;
		margin: 20px 0px;
	}

	video {
		height: inherit;
	}

	.me {
		border-color: green;
	}
</style>