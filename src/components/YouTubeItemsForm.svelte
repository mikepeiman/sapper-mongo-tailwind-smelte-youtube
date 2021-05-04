<script>
    export let channelName;
    export let channelId;
    export let uploadsId;
    export let playlistId;
    export let videoId;
    let playlists,
        playlistsList,
        maxResults = 50;
    let pageInfo = {};
    // let pagination = {}
    let pagesOfResults = 0;
    let pageToken = "";
    let videosList = [];
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
        storeComments,
        storeNextPageToken,
        storePagination,
    } from "../scripts/stores.js";

    $: channelName = controlItems["channelName"]["varName"];
    $: channelId = controlItems["channelId"]["varName"];
    $: uploadsId = controlItems["uploadsId"]["varName"];
    $: playlistId = controlItems["playlistId"]["varName"];
    $: videoId = controlItems["videoId"]["varName"];

    $: if (typeof window != "undefined") {
        storeChannelName.subscribe((val) => {
            controlItems["channelName"]["varName"] = val;
        });
        storeChannelId.subscribe((val) => {
            controlItems["channelId"]["varName"] = val;
        });
        storeUploadsId.subscribe((val) => {
            controlItems["uploadsId"]["varName"] = val;
        });
        storeVideoId.subscribe((val) => {
            controlItems["videoId"]["varName"] = val;
        });
        storePlaylistId.subscribe((val) => {
            console.log(
                `🚀 ~ file: YouTubeItemsForm.svelte ~ line 56 ~ storePlaylistId.subscribe ~ val`,
                val
            );
            controlItems["playlistId"]["varName"] = val;
        });
    }
    $: if (typeof window != "undefined") {
        console.log(
            `$storePagination.currentPageNumber: ${$storePagination.currentPageNumber}`
        );
        let num = 0
        // $storePagination = pagination
        if($storePagination.currentPageNumber){
            num = $storePagination.currentPageNumber
        }
 
        if (num >= 0 && num <=10) {
            console.log(`🚀 ~ file: YouTubeItemsForm.svelte ~ line 68 ~ num`, num)
            doPagination();
        }
        console.log(
            `🚀 ~ file: YouTubeItemsForm.svelte ~ line 73 ~ storePagination.subscribe ~ pageToken`,
            pageToken
        );
    }

    function doPagination() {
        let val = $storePagination;
        if (val.direction == "forward") {
            pageToken = $storeNextPageToken;
            // todo must check if this token exists and do not duplicate it
            val.tokens.push(pageToken)
            populateTokensList()
            // getCommentsFromVideoId($storeVideoId);
        }
        if (val.direction == "back") {
            pageToken = val.tokens[val.currentPageNumber - 1] || "";
            // getCommentsFromVideoId($storeVideoId);
        }
    }

    // On pagination, need to do:
    //  1. Increment/decrement pageNum
    //  2. check if pageToken exists at that index
    //      2a. IF EXISTS => load data from that index
    //      2b. IF NOT => fetch data from that index
    //  3.

    function populateTokensList() {
        let id
        let ctx = $storeCurrentDisplayContext
        console.log(`🚀 ~ file: YouTubeItemsForm.svelte ~ line 107 ~ populateTokensList ~ ctx`, ctx)
        if(ctx == "playlistsLists"){
            $storePagination[val]["playlistsLists"][id].push(pageToken)

        }
        if(ctx == "playlist"){
            id = $storePlaylistId
            console.log('%c⧭', 'color: #00a3cc', pageToken);
            console.log('%c⧭', 'color: #00e600', id);
            $storePagination.playlists.id = id
            console.log('%c⧭', 'color: #aa00ff', $storePagination.playlists.id);
            $storePagination.playlists.id.pageTokens.push(pageToken)
        }
        if(ctx == "videoDetails"){
            $storePagination[val]["videoDetails"][id].push(pageToken)
        }
    }

    onMount(() => {
        loadDataFromLS();
    });

    function loadDataFromLS() {
        controlItems["channelName"]["varName"] = lsget("channelName");
        controlItems["channelId"]["varName"] = lsget("channelId");
        controlItems["uploadsId"]["varName"] = lsget("uploadsId");
        controlItems["playlistId"]["varName"] = lsget("playlistId");
        controlItems["videoId"]["varName"] = lsget("videoId");
        channelDetails = lsget("channelDetails");
        videoDetails = lsget("videoDetails");
        videosList = lsget("videosList");
        playlistsList = lsget("playlistsList");
        // pagination = lsget("pagination") ? lsget("pagination") : { currentPageNumber: 15}
    }

    let controlItems = {
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
            console.log(`🔎🔎🔎keypress enter`, e.target);
            e.preventDefault();
            if (e.target.id == "channelName") {
                searchByChannelName();
            }
            if (e.target.id == "channelId") {
                getPlaylistsByChannelId();
            }
            if (e.target.id == "uploadsId") {
                getVideosByPlaylistId();
            }
            if (e.target.id == "playlistId") {
                getVideosByPlaylistId();
            }
            if (e.target.id == "videoId") {
                getVideoFromId();
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
            storeCurrentDisplayContext.set("channelDetails");
        }
        if (res.kind == "youtube#playlistListResponse") {
            storeCurrentDisplayContext.set("playlistsList");
        }
        if (
            res.kind == "youtube#playlistItemListResponse" ||
            res.kind == "youtube#playlist"
        ) {
            storeCurrentDisplayContext.set("playlist");
        }
        if (res.kind == "youtube#playlistItem") {
            storeCurrentDisplayContext.set("videoDetails");
        }
        if (res.kind == "youtube#videoListResponse") {
            storeCurrentDisplayContext.set("videoDetails");
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
        videosList = [];
        let items, res
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
                    res = response.result;
                    setDisplayContext(res);
                    let totalResults = res.pageInfo.totalResults;
                    if (totalResults == 1) {
                        items = res.items[0];
                        parseResultData($storeCurrentDisplayContext, items);
                    }
                    if (totalResults > 1) {
                        console.log(
                            `🚀 ~ file: YouTubeItemsForm.svelte ~ line 246 ~ searchByChannelName ~ totalResults > 1 --- `,
                            totalResults
                        );
                        items = res.items[0];
                        parseResultData($storeCurrentDisplayContext, items);
                    }
                    if (totalResults == 0) {
                        items = [];
                        channelId = uploadsId = "Channel not found";
                    }

                    console.log("items: ", items);
                    $storeChannelDetails = channelDetails = items;
                    $storeChannelId = channelId = items.id;
                    $storeChannelName = channelName;
                    // storeChannelName.set(channelName);
                    // storeChannelDetails.set(channelDetails);
                    // storeChannelId.set(items.id);
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
        $storeVideoId = videoId;
        let items, res;
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
                        parseResultData($storeCurrentDisplayContext, res);
                    } else {
                        id = "Playlist not found";
                    }
                    items = res.items[0];
                    videoDetails = items;
                    storeVideoDetails.set(videoDetails);
                    console.log("items videoDetails: ", items);
                    getCommentsFromVideoId(videoId, videoDetails);
                    setDisplayContext(res);
                },
                function (err) {
                    console.error("Execute error", err);
                }
            );
    }

    function getCommentsFromVideoId(id) {
        console.log(
            `🚀 ~ file: YouTubeItemsForm.svelte ~ line 225 ~ getCommentsFromVideoId ~ $storeNextPageToken`,
            $storeNextPageToken
        );
        console.log(
            `🚀 ~ file: YouTubeItemsForm.svelte ~ line 205 ~ getCommentsFromVideoId ~ id`,
            id
        );
        let items, res;
        return gapi.client.youtube.commentThreads
            .list({
                part: ["id,snippet,replies"],
                videoId: id,
                maxResults: 100,
                pageToken: pageToken,
            })
            .then(
                function (response) {
                    res = response.result;
                    console.log(`🦜🦜🦜getCommentsFromVideoId result`, res);
                    $storeNextPageToken = res.nextPageToken;
                    // $storePagination[tokens].push(res.nextPageToken)
                    $storeComments = { id: id, items: res.items };
                    $storeVideoDetails.comments = res.items;
                },
                function (err) {
                    console.error("Execute error", err);
                }
            );
    }

    function parseResultData(type, res) {
        console.log(`parseResultData(type, res) res: `, type, res);
        if (type == "Channel Details") {
            console.log(
                `🚀 ~ file: YouTubeItemsForm.svelte ~ line 338 ~ parseResultData ~ type`,
                type
            );
            $storeChannelId = channelId = res.id;
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
        } else if (type == "playlistsList" || type == "playlist") {
            res.items.forEach((item) => {
                // videosList = [...videosList, item];
                pageInfo = res.pageInfo;
                pagesOfResults = Math.ceil(
                    res.pageInfo.totalResults / res.pageInfo.resultsPerPage
                );
                $storeNextPageToken = res.nextPageToken;
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
            console.log(`parseResultData not matching list types: res: `, res);
        }
    }
</script>

<div class="gridContainer">
    <!-- <p>channelName {channelName}</p>
    <p>channelId {channelId}</p>
    <p>uploadsId {uploadsId}</p>
    <p>playlistId {playlistId}</p>
    <p>videoId {videoId}</p> -->

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
                color="amber"
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
