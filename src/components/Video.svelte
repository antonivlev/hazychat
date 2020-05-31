<script>
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';

	let addStreamToVid = (stream) => {
		if (stream) {
			let vid = document.querySelector('#'+id+' video');
			vid.srcObject = stream;
			vid.onloadedmetadata = () => vid.play();
		}
	}

	export let id = 'some-id';	
	export let me = false;
	export let stream = {};

	onMount(() => {
		addStreamToVid(stream);
	});
</script>

<div id={id} class={me ? 'me' : ''}>
	{id}
	<video muted={me ? true : false}></video>
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