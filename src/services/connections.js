import seedrandom from 'seedrandom';

export const generateID = (position, roomURL) => {
	const rng = seedrandom(roomURL+position);
	const id = rng();
	return id.toString(36).substring(2, 12);
}

/* 	Tries to connect to server at position. Creates peer if position available.
 	returns myPeer
*/
export const connectSelfAtPostion = (position, roomURL, server) => {
	return new Promise( (resolve, reject) => {
		const occupantID = generateID(position, roomURL);
		const peer = new Peer(occupantID, server)
			.on('open', id => {
				// id available
				resolve( {myPeer: peer, myPosition: position} );
			})
			.on('error', err => {
				if (err.message.includes('is taken')) {
					resolve( {message: err.message} );
				} else {
					// other error
					reject( {message: err + ' position: ' + position + ', id: ' + occupantID} );
				}
			});
	});
}