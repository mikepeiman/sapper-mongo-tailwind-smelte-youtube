<script>
	import io from "socket.io-client";
	var socket = io.connect()
	socket.emit("message", "testing sockets")
	socket.on("connection", (socket) => {
		console.log("a user connected");
		socket.on("disconnect", () => {
			console.log("user disconnected");
		});
	});
</script>

<svelte:head>
	<title>Sapper Mongo Tailwind YouTube</title>
	<!-- <script defer src="/socket.io/socket.io.js"></script> -->
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
<button class="test">test</button>

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
