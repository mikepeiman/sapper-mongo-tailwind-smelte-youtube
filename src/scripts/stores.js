import { writable } from 'svelte/store'
// import { init } from "@lib/mongo"
// const {db} = await init()

let videosList = writable([])
let playlistsList = writable([])
let channelDetails = writable({})
let videoDetails = writable({})
let channelName = writable("")
let currentDisplayContext = writable("")
let channelId = writable("")
let videoId = writable("")
let getComments = writable("")
let uploadsId = writable("")
let playlistId = writable("")
let playlistName = writable("")
let comments = writable({})
let nextPageToken = writable("")
let currentPageToken = writable("")
let previousPageToken = writable("")
let pagination = writable({
    direction: "",
    tokens: [""],
    currentPageNumber: 0,
    "playlists": [{
        id: "",
        pageTokens: [""]
    }],
    "comments": {}
})

export const storeVideosList = {
    subscribe: videosList.subscribe,
    set: val => {
        localStorage.setItem("videosList", JSON.stringify(val))
        videosList.set(val)
    }
}

export const storePlaylistsList = {
    subscribe: playlistsList.subscribe,
    set: val => {
        localStorage.setItem("playlistsList", JSON.stringify(val))
        playlistsList.set(val)
    }
}

export const storeChannelDetails = {
    subscribe: channelDetails.subscribe,
    set: val => {
        localStorage.setItem("channelDetails", JSON.stringify(val))
        channelDetails.set(val)
    }
}

export const storeVideoDetails = {
    subscribe: videoDetails.subscribe,
    set: val => {
        localStorage.setItem("videoDetails", JSON.stringify(val))
        videoDetails.set(val)
    }
}

export const storeCurrentDisplayContext = {
    subscribe: currentDisplayContext.subscribe,
    set: val => {
        localStorage.setItem("currentDisplayContext", JSON.stringify(val))
        currentDisplayContext.set(val)
    }
}

export const storeChannelName = {
    subscribe: channelName.subscribe,
    set: val => {
        localStorage.setItem("channelName", JSON.stringify(val))
        channelName.set(val)
    }
}


export const storeChannelId = {
    subscribe: channelId.subscribe,
    set: val => {
        localStorage.setItem("channelId", JSON.stringify(val))
        channelId.set(val)
    }
}

export const storeUploadsId = {
    subscribe: uploadsId.subscribe,
    set: val => {
        localStorage.setItem("uploadsId", JSON.stringify(val))
        uploadsId.set(val)
    }
}

export const storePlaylistId = {
    subscribe: playlistId.subscribe,
    set: val => {
        localStorage.setItem("playlistId", JSON.stringify(val))
        playlistId.set(val)
    }
}

export const storePlaylistName = {
    subscribe: playlistName.subscribe,
    set: val => {
        localStorage.setItem("playlistName", JSON.stringify(val))
        playlistName.set(val)
    }
}

export const storeVideoId = {
    subscribe: videoId.subscribe,
    set: val => {
        localStorage.setItem("videoId", JSON.stringify(val))
        videoId.set(val)
    }
}

export const storeGetComments = {
    subscribe: getComments.subscribe,
    set: val => {
        localStorage.setItem("getComments", JSON.stringify(val))
        getComments.set(val)
    }
}


export const storeComments = {
    subscribe: comments.subscribe,
    set: val => {
        localStorage.setItem("comments", JSON.stringify(val))
        comments.set(val)
    }
}

export const storeNextPageToken = {
    subscribe: nextPageToken.subscribe,
    set: val => {
        localStorage.setItem("nextPageToken", JSON.stringify(val))
        nextPageToken.set(val)
    }
}

export const storeCurrentPageToken = {
    subscribe: currentPageToken.subscribe,
    set: val => {
        localStorage.setItem("currentPageToken", JSON.stringify(val))
        currentPageToken.set(val)
    }
}


export const storePreviousPageToken = {
    subscribe: previousPageToken.subscribe,
    set: val => {
        localStorage.setItem("previousPageToken", JSON.stringify(val))
        previousPageToken.set(val)
    }
}


export const storePagination = {
    subscribe: pagination.subscribe,
    set: val => {
        localStorage.setItem("pagination", JSON.stringify(val))
        pagination.set(val)
    }
}