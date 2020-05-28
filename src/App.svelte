<script>
	import seedrandom from 'seedrandom';

	import Video from './components/Video.svelte'

	if (window.location.pathname === '/') {
		window.history.pushState('', '', '/'+Math.random().toString(36).substring(2, 12));
	}

	let state = {
		roomURL: window.location.pathname,
		occupants: [],
	}

	const server = {
		host: 'localhost',
		port: '9000',
		path: '/myapp'
	}

	// inserts current user at the first available spot in the room
	// inserts other users into state as it goes through them
	const connectToRoom = (state) => {
		let occupantCount = 0;
		let occupantID = generateID(occupantCount, state.roomURL);
		
		while (isSomeoneThere(occupantID)) {
			state.occupants = [...state.occupants, generateID(occupantCount, state.roomURL)]; 
			occupantCount += 1;
			occupantID = generateID(occupantCount, state.roomURL);

			if (occupantCount > 6) {
				break;
			}
		}
		return state;
	}

	const generateID = (occupantCount, roomURL) => {
		const rng = seedrandom(roomURL+occupantCount);
		const id = rng();
		return id.toString(36).substring(2, 12);
	}

	const isSomeoneThere = (occupantID) => {
		return true;
	}

	state = connectToRoom(state);

	const peer1 = new Peer(generateID(0, state.roomURL), server)
		.on('open', id => console.log('peer1 ', id))
		.on('error', err => console.log('peer1 error ', err));
	
	const peer2 = new Peer(generateID(0, state.roomURL), server)
		.on('open', id => console.log('peer2 ', id))
		.on('error', err => console.log('peer2 error ', err));	
</script>

<div>
	{#each state.occupants as occupant}
		<Video id={occupant} />
	{/each}
</div>

<style>
	div {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		justify-content: space-around;
	}
</style>