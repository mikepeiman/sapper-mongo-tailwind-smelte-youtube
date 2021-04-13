<script>
    export let videoDetails;
    import Comments from "./Comments";
    let cols = 12;

    function getDate(date) {
        let x = new Date(date).toDateString();
        return x;
    }
    function getTime(date) {
        let x = new Date(date).toLocaleTimeString();
        return x;
    }
</script>

<div
    class="playlistItem grid row-start-auto grid-cols-12 px-4 pt-4 pb-8 border-b-8 border-cyan-700"
>
    {#each Array(cols) as _, col}
        <p>{col}</p>
    {/each}
    <img
        class="thumbnail col-start-1 col-span-2"
        src={videoDetails.snippet.thumbnails.default.url}
        width={videoDetails.snippet.thumbnails.default.width}
        height={videoDetails.snippet.thumbnails.default.height}
    />
    <h2 class="col-start-3 col-span-6 justify-self-start">
        {videoDetails.snippet.title}
    </h2>
    <div class="col-start-9 col-span-3 flex-col">
        <div class="flex flex-col">
            <p>{getDate(videoDetails.snippet.publishedAt)}</p>
            <p>{getTime(videoDetails.snippet.publishedAt)}</p>
        </div>
        <div class="flex">
            <div>ID: {videoDetails.id}</div>
        </div>
    </div>
</div>
<Comments id={videoDetails.id} />
