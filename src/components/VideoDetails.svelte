<script>
    export let videoDetails;
    import Comments from "./Comments";
    import Icon from "./smelte/Icon";
    import Button from "./smelte/Button";
    import { storeGetComments} from "../scripts/stores"
	import { io } from "socket.io-client";
	const socket = io();
    let cols = 12;


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

    function runPyComments() {
        let id = videoDetails.id
        console.log(`pyComments id ${id}`);
        storeGetComments.set("runPyComments")
        let getCommentsAddress = `youtube-comment-downloader --youtubeid ${id} --output ./data/${id}.json`
        socket.emit("get comments", getCommentsAddress)
        // childProcess(`"youtube-comment-downloader --youtubeid ${id} --output ${id}.json"`)
    }
    function activateVenv() {
        let id = videoDetails.id
        let venvCommand = `.\\venv\\Scripts\\activate`
        socket.emit("activate venv", venvCommand)
        // childProcess(`"youtube-comment-downloader --youtubeid ${id} --output ${id}.json"`)
    }


</script>

<div
    class="playlistItem grid row-start-auto grid-cols-12 px-4 pt-4 pb-8 border-b-8 border-cyan-700"
>
    {#each Array(cols) as _, col}
        <div>
            <p>{col}</p>
        </div>
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
    <div class="col-start-9 col-span-2 flex-col">
        <div class="flex flex-col">
            <p>{getDateAndTime(videoDetails.snippet.publishedAt)}</p>
        </div>
        <div class="flex">
            <div>ID: {videoDetails.id}</div>
        </div>
    </div>
    <!-- <div class="col-start-11"><Icon>code</Icon></div> -->
    <div class="col-start-11">
        <Button
            on:click={runPyComments}
            icon="speaker_notes"
            color="amber"
            add="text-left p-2"
            remove="p-4"
            iconClass="p-2">Get Comments</Button
        >
        <Button
        on:click={activateVenv}
        icon="speaker_notes"
        color="amber"
        add="text-left p-2"
        remove="p-4"
        iconClass="p-2">Activate Venv</Button
    >

    </div>
</div>
<Comments id={videoDetails.id} />
