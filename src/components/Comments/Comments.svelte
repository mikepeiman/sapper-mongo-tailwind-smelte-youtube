<script>
    export let id;
    import { storeComments } from "../../scripts/stores.js";
    import Treeview from "../smelte/Treeview";
    import { onMount } from "svelte";
    import he from "he";
    import { each } from "svelte/internal";

    onMount(() => {
        console.log(
            `🚀 ~ file: Comments.svelte ~ line 4 ~ storeComments`,
            $storeComments
        );
        let y = orderByDateOrTime($storeComments[41].replies.comments);
        console.log(`🚀 ~ file: Comments.svelte ~ line 13 ~ onMount ~ y`, y);
        let text =
            $storeComments[0].snippet.topLevelComment.snippet.textDisplay;
        let decode = decodeHtml(text);
        console.log(
            `🚀 ~ file: Comments.svelte ~ line 18 ~ onMount ~ decode`,
            decode
        );
        let broke = text.replace(/<br\s*\/?>/gim, "\\n");
        console.log(
            `🚀 ~ file: Comments.svelte ~ line 17 ~ onMount ~ broke`,
            broke
        );

        let c = $storeComments;
        c.forEach((comment, i) => {
            parseHTML(
                comment.snippet.topLevelComment.snippet.textDisplay,
                i + "-" + comment.id
            );
        });
    });

    function getDate(date) {
        let x = new Date(date).toDateString();
        return x;
    }
    function getTime(date) {
        let x = new Date(date).toLocaleTimeString();
        return x;
    }

    function orderByDateOrTime(arr) {
        let x = arr.sort((a, b) =>
            getTime(a.snippet.publishedAt) > getTime(b.snippet.publishedAt)
                ? 1
                : -1
        );
        console.log(
            `🚀 ~ file: Comments.svelte ~ line 26 ~ orderByDateOrTime ~ x`,
            x
        );
        return x;
    }

    function decodeHtml(html) {
        var txt = document.createElement("textarea");
        txt.innerHTML = html.replace(/<br\s*\/?>/gim, "\\n"); // he.decode(html, {useNamedReferences: true });
        return txt.value;
    }

    function parseHTML(html, id) {
        console.log(
            `🚀 ~ file: Comments.svelte ~ line 59 ~ parseHTML ~ html, id`,
            html,
            id
        );
        var p = document.createElement("p");
        p.className = "bg-green-200"
        p.innerHTML = html;
        let el = document.getElementById(id);
        if (el) {
            el.appendChild(p);
        }
    }
</script>

<h4>Comments component {id}</h4>
{#each $storeComments as comment, i}
    {#if comment.snippet.totalReplyCount > 0}
        <div class="grid comment bg-orange-100">
            <div class="flex flex-col col-span-2">
                <p>{i}</p>
                :
                <p>
                    {comment.snippet.topLevelComment.snippet.authorDisplayName}
                </p>
                <p>
                    {getDate(
                        comment.snippet.topLevelComment.snippet.publishedAt
                    ) -
                        getTime(
                            comment.snippet.topLevelComment.snippet.publishedAt
                        )}
                </p>
            </div>
            <p class="col-start-3 col-span-12">
                {he.decode(comment.snippet.topLevelComment.snippet.textDisplay)}
            </p>
            {#each orderByDateOrTime(comment.replies.comments) as reply}
                <p class="col-start-3 col-span-12 bg-cyan-100 flex flex-column">
                    <span class="bg-cyan-300"
                        >{reply.snippet.authorDisplayName}</span
                    >
                    <span class="bg-cyan-400"
                        >{getDate(reply.snippet.publishedAt)} - {getTime(
                            reply.snippet.publishedAt
                        )}</span
                    >
                </p>

                <p class="col-start-4 col-span-12 bg-cyan-100">
                    {he.decode(reply.snippet.textDisplay, {
                        useNamedReferences: true,
                    })}
                </p>
            {/each}
        </div>
    {:else}
        <div class="grid comment bg-green-100">
            <p>{i}</p>
            :
            <div class="flex flex-col col-span-2">
                <p>
                    {comment.snippet.topLevelComment.snippet.authorDisplayName}
                </p>
                <p>
                    {getDate(
                        comment.snippet.topLevelComment.snippet.publishedAt
                    )} - {getTime(
                        comment.snippet.topLevelComment.snippet.publishedAt
                    )}
                </p>
            </div>
            <p class="col-start-3 col-span-12" id={i + "-" + comment.id}>
                {decodeHtml(
                    comment.snippet.topLevelComment.snippet.textDisplay
                )}
                <!-- {parseHTML(comment.snippet.topLevelComment.snippet.textDisplay, comment.id)} -->
            </p>
        </div>
    {/if}
{/each}

<style>
    .comment {
        grid-template-columns: repeat(15, 6.5vw);
    }
</style>
