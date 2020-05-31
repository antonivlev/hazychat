<script>
	import seedrandom from 'seedrandom';

	import Video from './components/Video.svelte'

	const generateID = (position, roomURL) => {
		const rng = seedrandom(roomURL+position);
		const id = rng();
		return id.toString(36).substring(2, 12);
	}

	// Tries to connect to server at position. Creates peer if position available.
	const tryPosition = async (position, roomURL, server) => {
		return await new Promise( (resolve, reject) => {
			const occupantID = generateID(position, roomURL);
			const peer = new Peer(occupantID, server)
				.on('open', async id => {
					// id available
					myPeer = peer;
					myStream = await setupPeer(myPeer);
					resolve( {id: occupantID, me: true, stream: myStream} );
				})
				.on('error', err => {
					if (err.message.includes('is taken')) {
						// id not available
						resolve( {id: occupantID, me: false, stream: null} );
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

		let occupant = await tryPosition(position, roomURL, server)
		// if error is not nil, display here
		while (!occupant.me) {
			occupants.push(occupant);
			position += 1;
			occupant = await tryPosition(position, roomURL, server);
		}
		occupants.push(occupant);

		callThese( occupants.filter(o => !o.me) );

		return occupants;
	}

	const callThese = (occupants) => {
		occupants.map( dude => {
			console.log('calling', dude.id);
			const call = myPeer.call(dude.id, myStream);
			// call.on('stream', (remoteStream) => {
			// 	//console.log(remoteStream);
			// 	addCallerStream(dude.id, remoteStream);
			// });
		})
	}

	const setupPeer = async (peer) => {
		const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })

		peer.on('call', call => {
			console.log(call.peer, 'called me');
			call.answer(stream);
			call.on( 'stream', async remoteStream => addCallerStream(call.peer, remoteStream) );
		});

		return stream;
	}

	const addCallerStream = async (id, stream) => {
		const currentOccupants = await occupants;
		
		const currentCaller = currentOccupants.find(occ => occ.id === id);

		// if occupant exists, update stream
		if (currentCaller) {
			// console.log(currentOccupants);
			currentCaller.stream = stream;
			occupants = [...currentOccupants];
			//console.log(occupants);
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
	let myPeer = {};
	let myStream = {};

	occupants = connectToRoom(roomURL, server);
</script>

<div>
	{#await occupants}
		<p>waiting...</p>
	{:then occupants}
		
		{#each occupants as occupant}
			<Video id={occupant.id} me={occupant.me} stream={occupant.stream}/>
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