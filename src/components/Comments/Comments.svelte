<script>
    export let id;
    import { storeComments } from "../../scripts/stores.js";
    import { onMount } from "svelte";
    import he from "he";

    onMount(() => {
        console.log(
            `🚀 ~ file: Comments.svelte ~ line 4 ~ storeComments`,
            $storeComments
        );
        // let broke = text.replace(/<br\s*\/?>/gim, "\\n");

        let c = $storeComments;
        c.forEach((comment, i) => {
            let replyCount = comment.snippet.totalReplyCount;
            if (replyCount == 0) {
            console.log(`🚀❌ ~ file: Comments.svelte ~ line 16 ~ c.forEach ~ i replyCount == 0`, i)

                parseHTML(
                    comment.snippet.topLevelComment.snippet.textDisplay,
                    comment.id
                );
            } else {
                console.log(`🚀♻🔁 ~ file: Comments.svelte ~ line 16 ~ c.forEach ~ i replyCount != 0`, i)
                if (comment.snippet.topLevelComment.snippet.textDisplay) {
                    parseHTML(
                        comment.snippet.topLevelComment.snippet.textDisplay,
                        comment.id
                    );
                }
                let replies = comment.replies.comments
                replies.forEach(reply => {
                    parseHTML(reply.snippet.textDisplay, reply.id);
                })
            }
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
        // console.log(
        //     `🚀 ~ file: Comments.svelte ~ line 26 ~ orderByDateOrTime ~ x`,
        //     x
        // );
        return x;
    }

    function decodeHtml(html) {
        var txt = document.createElement("textarea");
        txt.innerHTML = html.replace(/<br\s*\/?>/gim, "\\n"); // he.decode(html, {useNamedReferences: true });
        return txt.value;
    }

    function parseHTML(html, id) {
        var p = document.createElement("p");
        let el = document.getElementById(id);
        p.innerHTML = html;
        if (el) {
            p.className = "bg-white p-2 m-0 rounded";
            // console.log(`🚀 ~ file: Comments.svelte ~ line 59 ~ parseHTML ~ el.customclasses`, el.customclasses)
            el.appendChild(p);
        }
    }
</script>

<span class="border-b-10 border-cyan-700" />
{#each $storeComments as comment, i}
    {#if comment.snippet.totalReplyCount > 0}
        <div class="grid comment bg-cyan-100 border-b-2 border-cyan-500 p-2">
            <div class="flex flex-col col-span-2">
                <p class="m-0 mb-0 text-cyan-700 font-bold">
                    <span class="bg-gray-100 p-1 rounded">{i} </span>
                    {comment.snippet.topLevelComment.snippet.authorDisplayName}
                </p>
                <p class="m-0 mb-0">
                    <span class="text-grey-500">
                        {getDate(
                            comment.snippet.topLevelComment.snippet.publishedAt
                        )}
                    </span><span class="text-grey-500">
                        {getTime(
                            comment.snippet.topLevelComment.snippet.publishedAt
                        )}
                    </span>
                </p>
            </div>
            <div class="col-start-3 col-span-12" id={comment.id} />

            {#each orderByDateOrTime(comment.replies.comments) as reply}
                <div class="flex flex-col col-start-2 col-span-2">
                    <p class="m-0 mb-0 text-cyan-700 font-bold">
                        <span class="bg-gray-100 p-1 rounded">{i}: </span>
                        {reply.snippet.authorDisplayName}
                    </p>
                    <p class="m-0 mb-0">
                        <span class="text-grey-500">
                            {getDate(reply.snippet.publishedAt)}
                        </span><span class="text-grey-500">
                            {getTime(reply.snippet.publishedAt)}
                        </span>
                    </p>
                </div>

                <div
                    class="col-start-4 col-span-11 bg-gray-100 m-2 p-2"
                    id={reply.id}
                >
                    <!-- {he.decode(reply.snippet.textDisplay, {
                        useNamedReferences: true,
                    })} -->
                </div>
            {/each}
        </div>
    {:else}
        <div class="grid comment bg-cyan-100 border-b-2 border-cyan-500 p-2">
            <!-- <span class="absolute t-0 l-0">{i}</span> -->
            <div class="flex flex-col col-span-2">
                <p class="m-0 mb-0 text-cyan-700 font-bold">
                    <span class="bg-gray-100 p-1 rounded">{i}: </span>
                    {comment.snippet.topLevelComment.snippet.authorDisplayName}
                </p>
                <p class="m-0 mb-0">
                    <span class="text-grey-500">
                        {getDate(
                            comment.snippet.topLevelComment.snippet.publishedAt
                        )}
                    </span><span class="text-grey-500">
                        {getTime(
                            comment.snippet.topLevelComment.snippet.publishedAt
                        )}
                    </span>
                </p>
            </div>
            <div class="col-start-3 col-span-12" id={comment.id} />
        </div>
    {/if}
{/each}

<style>
    .comment {
        grid-template-columns: repeat(15, calc(95vw / 15));
    }
</style>
