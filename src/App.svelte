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

	// inserts current user at the first available spot in the room
	// inserts other users into state as it goes through them
	let connectToRoom = (state) => {
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

	let generateID = (occupantCount, roomURL) => {
		let rng = seedrandom(roomURL+occupantCount);
		let id = rng();
		return id.toString(36).substring(2, 12);
	}

	let isSomeoneThere = (occupantID) => {
		return true;
	}

	state = connectToRoom(state);
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