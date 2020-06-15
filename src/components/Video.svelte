<script>
	import { createEventDispatcher } from 'svelte';
	import { onMount, afterUpdate } from 'svelte';

	export let id = 'some-id';	
	export let me = false;
	export let stream;

	let t = 0;
	let vid;
	let canvas;
	onMount(() => {
		vid.srcObject = stream;
		vid.onloadedmetadata = () => vid.play();
	});

	afterUpdate(() => {
		vid.srcObject = stream;
		vid.onloadedmetadata = () => vid.play();

		if (stream && me) {
			addEffect(vid, canvas);
		}

		// console.log(canvas.captureStream(24))
	});

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

		// dispatch stream event
	}
</script>

<div style={stream ? '' : 'display: none'} id={id} class={me ? 'me' : ''}>
	<video style={me ? 'display: none' : ''} bind:this={vid} muted={me ? true : false}></video>
	<canvas style={me ? '' : 'display: none'} width=480 height=480 bind:this={canvas}></canvas>
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