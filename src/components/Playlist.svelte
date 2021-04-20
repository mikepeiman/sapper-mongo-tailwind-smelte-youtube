<script>
    export let playlist;

    import { storePlaylistId, storePlaylistName } from "../scripts/stores.js";

    function getDateAndTime(date) {
        let x = new Date(date).toLocaleString("en", { dateStyle: "short", timeStyle: "short"});
        return x;
    }
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
    class="grid row-start-auto grid-cols-12 m-1 bg-blue-200"
    on:click={() => {
        storePlaylistId.set(playlist.id);
        storePlaylistName.set(playlist.snippet.title)
        console.log(`🚀 ~ file: Playlist.svelte ~ line 11 ~ playlist.id ${ playlist.id} name ${playlist.snippet.title}`)
    }}
>
    <img
        class="thumbnail col-start-1 col-span-1"
        src={playlist.snippet.thumbnails.default.url}
        width={playlist.snippet.thumbnails.default.width}
        height={playlist.snippet.thumbnails.default.height}
    />
    <div class="col-start-2 col-span-8 justify-self-start">
        {playlist.snippet.title}
    </div>
    <div class="col-start-10 col-span-3 flex-col">
        <p class="text-cyan-600">Published {getDateAndTime(playlist.snippet.publishedAt)}</p>
    </div>
</div>

<style>
    .playlistItem {
        margin: 0.25rem;
        cursor: pointer;
        background: rgba(72, 35, 158, 0.1);
        border: 1px solid rgba(72, 35, 158, 0.7);
    }
    .playlistItem:hover {
        background: rgba(0, 0, 0, 0.25);
    }
</style>
