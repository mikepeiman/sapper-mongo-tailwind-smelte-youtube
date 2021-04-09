<script>
    /**
     * Sample JavaScript code for youtube.channels.list
     * See instructions for running APIs Explorer code samples locally:
     * https://developers.google.com/explorer-help/guides/code_samples#javascript
     */

    import { onMount } from "svelte";
    // import "smelte/src/tailwind.css";
    import Button from "../components/smelte/Button";
    import ChannelDetails from "../components/ChannelDetails.svelte";
    import Video from "../components/Video.svelte";
    import lsget from '../scripts/_lsget.js'

    import {
        storeVideosList,
        storeChannelDetails,
        storePlaylistsList,
        storeVideoDetails,
        storeChannelName,
        storeCurrentDisplayContext,
        storeChannelId,
        storeUploadsId,
        storePlaylistId,
        storeVideoId,
        storeComments
    } from "../scripts/stores.js";
    import { API_KEY } from "../scripts/secret_keys.js";
    import { CLIENT_ID } from "../scripts/secret_keys.js";
    import PlaylistItem from "../components/PlaylistItem.svelte";
    import Playlist from "../components/Playlist.svelte";
    import YouTubeItemsForm from "../components/YouTubeItemsForm.svelte";
    import Pagination from "../components/Pagination.svelte";

    let mounted = false,
        gapiLoaded = false;

    let forUsername = "";
    let channelName = "";
    let currentDisplayContext = "default";
    // Options: "Channel Details", "Collection", "Playlist", "Video Details"
    let channelId, videoId, comments, videoDetails
    let channelDetails = {};
    // let videoDetails = $storeVideoDetails;
    let channelDescription = "";
    let channelThumbnails = {};
    let nextPageToken = "";
    let pageInfo = {};
    let playlistsList;
    let videosList = [];
    let maxResults = 50;
    let uploadsId = "";
    let playlistId = "";
    let pagesOfResults = 0;
    let isAuthorized = false;

    onMount(() => {
        // console.log(`tailwind colors: `, colors)
        if (gapiLoaded) {
            handleClientLoad();
        }
        handleClientLoad();
        loadDataFromLS();
    });

    storeVideosList.subscribe((val) => {
        videosList = val;
    });
    storeChannelName.subscribe((val) => {
        channelName = val;
    });
    storeChannelDetails.subscribe((val) => {
        channelDetails = val;
    });
    storeCurrentDisplayContext.subscribe((val) => {
        currentDisplayContext = val;
    });
    storeVideoDetails.subscribe((val) => {
        videoDetails = val;
    });
    storePlaylistsList.subscribe((val) => {
        playlistsList = val;
    });
    storeVideosList.subscribe((val) => {
        videosList = val;
    });
    storeVideoId.subscribe((val) => {
        videoId = val;
    });
    storePlaylistId.subscribe((val) => {
        playlistId = val;
    });


    function loadDataFromLS() {
        $storeChannelName = channelName = lsget("channelName");
        $storeChannelDetails = channelDetails = lsget("channelDetails");
        $storeVideoDetails = videoDetails = lsget("videoDetails");
        $storeVideosList = videosList = lsget("videosList");
        $storePlaylistsList = playlistsList = lsget("playlistsList");
        $storeCurrentDisplayContext = currentDisplayContext = lsget("currentDisplayContext");
        $storeChannelId = channelId = lsget("channelId");
        $storeUploadsId = uploadsId = lsget("uploadsId");
        $storePlaylistId = playlistId = lsget("playlistId");
        $storeVideoId = videoId = lsget("videoId");
        $storeComments = comments = lsget("comments");
    }

    function loadGapi() {
        mounted = true;
        gapiLoaded = true;
        handleClientLoad();
        // gapi.load("client:auth2", function () {
        //     gapi.auth2.init({ client_id: CLIENT_ID });
        // });
    }

    var GoogleAuth;
    var SCOPE = "https://www.googleapis.com/auth/youtube.force-ssl";
    function handleClientLoad() {
        console.log(
            `🚀 ~ file: YouTube_OAuth.svelte ~ line 170 ~ handleClientLoad ~ handleClientLoad`
        );
        // Load the API's client and auth2 modules.
        // Call the initClient function after the modules load.
        gapi.load("client:auth2", initClient);
    }

    function initClient() {
        // In practice, your app can retrieve one or more discovery documents.
        var discoveryUrl =
            "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest";

        // Initialize the gapi.client object, which app uses to make API requests.
        // Get API key and client ID from API Console.
        // 'scope' field specifies space-delimited list of access scopes.
        gapi.client
            .init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: [discoveryUrl],
                scope: SCOPE,
            })
            .then(function () {
                GoogleAuth = gapi.auth2.getAuthInstance();
                console.log(
                    `🚀 ~ file: YouTube_OAuth.svelte ~ line 80 ~ GoogleAuth`,
                    GoogleAuth
                );

                // Listen for sign-in state changes.
                GoogleAuth.isSignedIn.listen(updateSigninStatus);

                // Handle initial sign-in state. (Determine if user is already signed in.)
                var user = GoogleAuth.currentUser.get();
                setSigninStatus();
            });
    }

    function handleAuthClick() {
        if (GoogleAuth.isSignedIn.get()) {
            console.log(
                `🚀 ~ file: YouTube_OAuth.svelte ~ line 93 ~ handleAuthClick ~ GoogleAuth`,
                GoogleAuth
            );
            // User is authorized and has clicked "Sign out" button.
            GoogleAuth.signOut();
        } else {
            console.log(
                `🚀 ~ file: YouTube_OAuth.svelte ~ line 97 ~ handleAuthClick ~ GoogleAuth`,
                GoogleAuth
            );
            // User is not signed in. Start Google auth flow.
            GoogleAuth.signIn();
        }
    }

    function revokeAccess() {
        GoogleAuth.disconnect();
    }

    function setSigninStatus() {
        var user = GoogleAuth.currentUser.get();
        console.log(
            `🚀 ~ file: YouTube_OAuth.svelte ~ line 107 ~ setSigninStatus ~ user`,
            user
        );
        isAuthorized = user.hasGrantedScopes(SCOPE);
    }

    function updateSigninStatus() {
        setSigninStatus();
    }

    function pagination(event) {
        let dir = event.detail.dir;
        console.log(
            `🚀 ~ file: YouTube_OAuth.svelte ~ line 266 ~ pagination ~ dir `,
            dir
        );
    }
