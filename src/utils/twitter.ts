import { TwitterApi } from "twitter-api-v2";

export interface Tweet {
	id: string;
	text: string;
	created_at?: string;
	public_metrics?: {
		retweet_count: number;
		reply_count: number;
		like_count: number;
		quote_count: number;
	};
	author_id?: string;
	entities?: {
		urls?: Array<{
			url: string;
			expanded_url: string;
			display_url: string;
		}>;
		hashtags?: Array<{
			tag: string;
		}>;
		mentions?: Array<{
			username: string;
		}>;
	};
}

export interface TwitterUser {
	id: string;
	username: string;
	name: string;
	profile_image_url: string;
}

// Simple cache for tweets
const tweetCache = new Map<string, { tweets: Tweet[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getLatestTweets(username: string, count: number = 10): Promise<Tweet[]> {
	// Check cache first
	const cacheKey = `${username}-${count}`;
	const cached = tweetCache.get(cacheKey);
	if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
		return cached.tweets;
	}

	try {
		// Check if we have the required environment variables
		const bearerToken = import.meta.env.TWITTER_BEARER_TOKEN;
		const apiKey = import.meta.env.TWITTER_API_KEY;
		const apiSecret = import.meta.env.TWITTER_API_SECRET;
		const accessToken = import.meta.env.TWITTER_ACCESS_TOKEN;
		const accessSecret = import.meta.env.TWITTER_ACCESS_SECRET;
		console.log(bearerToken, "bearerToken");
		if (!bearerToken && (!apiKey || !apiSecret || !accessToken || !accessSecret)) {
			console.warn("Twitter API credentials not found. Skipping tweet fetch.");
			return [];
		}

		let client: TwitterApi;

		if (bearerToken) {
			// Use Bearer Token (App-only authentication)
			client = new TwitterApi(bearerToken);
		} else {
			// Use OAuth 1.0a (User authentication)
			client = new TwitterApi({
				appKey: apiKey!,
				appSecret: apiSecret!,
				accessToken: accessToken!,
				accessSecret: accessSecret!,
			});
		}

		// Get user ID first
		const user = await client.v2.userByUsername(username);

		if (!user.data) {
			console.error(`User ${username} not found`);
			return [];
		}

		// Get user's tweets
		const tweets = await client.v2.userTimeline(user.data.id, {
			max_results: count,
			"tweet.fields": ["created_at", "public_metrics", "entities", "author_id"],
			exclude: ["retweets", "replies"],
		});

		const tweetData = tweets.data.data || [];

		// Cache the results
		tweetCache.set(cacheKey, {
			tweets: tweetData,
			timestamp: Date.now(),
		});

		return tweetData;
	} catch (error: any) {
		// Handle rate limiting specifically
		if (error.code === 429) {
			console.warn("Twitter API rate limit exceeded. Skipping tweet fetch for now.");
			return [];
		}

		// Handle other errors
		console.error("Error fetching tweets:", error);
		return [];
	}
}

export function formatTweetText(tweet: Tweet): string {
	let formattedText = tweet.text;

	// Convert line breaks to <br>
	formattedText = formattedText.replace(/\n/g, "<br>");

	// Use entities if available for better accuracy
	if (tweet.entities) {
		// Replace URLs with expanded versions
		if (tweet.entities.urls) {
			for (const urlEntity of tweet.entities.urls) {
				formattedText = formattedText.replace(
					urlEntity.url,
					`<a href="${urlEntity.expanded_url}" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">${urlEntity.display_url}</a>`,
				);
			}
		}

		// Replace hashtags
		if (tweet.entities.hashtags) {
			for (const hashtag of tweet.entities.hashtags) {
				const regex = new RegExp(`#${hashtag.tag}\\b`, "gi");
				formattedText = formattedText.replace(
					regex,
					`<span class="text-accent font-semibold">#${hashtag.tag}</span>`,
				);
			}
		}

		// Replace mentions
		if (tweet.entities.mentions) {
			for (const mention of tweet.entities.mentions) {
				const regex = new RegExp(`@${mention.username}\\b`, "gi");
				formattedText = formattedText.replace(
					regex,
					`<span class="text-accent font-semibold">@${mention.username}</span>`,
				);
			}
		}
	} else {
		// Fallback to regex if no entities
		formattedText = formattedText.replace(
			/(https?:\/\/[^\s]+)/g,
			'<a href="$1" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">$1</a>',
		);
		formattedText = formattedText.replace(
			/#(\w+)/g,
			'<span class="text-accent font-semibold">#$1</span>',
		);
		formattedText = formattedText.replace(
			/@(\w+)/g,
			'<span class="text-accent font-semibold">@$1</span>',
		);
	}

	return formattedText;
}

export function formatTweetDate(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (diffInSeconds < 60) {
		return "just now";
	} else if (diffInSeconds < 3600) {
		const minutes = Math.floor(diffInSeconds / 60);
		return `${minutes}m ago`;
	} else if (diffInSeconds < 86400) {
		const hours = Math.floor(diffInSeconds / 3600);
		return `${hours}h ago`;
	} else if (diffInSeconds < 2592000) {
		const days = Math.floor(diffInSeconds / 86400);
		return `${days}d ago`;
	} else {
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
		});
	}
}
