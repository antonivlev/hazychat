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
				.on('open', id => {
					// id available
					resolve( {id: occupantID, me: true} );
				})
				.on('error', err => {
					if (err.message.includes('is taken')) {
						// id not available
						resolve( {id: occupantID, me: false} );
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

		return occupants;
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

	let id0 = generateID(0, roomURL)
	const peer0 = new Peer(id0, server)
		.on('open', id => {
			// available
			console.log(id);
		})
		.on('error', err => {
			// not available
			console.log(err);
		});

	occupants = connectToRoom(roomURL, server);
</script>

<div>
	{#await occupants}
		<p>waiting...</p>
	{:then occupants}
		
		{#each occupants as occupant}
			<Video id={occupant.id} me={occupant.me}/>
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