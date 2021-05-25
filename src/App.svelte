<script>
	import Video from './components/Video.svelte'

	import { connectSelfAtPostion, generateID } from './services/connections';
	import { startVideo, getEffectStream } from './services/video';

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	// add random url at end if needed
	if (window.location.pathname === '/') {
		window.history.pushState('', '', '/'+Math.random().toString(36).substring(2, 12));
	}

	const roomURL =  window.location.pathname;
	const server = {
		host: 'obscure-bastion-48493.herokuapp.com',
		port: '',
		path: '/'
	}

	let vid;
	let canvas;

	// Returns my stream, peer instance and position connected at
	const connectSelf = async (roomURL, server) => {
		for (let position=0; position<10; position++) {
			let result = await connectSelfAtPostion(position, roomURL, server);
			if (result.peer) {
				
				let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
				startVideo(stream, vid);
				stream = getEffectStream(vid, canvas);
				
				result.stream = stream;

				return result;
			}
		}
		throw new Error("room capacity reached");
	}
</script>

<div>
	<div class="me">
		<video width=200 height=200 bind:this={vid} muted></video>
		<canvas width=200 height=200 bind:this={canvas}></canvas>
	</div>

	{#await connectSelf(roomURL, server)}
		<p>waiting...</p>
	{:then me}
		<p>my id: {generateID(me.position, roomURL)}</p>
		{#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(p => p !== me.position) as position}
			<Video id={generateID(position, roomURL)} peer={me.peer} stream={me.stream} />
		{/each}
		
	{:catch error}
		<p>{error.message}</p>
	{/await}
</div>

<style>
	div {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		justify-content: space-around;
	}

	.me {
		border: 1px dashed green;
	}
</style>