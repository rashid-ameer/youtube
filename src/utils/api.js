import axios from "axios";
import { parseISO, formatDistanceToNow } from "date-fns";
import { numberFormatToSuffix } from "./helper";

// BASE URL
const BASE_URL = "https://www.googleapis.com/youtube/v3";

// APIs object
const APIs = {
	getVideos: `${BASE_URL}/videos`,
	getChannelInfo: `${BASE_URL}/channels`,
	getVideoURL: (videoId) => `https://www.youtube.com/watch?v=${videoId}`,
	getChannelURL: (channelCustomURL) => `https://www.youtube.com/${channelCustomURL}`,
	getSearchURL: `${BASE_URL}/search`,
};

// Function to fetch channel info
async function fetchChannelInfo(channelId) {
	const channelResponse = await axios.get(APIs.getChannelInfo, {
		params: {
			key: import.meta.env.VITE_API_KEY,
			part: "snippet",
			id: channelId,
		},
	});
	return channelResponse.data.items[0];
}

// Function to get video snippet details
function getVideoSnippetDetails(video) {
	return {
		videoTitle: video.snippet.title,
		videoThumbnail: video.snippet.thumbnails.standard?.url || video.snippet.thumbnails.medium.url,
		channelName: video.snippet.channelTitle,
		videoDescription: video.snippet.description,
	};
}

// Function to get video content details
function getVideoContentDetails(video) {
	return {
		videoURL: APIs.getVideoURL(video.id),
		channelURL: APIs.getChannelURL(video.snippet.customUrl),
	};
}

// Function to get video statistic details
function getVideoStatisticDetails(video) {
	const parsedDate = parseISO(video.snippet.publishedAt);
	const videoPublished = formatDistanceToNow(parsedDate, { addSuffix: true });
	const videoViews = numberFormatToSuffix(video.statistics.viewCount);

	return {
		videoViews,
		videoPublished,
	};
}

// Function to transform video data
async function transformVideoData(video) {
	const channelId = video.snippet.channelId;
	const channelData = await fetchChannelInfo(channelId);
	const channelThumbnail = channelData.snippet.thumbnails.default.url;
	const channelURL = APIs.getChannelURL(channelData.snippet.customUrl);

	return {
		id: video.id,
		...getVideoSnippetDetails(video),
		...getVideoContentDetails(video),
		...getVideoStatisticDetails(video),
		channelThumbnail,
		channelId,
		channelURL,
	};
}

// function to get video content details and statis
async function getAsyncVideoStatisticsContent(videoId) {
	const response = await axios.get(APIs.getVideos, {
		params: {
			part: "snippet,contentDetails,statistics",
			id: videoId,
			key: import.meta.env.VITE_API_KEY,
		},
	});
	return response.data.items[0];
}

// function to get videos from youtube api
async function getVideosIds(nextPageToken) {
	const response = await axios.get(APIs.getVideos, {
		params: {
			part: "snippet,contentDetails,statistics",
			maxResults: 10,
			key: import.meta.env.VITE_API_KEY,
			chart: "mostPopular",
			pageToken: nextPageToken,
			regionCode: "PK",
		},
		transformResponse: (response) => {
			const data = JSON.parse(response);
			const nextPageToken = data.nextPageToken;
			const videoIds = data.items.map((item) => {
				return item.id;
			});
			return { nextPageToken, videoIds };
		},
	});
	return response.data;
}

// function for making a request to information of single video
async function getVideoInformation(videoId) {
	const response = await axios.get(APIs.getVideos, {
		params: {
			part: "snippet,contentDetails,statistics",
			id: videoId,
			key: import.meta.env.VITE_API_KEY,
		},
	});

	const video = transformVideoData(response.data.items[0]);
	return video;
}

// function for getting search video results
async function getSearchVideosIds(searchQuery, nextPageToken) {
	const response = await axios.get(APIs.getSearchURL, {
		params: {
			maxResults: 10,
			key: import.meta.env.VITE_API_KEY,
			q: searchQuery,
			pageToken: nextPageToken,
			type: "video",
		},
		transformResponse: (response) => {
			const data = JSON.parse(response);
			const nextPageToken = data.nextPageToken;
			const videoIds = data.items.map((item) => {
				return item.id.videoId;
			});
			return { nextPageToken, videoIds };
		},
	});

	return response.data;
}

export { getVideosIds, getSearchVideosIds, getVideoInformation };
