<script>
	let dudes = [
		{name: 'Bob', surname: 'Ross'},
		{name: 'Anakin', surname: 'Skywalker'},
	]

	setTimeout(() => dudes[0].name = 'oof', 4000);
</script>

<ul>
	{#each dudes as dude}
		<input value={dude.name} placeholder={dude.surname}>
	{/each}
</ul>