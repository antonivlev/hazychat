export const addEffect = (video, canvas) => {
	let seriously = new Seriously();
	let me = seriously.source(video);
	let target = seriously.target(canvas);
	let effect = seriously.effect('hue-saturation');
	let t = 0;

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

export const startVideo = (stream, vid) => {
	vid.srcObject = stream;
	vid.onloadedmetadata = () => vid.play();
}

export const getEffectStream = (vid, canvas) => {
	addEffect(vid, canvas)
	return canvas.captureStream(24);
}