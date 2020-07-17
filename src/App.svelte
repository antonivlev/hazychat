<script>
	import Video from './components/Video.svelte'

	import { connectSelfAtPostion } from './services/connections';

	// const connectToRoom = async (roomURL, server) => {
	// 	let occupants = [];
	// 	let position = 0;

	// 	let idFound = false;

	// 	while (position < 10) {
	// 		// once id is found, stop taking other positions 
	// 		const occupant = idFound ? {id: generateID(position, roomURL), myPeer: null} : await tryPosition(position, roomURL, server);
	// 		if (occupant.myPeer) {
	// 			idFound = true;
	// 		}
	// 		occupants.push(occupant);
	// 		position += 1;
	// 	}
	// 	const me = occupants.find(occ => occ.myPeer);

	// 	// set up call accepting and get my stream
	// 	let myStream = await setupPeer(me.myPeer);
	// 	me.stream = myStream;

	// 	// call everyone but me
	// 	occupants.filter(occ => !occ.myPeer).map( occ => {
	// 		const call = me.myPeer.call(occ.id, myStream);
	// 		call.on('stream', remoteStream => addCallerStream(occ.id, remoteStream));
	// 	});

	// 	return occupants;
	// }

	// const setupPeer = async (peer) => {
	// 	const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })

	// 	// setup call answering behaviour
	// 	peer.on('call', call => {
	// 		// answer with stream from my canvas
	// 		call.answer(stream);
	// 		call.on( 'stream', remoteStream => addCallerStream(call.peer, remoteStream) );
	// 	});

	// 	return stream;
	// }

	// const addCallerStream = async (id, stream) => {
	// 	// todo: make side effects more transparent
	// 	const currentOccupants = await occupants;
		
	// 	const exisitngCaller = currentOccupants.find(occ => occ.id === id);
	// 	if (exisitngCaller) {
	// 		exisitngCaller.stream = stream;
	// 		occupants = [...currentOccupants];
	// 		return;
	// 	}

	// 	// else, add occupant
	// 	occupants = [...currentOccupants, {id: id, me: false, stream: stream}];
	// }

	if (window.location.pathname === '/') {
		window.history.pushState('', '', '/'+Math.random().toString(36).substring(2, 12));
	}

	const roomURL =  window.location.pathname;
	const server = {
		host: 'localhost',
		port: '9000',
		path: '/myapp'
	}

	// Returns peer instance and position connected at
	const connectSelf = async (roomURL, server) => {
		for (let position=0; position<10; position++) {
			let result = await connectSelfAtPostion(position, roomURL, server);
			if (result.myPeer) {
				return result;
			}
		}
		throw new Error("room capacity reached");
	}
</script>

<div>
	{#await connectSelf(roomURL, server)}
		<p>waiting...</p>
	{:then connection}
		
		{#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as position}
			<Video position={position} me={position === connection.myPosition} myPeer={connection.myPeer} />
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
</style>