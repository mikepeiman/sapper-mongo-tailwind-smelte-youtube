<script>
    export let item;
    import { storeVideoId } from "../scripts/stores.js";

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

{#if item.snippet.title != "deleted" || item.snippet.title != "private"}
    <div
        class="videoItem grid row-start-auto grid-cols-12 m-1"
        on:click={() => {
            let videoId = item.contentDetails.videoId;
            console.log(`🚀 ~ file: PlaylistItem.svelte ~ line 11 ~ videoId`, videoId)
            storeVideoId.set(videoId);
        }}
    >
        {#if item.snippet.thumbnails.default}
            <img
                class="thumbnail col-start-1 col-span-1"
                src={item.snippet.thumbnails.default.url}
                width={item.snippet.thumbnails.default.width}
                height={item.snippet.thumbnails.default.height}
            />
        {/if}
        <div class="col-start-2 col-span-5 justify-self-start">
            {item.snippet.title}
        </div>
        <div class="col-start-7 col-span-2 justify-self-start">
            {item.snippet.videoOwnerChannelTitle}
        </div>
        <div class="col-start-9 col-span-2 flex-col">
            <p class="text-orange-500">Added to playlist:</p>
            <p>{getDateAndTime(item.snippet.publishedAt)}</p>
        </div>
        <div class="col-start-11 col-span-2 flex-col">
            <p class="text-amber-500">Published to YouTube:</p>
            <p>{getDateAndTime(item.contentDetails.videoPublishedAt)}</p>
        </div>
    </div>
{:else}
    Video deleted or private
{/if}

<style>
    .videoItem {
        margin: 0.25rem;
        width: 100vw;
        cursor: pointer;
        background: rgba(72, 35, 158, 0.1);
        border: 1px solid rgba(72, 35, 158, 0.7);
    }
    .videoItem:hover {
        background: rgba(0, 0, 0, 0.25);
    }
</style>
