<script>
    export let channelName, channelId, uploadsId, playlistId, videoId;
    let playlists,
        playlistsList,
        maxResults = 50;
    let pageInfo = {};
    let pagesOfResults = 0;
    let nextPageToken = "";
    let videosList = [];
    let items, res;
    let channelDescription, channelDetails, channelThumbnails, videoDetails;
    import Button from "./smelte/Button";
    import TextField from "./smelte/TextField";
    import { onMount } from "svelte";
    import {
        storeCurrentDisplayContext,
        storePlaylistsList,
        storeChannelDetails,
        storeChannelName,
        storeChannelId,
        storeUploadsId,
        storeVideoDetails,
        storeVideoId,
        storeVideosList,
        storePlaylistId,
        storeVideoComments,
    } from "../scripts/stores.js";
    onMount(() => {
        handle({e: {event: "null"}})
        console.log(
        `🚀 ~ file: YouTubeItemsForm.svelte ~ line 30 ~ onMount ~ channelName, channelId, uploadsId, playlistId, videoId`,
        channelName,
        channelId,
        uploadsId,
        playlistId,
        videoId
    );

    });

    $: controlItems = [
        {
            varName: channelName,
            id: "channelName",
            fullName: "Channel Name",
            buttonText: "Search",
            function: () => searchByChannelName(),
        },
        {
            varName: channelId,
            id: "channelId",
            fullName: "Channel ID",
            buttonText: "Get Playlists",
            function: () => getPlaylistsByChannelId(),
        },
        {
            varName: uploadsId,
            id: "uploadsId",
            fullName: "Uploads ID",
            buttonText: "Get Uploads",
            function: () => getVideosByPlaylistId("uploads"),
        },
        {
            varName: playlistId,
            id: "playlistId",
            fullName: "Playlist ID",
            buttonText: "Get Videos",
            function: () => getVideosByPlaylistId("playlist"),
        },
        {
            varName: videoId,
            id: "videoId",
            fullName: "Video ID",
            buttonText: "Video Details",
            function: () => getVideoFromId(),
        },
    ];

    function handle(e) {
        console.log(
            `🚀 ~ file: YouTubeItemsForm.svelte ~ line 29 ~ handle ~ e.keyCode`,
            e.keyCode
        );
        if (e.keyCode == 13) {
            e.preventDefault();
            if (e.target.id == "Channel Name") {
                searchByChannelName(channelName);
            } else if (e.target.id == "Channel ID") {
                getPlaylistsByChannelId(channelId);
            } else if (e.target.id == "Uploads ID") {
                getVideosByPlaylistId(uploadsId);
            } else if (e.target.id == "Playlist ID") {
                getVideosByPlaylistId(playlistId);
            }
        }
    }
    function getPlaylistsByChannelId() {
        playlistsList = [];
        return gapi.client.youtube.playlists
            .list({
                part: ["snippet"],
                channelId: channelId,
                maxResults: maxResults,
            })
            .then(
                function (response) {
                    // Handle the results here (response.result has the parsed body).
                    console.log("Response", response);
                    console.log("Result: ", response.result);

                    let res = response.result;
                    // set variables like what we are displaying (playlists, uploads, playlist name)
                    if (res.items) {
                        setDisplayContext(res);
                        parseResultData($storeCurrentDisplayContext, res);
                    } else {
                        channelId = "Playlist not found";
                    }
                    // items = res.items[0];
                    // console.log("items: ", items);
                    storePlaylistsList.set(res.items);
                },
                function (err) {
                    console.error("Execute error", err);
                }
            );
    }

    function setDisplayContext(res) {
        if (
            res.kind == "youtube#channelListResponse" ||
            res.kind == "youtube#channel"
        ) {
            storeCurrentDisplayContext.set("Channel Details");
        }
        if (res.kind == "youtube#playlistListResponse") {
            storeCurrentDisplayContext.set("Collection");
        }
        if (
            res.kind == "youtube#playlistItemListResponse" ||
            res.kind == "youtube#playlist"
        ) {
            storeCurrentDisplayContext.set("Playlist");
        }
        if (res.kind == "youtube#playlistItem") {
            storeCurrentDisplayContext.set("Video Details");
        }
        if (res.kind == "youtube#videoListResponse") {
            storeCurrentDisplayContext.set("Video Details");
        } else {
            console.log(`res.kind unknown: ${res.kind} full res: `, res);
        }
    }

    function getVideosByPlaylistId(listType) {
        let id
        if(listType == "playlist"){id = playlistId}
        if(listType == "uploads"){id = uploadsId}
        videosList = [];
        let items, res;
        return gapi.client.youtube.playlistItems
            .list({
                part: ["snippet,contentDetails"],
                playlistId: `${id}`,
                maxResults: 50,
            })
            .then(
                function (response) {
                    // Handle the results here (response.result has the parsed body).
                    console.log("getVideosByPlaylistId Response", response);
                    console.log(
                        "⛏⛏⛏🔥🔥🔥 getVideosByPlaylistId Result: ",
                        response.result
                    );
                    res = response.result;
                    if (res.items) {
                        setDisplayContext(res);
                        parseResultData($storeCurrentDisplayContext, res);
                    } else {
                        id = "Playlist not found";
                    }
                    items = res.items;
                    storeVideosList.set(items);
                    console.log("items: ", items);
                },
                function (err) {
                    console.error("Execute error", err);
                }
            );
    }

    function searchByChannelName(channelName) {
        console.log(
            `🚀🔎🔎🔎 ~ file: YouTubeItemsForm.svelte ~ line 141 ~ searchByChannelName ~ channelName`,
            channelName
        );

        videosList = [];
        return gapi.client.youtube.channels
            .list({
                part: ["snippet,contentDetails,statistics"],
                forUsername: channelName,
                maxResults: 50,
            })
            .then(
                function (response) {
                    // Handle the results here (response.result has the parsed body).
                    console.log("Response", response);
                    console.log("Result: ", response.result);
                    let res = response.result;
                    if (res.items) {
                        setDisplayContext(res);
                        items = res.items[0];
                        parseResultData($storeCurrentDisplayContext, items);
                    } else {
                        items = [];
                        uploadsId = "Channel not found";
                    }

                    channelDetails = items;
                    console.log("items: ", items);
                    storeChannelName.set(channelName);
                    storeChannelDetails.set(channelDetails);
                    storeChannelId.set(items.id);
                },
                function (err) {
                    console.error("Execute error", err);
                }
            );
    }

    function getVideoFromId() {
        console.log(
            `🚀✨✨🔎 ~ file: YouTubeItemsForm.svelte ~ line 161 ~ getVideoFromId ~ id`,
            videoId
        );
        videoDetails = {};
        return gapi.client.youtube.videos
            .list({
                part: ["snippet,contentDetails,statistics"],
                id: videoId,
                maxResults: 50,
            })
            .then(
                function (response) {
                    // Handle the results here (response.result has the parsed body).
                    console.log("Response", response);
                    console.log("Result: ", response.result);
                    res = response.result;
                    if (res.items) {
                        setDisplayContext(res);
                        parseResultData(storeCurrentDisplayContext, res);
                    } else {
                        id = "Playlist not found";
                    }
                    items = res.items[0];
                    videoDetails = items;
                    storeVideoDetails.set(videoDetails);
                    console.log("items videoDetails: ", items);
                    getCommentsFromVideoId(videoId);
                },
                function (err) {
                    console.error("Execute error", err);
                }
            );
    }

    function getCommentsFromVideoId(id) {
        console.log(
            `🚀 ~ file: YouTubeItemsForm.svelte ~ line 225 ~ getCommentsFromVideoId ~ nextPageToken`,
            nextPageToken
        );
        console.log(
            `🚀 ~ file: YouTubeItemsForm.svelte ~ line 205 ~ getCommentsFromVideoId ~ id`,
            id
        );
        let comments = [];
        let comment = {};
        return gapi.client.youtube.commentThreads
            .list({
                part: ["id,snippet,replies"],
                videoId: id,
                maxResults: 1000,
                pageToken: nextPageToken,
            })
            .then(
                function (response) {
                    // Handle the results here (response.result has the parsed body).
                    console.log(
                        "🦜🦜🦜getCommentsFromVideoId Response",
                        response
                    );
                    nextPageToken = response.result.nextPageToken;

                    comments = response.result.items;
                    storeVideoComments.set(comments);
                },
                function (err) {
                    console.error("Execute error", err);
                }
            );
    }

    function parseResultData(type, res) {
        console.log(
            `🚀 ~ file: YouTubeItemsForm.svelte ~ line 190 ~ parseResultData ~ res`,
            res
        );
        // let res
        if (type == "Channel Details") {
            console.log(`Name res: `, res);
            channelId = res.id;
            nextPageToken = res.nextPageToken;
            if (res.snippet) {
                channelDescription = res.snippet.description;
                let thumbs = res.snippet.thumbnails;
                channelThumbnails = {
                    default: thumbs.default,
                    high: thumbs.high,
                    medium: thumbs.medium,
                };
            }
            if (res.contentDetails) {
                uploadsId = res.contentDetails.relatedPlaylists.uploads;
                storeUploadsId.set(uploadsId);
            }
        } else if (type == "Collection" || type == "Playlist") {
            res.items.forEach((item) => {
                // videosList = [...videosList, item];
                pageInfo = res.pageInfo;
                pagesOfResults = Math.ceil(
                    res.pageInfo.totalResults / res.pageInfo.resultsPerPage
                );
                nextPageToken = res.nextPageToken;
            });
            console.log(`ID res: `, res);
            if (res.kind == "youtube#playlistListResponse") {
                playlistsList = res.items;
                storePlaylistsList.set(playlistsList);
            } else {
                videosList = res.items;
                storeVideosList.set(res.items);
            }
        } else {
            res.items.forEach((item) => {
                console.log(
                    `🚀 ~ file: YouTube_OAuth.svelte ~ line 306 ~ res.items.forEach ~ item`,
                    item
                );
            });
            console.log(`ID res: `, res);
        }
    }
