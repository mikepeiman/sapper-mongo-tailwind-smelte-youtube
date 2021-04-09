<script>
    export let id;
    import { storeComments } from "../../scripts/stores.js";
    import Treeview from "../smelte/Treeview";
    import { onMount } from "svelte";

    onMount(() => {
        console.log(
            `🚀 ~ file: Comments.svelte ~ line 4 ~ storeComments`,
            $storeComments
        );
            let y = orderByDateOrTime($storeComments[41].replies.comments)
            console.log(`🚀 ~ file: Comments.svelte ~ line 13 ~ onMount ~ y`, y)
    });

    function getDate(date) {
        let x = new Date(date).toDateString()
        return x
    }
    function getTime(date) {
        let x = new Date(date).toLocaleTimeString()
        return x
    }

    function orderByDateOrTime(arr) {
        let x = arr.sort((a, b) => (getTime(a.snippet.publishedAt) > getTime(b.snippet.publishedAt)) ? 1 : -1)
        console.log(`🚀 ~ file: Comments.svelte ~ line 26 ~ orderByDateOrTime ~ x`, x)
        return x
    }
</script>

<h4>Comments component {id}</h4>
{#each $storeComments as comment, i}
    {#if comment.snippet.totalReplyCount > 0}
        <div class="grid comment bg-orange-100">
            <div class="flex flex-col col-span-2">
                <p>{i}</p>:
                <p>
                    {comment.snippet.topLevelComment.snippet.authorDisplayName}
                </p>
                <p>{comment.snippet.topLevelComment.snippet.publishedAt}</p>
            </div>
            <p class="col-start-3 col-span-12">
                {comment.snippet.topLevelComment.snippet.textDisplay}
            </p>
            {#each orderByDateOrTime(comment.replies.comments) as reply}
                <p class="col-start-3 col-span-12 bg-cyan-100">
                    <span class="bg-cyan-300">{reply.snippet.authorDisplayName}</span>
                    <span class="bg-cyan-400">{getDate(reply.snippet.publishedAt)} - {getTime(reply.snippet.publishedAt)}</span>
                    {reply.snippet.textDisplay}
                </p>
            {/each}
        </div>
    {:else}
        <div class="grid comment bg-green-100">
            <p>{i}</p>:
            <div class="flex flex-col col-span-2">
                <p>
                    {comment.snippet.topLevelComment.snippet.authorDisplayName}
                </p>
                <p>{getDate(comment.snippet.topLevelComment.snippet.publishedAt)} - {getTime(comment.snippet.topLevelComment.snippet.publishedAt)}</p>
            </div>
            <p class="col-start-3 col-span-12">
                {comment.snippet.topLevelComment.snippet.textDisplay}
            </p>
        </div>
    {/if}
{/each}

<style>
    .comment {
        grid-template-columns: repeat(15, 6.5vw);
    }
</style>
