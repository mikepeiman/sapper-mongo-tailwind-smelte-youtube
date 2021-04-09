<script>
    export let channelDetails;
    import { storeChannelName } from "../scripts/stores.js";
</script>

{#if Object.entries(channelDetails).length > 0}
    <div class="flex flex-wrap justify-start justify-items-start">
        <div class="playlistItem grid row-start-auto grid-cols-12 m-1">
            <img
                class="thumbnail col-start-1 col-span-1"
                src={channelDetails.snippet.thumbnails.default.url}
                width={channelDetails.snippet.thumbnails.default.width}
                height={channelDetails.snippet.thumbnails.default.height}
            />
            <div class="col-start-2 col-span-3 justify-self-start">
                {channelDetails.snippet.title}
            </div>
            <div class="col-start-5 flex-col">
                Creation Date: <div>{channelDetails.snippet.publishedAt}</div>
                Channel ID:
                <div>{JSON.stringify(channelDetails.id)}</div>
                Uploads ID:
                <div>
                    {JSON.stringify(
                        channelDetails.contentDetails.relatedPlaylists.uploads
                    )}
                </div>
            </div>
        </div>
    </div>
{:else}
    <h2>
        No channel found under name <span class="text-orange-700 bg-grey-200"
            >{$storeChannelName}</span
        >
    </h2>
{/if}
