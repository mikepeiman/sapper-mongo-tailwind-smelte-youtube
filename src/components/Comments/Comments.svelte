<script>
export let id
import { storeComments } from '../../scripts/stores.js'
import Treeview from '../smelte/Treeview'
import {onMount} from 'svelte'

onMount(() => {
    console.log(`🚀 ~ file: Comments.svelte ~ line 4 ~ storeComments`, $storeComments)
})

</script> 

<h4>Comments component {id}</h4>
{#each $storeComments as comment}

{#if comment.snippet.totalReplyCount > 0}
<div class="grid comment bg-orange-100">
    <p class="col-start-1 col-span-2">ID: {comment.id}</p>
    <p class="col-start-3">Date: {comment.snippet.topLevelComment.snippet.publishedAt}</p>
    <p class="col-start-4 col-span-2">Author: {comment.snippet.topLevelComment.snippet.authorDisplayName}</p>
    <p class="col-start-6">Replies: {comment.snippet.totalReplyCount}</p>
    <p class="col-start-7">VideoID: {comment.snippet.topLevelComment.snippet.videoId}</p>
    <p class="col-start-8 col-span-7">Comment: {comment.snippet.topLevelComment.snippet.textDisplay}</p>
</div>
{:else}
<div class="grid comment bg-green-100">
    <div class="flex flex-col col-span-2">
        <p>{comment.snippet.topLevelComment.snippet.authorDisplayName}</p>
        <p>{comment.snippet.topLevelComment.snippet.publishedAt}</p>
    </div>
    <p class="col-start-3 col-span-12">Comment: {comment.snippet.topLevelComment.snippet.textDisplay}</p>
</div>
{/if}
{/each}

<style>
.comment {
 grid-template-columns: repeat(15, 6.5vw);
}
    </style>