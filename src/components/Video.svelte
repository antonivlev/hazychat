<script>
	import { createEventDispatcher } from 'svelte';
	import { onMount, afterUpdate } from 'svelte';

	export let position = 0;	
	export let me = false;
	export let myPeer = null;

	let t = 0;
	let vid;
	let canvas;

	onMount(() => {
		if (me) {
			navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(startVideo)
		}
	});

	const startVideo = (stream) => {
		vid.srcObject = stream;
		vid.onloadedmetadata = () => vid.play();

		addEffect(vid, canvas);
	}

	const addEffect = (video, canvas) => {
		let seriously = new Seriously();
		let me = seriously.source(video);
		let target = seriously.target(canvas);
		let effect = seriously.effect('hue-saturation');

		setInterval(() => {
			t += 0.01
			effect.hue = Math.sin(10*t);
			effect.saturation = Math.sin(0.2*t);
		}, 200);
		
		// connect all our nodes in the right order
		effect.source = me;
		target.source = effect;
		seriously.go();
	}
</script>

<div class={me ? 'me' : ''}>
	<video width=200 height=200 bind:this={vid} muted={me ? true : false}></video>
	<canvas width=200 height=200 bind:this={canvas}></canvas>
</div>

<style>
	div {
		display: flex;
		border: 3px dashed lightgrey;
		margin: 20px 0px;
	}

	.me {
		border-color: green;
	}
</style>