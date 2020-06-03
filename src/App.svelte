<script>
	import seedrandom from 'seedrandom';

	import Video from './components/Video.svelte'
	import Test from './components/Test.svelte'

	const generateID = (position, roomURL) => {
		const rng = seedrandom(roomURL+position);
		const id = rng();
		return id.toString(36).substring(2, 12);
	}

	// Tries to connect to server at position. Creates peer if position available.
	// returns occupantList, myPeer
	const tryPosition = (position, roomURL, server) => {
		return new Promise( (resolve, reject) => {
			const occupantID = generateID(position, roomURL);
			const peer = new Peer(occupantID, server)
				.on('open', async id => {
					// id available
					resolve( {id: occupantID, myPeer: peer} );
				})
				.on('error', err => {
					if (err.message.includes('is taken')) {
						// id not available
						resolve( {id: occupantID, myPeer: null} );
					} else {
						// other error
						reject( {message: err + ' position: ' + position + ', id: ' + occupantID} );
					}
				});
		});
	}

	const connectToRoom = async (roomURL, server) => {
		let occupants = [];
		let position = 0;

		let idFound = false;

		while (position < 5) {
			// once id is found, stop taking other positions 
			const occupant = idFound ? {id: generateID(position, roomURL), myPeer: null} : await tryPosition(position, roomURL, server);
			if (occupant.myPeer) {
				idFound = true;
			}
			occupants.push(occupant);
			position += 1;
		}
		const me = occupants.find(occ => occ.myPeer);
		console.log(occupants);

		// set up call accepting and get my stream
		let myStream = await setupPeer(me.myPeer);
		me.stream = myStream;

		// call everyone but me
		occupants.filter(occ => !occ.myPeer).map( occ => {
			const call = me.myPeer.call(occ.id, myStream);
			call.on( 'stream', remoteStream => addCallerStream(occ.id, remoteStream) );
		});

		return occupants;
	}

	const setupPeer = async (peer) => {
		const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })

		// setup call answering behaviour
		peer.on('call', call => {
			call.answer(stream);
			call.on( 'stream', remoteStream => addCallerStream(call.peer, remoteStream) );
		});

		return stream;
	}

	const addCallerStream = async (id, stream) => {
		// todo: make side effects more transparent
		const currentOccupants = await occupants;
		
		const exisitngCaller = currentOccupants.find(occ => occ.id === id);
		if (exisitngCaller) {
			exisitngCaller.stream = stream;
			occupants = [...currentOccupants];
			return;
		}

		// else, add occupant
		occupants = [...currentOccupants, {id: id, me: false, stream: stream}];
	}

	if (window.location.pathname === '/') {
		window.history.pushState('', '', '/'+Math.random().toString(36).substring(2, 12));
	}

	const roomURL =  window.location.pathname;
	const server = {
		host: 'localhost',
		port: '9000',
		path: '/myapp'
	}
	let occupants = [];

	occupants = connectToRoom(roomURL, server);
</script>

<div>
	<!-- <Test /> -->
	{#await occupants}
		<p>waiting...</p>
	{:then occupants}
		
		{#each occupants as occupant}
			<Video id={occupant.id} me={occupant.myPeer} stream={occupant.stream} />
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