</script>

<div class="gridContainer">
    <!-- <div class="gridFieldContainer col-start-2">
        <div class="col-span-7">
            <TextField
                autocomplete
                bind:value={channelName}
                on:keypress={(e) => handle(e)}
                id="channelName"
                label="Channel Name"
                append="search"
            />
        </div>
        <Button
            class="col-start-8 col-span-3 yt-button h-14 self-start mt-2"
            on:click={() => searchByChannelName()}>Search</Button
        >
    </div>
    <div class="grid grid-cols-6 col-start-3">
        <div class="col-span-4">
            <TextField
                bind:value={channelId}
                on:keypress={(e) => handle(e)}
                id="channelId"
                label="Channel ID"
                append="search"
            />
        </div>
        <Button
            class="yt-button h-14 self-start mt-2 col-start-5 col-span-2"
            on:click={() => getPlaylistsByChannelId(channelId)}
            >Get Playlists</Button
        >
    </div>
    <div class="grid grid-cols-4 col-start-4">
        <div class="col-span-3">
            <TextField
                bind:value={uploadsId}
                on:keypress={(e) => handle(e)}
                id="uploadsId"
                label="Uploads ID"
                append="search"
            />
        </div>
        <Button
            inputControl
            class="yt-button h-14 self-start mt-2 col-start-4"
            on:click={() => getVideosByPlaylistId(uploadsId)}>Get Videos</Button
        >
    </div>
    <div class="grid grid-cols-4 col-start-5">
        <div class="col-span-3">
            <TextField
                remove="px-4 pl-4 pt-4"
                add="pl-1"
                labelRemove="pl-4 pt-4 px-4"
                labelAdd="pt-3 pl-2 text-l label-transition"
                iconClass="pr-0"
                bind:value={playlistId}
                on:keypress={(e) => handle(e)}
                id="playlistId"
                label="Playlist ID"
                append="search"
            />
            Playlist: {$storePlaylistName}
        </div>
        <Button
            remove="pl-4 px-4"
            add="pl-2 text-left"
            class="yt-button h-14 self-start mt-2 col-start-4"
            on:click={() => getVideosByPlaylistId(playlistId)}
            >Get Videos</Button
        >
    </div>
    <div class="grid grid-cols-4 col-start-6">
        <div class="col-span-3">
            <TextField
                bind:value={videoId}
                on:keypress={(e) => handle(e)}
                id="videoId"
                label="Video ID"
                append="search"
            />
        </div>
        <Button
            class="yt-button h-14 self-start mt-2 col-start-4"
            on:click={() => getVideoFromId(videoId)}>Video Details</Button
        >
    </div> -->
    {#each controlItems as item, i}
        <div class="grid grid-cols-10 col-start-{i + 2}">
            <div class="col-span-7">
                <TextField
                    bind:value={item.varName}
                    on:keypress={(e) => handle(e)}
                    id={item.id}
                    label={item.fullName}
                    append="search"
                />
            </div>
            <Button
                inputControl
                class="yt-button h-14 self-start mt-2 col-start-8 col-span-3"
                on:click={item.function}>{item.buttonText}</Button
            >
        </div>
    {/each}
</div>

<style>
    .yt-button {
        min-height: 3.5rem;
    }
    .gridContainer {
        display: grid;
        grid-template-columns: 5rem repeat(5, 1fr) 5rem;
        grid-gap: 0.5rem;
    }
    .gridFieldContainer {
        display: grid;
        grid-template-columns: repeat(10, minmax(0, 1fr));
    }
</style>
