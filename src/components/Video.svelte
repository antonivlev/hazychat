<script>
	import { onMount } from 'svelte';
	
	export let id = '';	
	export let stream = null;
	export let peer = null;

	let vid;
	let canvas;

	onMount(() => {
		// call this guy, start video with his stream
		const call = peer.call(id, stream);
		displayStreamFromCall(call);

		// if this guy calls, display his video 
		peer.on('call', incomingCall => {
			incomingCall.answer(stream);
			if (incomingCall.peer === id) {
				displayStreamFromCall(incomingCall);
			}
		});
	});

	const displayStreamFromCall = (call) => {
		call.on('stream', remoteStream => {
			vid.srcObject = remoteStream;
			vid.onloadedmetadata = () => vid.play();
		});
	}
</script>

<div>
	{id}
	<video width=200 height=200 bind:this={vid}></video>
	<canvas width=200 height=200 bind:this={canvas}></canvas>
</div>

<style>
	div {
		display: flex;
		border: 3px dashed lightgrey;
		margin: 20px 0px;
	}
</style>