<script>
    export let channelName 
    export let channelId = controlItems["channelId"]["varName"];
    export let uploadsId = controlItems["uploadsId"]["varName"];
    export let playlistId = controlItems["playlistId"]["varName"];
    export let videoId = controlItems["videoId"]["varName"];
    let playlists,
        playlistsList,
        maxResults = 50;
    let pageInfo = {};
    let pagesOfResults = 0;
    let nextPageTokenComments = "";
    let nextPageTokenPlaylistList = "";
    let nextPageTokenPlaylistVideos = "";
    let videosList = [];
    let items, res;
    let channelDescription, channelDetails, channelThumbnails, videoDetails;
    import Button from "./smelte/Button";
    import TextField from "./smelte/TextField";
    import { onMount } from "svelte";
    import lsget from "../scripts/_lsget.js";
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

    $: channelName 
    $: channelId;
    $: uploadsId;
    $: playlistId;
    $: videoId;

    onMount(() => {
        loadDataFromLS();
        console.log(
            `🚀 ~ file: YouTubeItemsForm.svelte ~ line 30 ~ onMount ~ channelName, channelId, uploadsId, playlistId, videoId`,
            channelName,
            channelId,
            uploadsId,
            playlistId,
            videoId
        );
    });

    function loadDataFromLS() {
        controlItems["channelName"]["varName"] = channelName = lsget("channelName");
        controlItems["channelId"]["varName"] = channelId = lsget("channelId");
        controlItems["uploadsId"]["varName"] = uploadsId = lsget("uploadsId");
        controlItems["playlistId"]["varName"] = playlistId = lsget("playlistId");
        controlItems["videoId"]["varName"] = videoId = lsget("videoId");
        channelDetails = lsget("channelDetails");
        videoDetails = lsget("videoDetails");
        videosList = lsget("videosList");
        playlistsList = lsget("playlistsList");

    }

    $: controlItems = {
        channelName: {
            varName: channelName,
            id: "channelName",
            fullName: "Channel Name",
            buttonText: "Search",
            function: () => searchByChannelName(),
        },
        channelId: {
            varName: channelId,
            id: "channelId",
            fullName: "Channel ID",
            buttonText: "Get Playlists",
            function: () => getPlaylistsByChannelId(),
        },
        uploadsId: {
            varName: uploadsId,
            id: "uploadsId",
            fullName: "Uploads ID",
            buttonText: "Get Uploads",
            function: () => getVideosByPlaylistId("uploads"),
        },
        playlistId: {
            varName: playlistId,
            id: "playlistId",
            fullName: "Playlist ID",
            buttonText: "Get Videos",
            function: () => getVideosByPlaylistId("playlist"),
        },
        videoId: {
            varName: videoId,
            id: "videoId",
            fullName: "Video ID",
            buttonText: "Video Details",
            function: () => getVideoFromId(),
        },
    };



    function handle(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            if (e.target.id == "Channel Name") {
                searchByChannelName();
            } else if (e.target.id == "Channel ID") {
                getPlaylistsByChannelId();
            } else if (e.target.id == "Uploads ID") {
                getVideosByPlaylistId();
            } else if (e.target.id == "Playlist ID") {
                getVideosByPlaylistId();
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
        let id;
        if (listType == "playlist") {
            id = playlistId;
        }
        if (listType == "uploads") {
            id = uploadsId;
        }
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

    function searchByChannelName() {
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
            `🚀 ~ file: YouTubeItemsForm.svelte ~ line 225 ~ getCommentsFromVideoId ~ nextPageTokenComments`,
            nextPageTokenComments
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
                maxResults: 100,
                pageToken: nextPageTokenComments,
            })
            .then(
                function (response) {
                    // Handle the results here (response.result has the parsed body).
                    console.log(
                        "🦜🦜🦜getCommentsFromVideoId Response",
                        response
                    );
                    nextPageTokenComments = response.result.nextPageToken;

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
            // nextPageToken = res.nextPageToken;
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
                nextPageTokenPlaylistList = res.nextPageToken;
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
<p>channelName {channelName}</p>
<p>channelId {channelId}</p>
<p>uploadsId {uploadsId}</p>
<p>playlistId {playlistId}</p>
<p>videoId {videoId}</p>

    {#each Object.keys(controlItems) as item, i}
        <div class="grid grid-cols-10 col-start-{i + 2}">
            <div class="col-span-7">
                <TextField
                    bind:value={controlItems[item].varName}
                    on:keypress={(e) => handle(e)}
                    id={controlItems[item].id}
                    label={controlItems[item].fullName}
                    append="search"
                />
            </div>
            <Button
                inputControl
                class="yt-button h-14 self-start mt-2 col-start-8 col-span-3"
                on:click={controlItems[item].function}
                >{controlItems[item].buttonText}</Button
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