</script>

<svelte:head>
    <script
        src="https://apis.google.com/js/api.js"
        on:load={handleClientLoad}></script>
</svelte:head>
<div class="flex justify-center bg-cyan-100 p-3 m-0 mb-2 border-2">
    <h3 class="center">YouTube Data API V3</h3>
    <div class="auth-widget absolute top-10 right-20">
        {#if isAuthorized}
            <Button color="cyan" on:click={() => revokeAccess()}
                >Revoke Access</Button
            >
            <p>You are signed in and authorized.</p>
        {:else}
            <Button color="blue" on:click={() => handleAuthClick()}
                >Handle Auth</Button
            >
            <p>Not authorized; please sign in.</p>
        {/if}
    </div>
</div>

<YouTubeItemsForm
    {channelName}
    {channelId}
    {uploadsId}
    {playlistId}
    {videoId}
/>

<div class="flex justify-center">
    <div class="block">
        <Pagination on:pagination={pagination} />
    </div>
</div>

<div class="bg-cyan-100 border-2 p-2 my-2 flex flex-wrap justify-start justify-items-start">
    {#if currentDisplayContext == "Channel Details"}
        <ChannelDetails {channelDetails} />
    {/if}

    {#if currentDisplayContext == "Collection"}
        {#if pageInfo.totalResults}
            <h4>
                {currentDisplayContext}: # of playlistsList: {pageInfo.totalResults}
            </h4>
        {/if}
        {#each playlistsList as playlist}
            <Playlist {playlist} />
        {/each}
    {/if}
    {#if currentDisplayContext == "Playlist"}
        {#each videosList as item}
            <PlaylistItem {item} />
        {/each}
    {/if}
    {#if currentDisplayContext == "Video Details"}
        <Video {videoDetails} />
    {/if}
</div>

<div class="flex justify-center">
    <div class="block">
        <Pagination on:pagination={pagination} />
    </div>
</div>

<style>
    .videoItem {
        margin: 0.25rem;
        cursor: pointer;
        background: rgba(72, 35, 158, 0.1);
        border: 1px solid rgba(72, 35, 158, 0.7);
    }
    .videoItem:hover {
        background: rgba(0, 0, 0, 0.25);
    }
    .thumbnail {
        background: black;
    }
    .hidden {
        display: none;
    }
    .auth-widget {
        top: 1rem;
        right: 1rem;
    }
</style>
