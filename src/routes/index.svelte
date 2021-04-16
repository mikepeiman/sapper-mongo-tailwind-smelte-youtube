<script>
	import { io } from "socket.io-client";
	const socket = io();

	socket.on("connect", () => {
		console.log(
			`🚀 ~ file: index.svelte ~ line 6 ~ socket.on ~ socket.id`,
			socket.id
		);
	});
	socket.on("disconnect", () => {
		console.log(
			`🚀 ~ file: index.svelte ~ line 9 ~ socket.on ~ socket.id`,
			socket.id
		);
	});
	function test() {
		console.log(`socket.emit message "tsting sockets"`)
		socket.emit("message", "testing sockets");
	}
</script>

<svelte:head>
	<title>Sapper Mongo Tailwind YouTube</title>
	<!-- <script src="../../node_modules/socket.io/client-dist/socket.io.js"></script> -->
</svelte:head>

<h1>Great success!</h1>

<figure>
	<img alt="Borat" src="great-success.png" />
	<figcaption>HIGH FIVE!</figcaption>
</figure>

<p>
	<strong
		>Try editing this file (src/routes/index.svelte) to test live reloading.</strong
	>
</p>
<button class="test" on:click={test}>test</button>

<style lang="postcss">
	h1,
	figure,
	p {
		text-align: center;
		margin: 0 auto;
	}

	h1 {
		font-size: 2.8em;
		text-transform: uppercase;
		font-weight: 700;
		margin: 0 0 0.5em 0;
	}

	figure {
		margin: 0 0 1em 0;
	}

	img {
		width: 100%;
		max-width: 400px;
		margin: 0 0 1em 0;
	}

	p {
		margin: 1em auto;
	}

	.test {
		@apply bg-red-500 text-red-100 uppercase tracking-wide font-semibold
      text-4xl px-4 py-3 shadow-lg rounded;
	}

	@media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}
	}
</style>
