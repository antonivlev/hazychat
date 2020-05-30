<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let id = 'some-id';	
	export let me = false;

	// if me, display my video, modify occupants on call
	if (me) {
		// display my video
		navigator.mediaDevices.getUserMedia({ video: true, audio: true })
			.then(stream => {
				addStreamToVid(stream);
			})
			.catch(err => console.log(err));

		setTimeout(() => {
			// add occupant on call
			console.log('dispatching');
			dispatch('incoming', {
				id: 'some-id',
				me: false,
			})
		}, 1000);
	}

	// if not me, call peer, display his video


	let addStreamToVid = (stream) => {
		let vid = document.querySelector('#'+id+' video');
		vid.srcObject = stream;
		vid.onloadedmetadata = () => vid.play();
	}
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