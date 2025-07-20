# Twitter/X Integration Setup

This guide explains how to set up the Twitter/X feed integration for your notes page.

## Prerequisites

1. A Twitter/X developer account
2. A Twitter/X app with API access
3. Your Twitter/X username

## Getting Twitter API Credentials

### Step 1: Create a Twitter Developer Account

1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Sign in with your Twitter account
3. Apply for a developer account if you haven't already

### Step 2: Create a Twitter App

1. In the developer portal, go to "Projects & Apps" → "Create App"
2. Fill in the required information:
   - App name: Your app name (e.g., "My Personal Blog")
   - Use case: Select "Making a bot" or "Exploring the API"
   - App description: Brief description of your use case

### Step 3: Get API Credentials

After creating your app, you'll need to get the API credentials. You have two options:

#### Option 1: Bearer Token (Recommended for read-only access)

1. Go to your app's "Keys and Tokens" tab
2. Copy the "Bearer Token" - this is all you need for read-only access
3. Add it to your `.env` file:
   ```
   TWITTER_BEARER_TOKEN=your_bearer_token_here
   ```

#### Option 2: OAuth 1.0a (For write access)

1. Go to your app's "Keys and Tokens" tab
2. Copy the following values:
   - API Key
   - API Secret
   - Access Token
   - Access Token Secret
3. Add them to your `.env` file:
   ```
   TWITTER_API_KEY=your_api_key_here
   TWITTER_API_SECRET=your_api_secret_here
   TWITTER_ACCESS_TOKEN=your_access_token_here
   TWITTER_ACCESS_SECRET=your_access_token_secret_here
   ```

## Configuration

### Step 1: Update Your Username

In `src/pages/notes/[...page].astro`, replace `your_username` with your actual Twitter/X username:

```astro
<TwitterFeed username="Vijayabaskar56" count={5} showMetrics={true} />
```

### Step 2: Environment Variables

Create a `.env` file in your project root (if it doesn't exist) and add your Twitter API credentials:

```env
# Option 1: Bearer Token (recommended)
TWITTER_BEARER_TOKEN=your_bearer_token_here

# Option 2: OAuth 1.0a (if you need write access)
# TWITTER_API_KEY=your_api_key_here
# TWITTER_API_SECRET=your_api_secret_here
# TWITTER_ACCESS_TOKEN=your_access_token_here
# TWITTER_ACCESS_SECRET=your_access_token_secret_here
```

### Step 3: Customize the Feed

You can customize the Twitter feed by modifying the props:

```astro
<TwitterFeed 
  username="your_username" 
  count={10}           // Number of tweets to display (default: 5)
  showMetrics={false}  // Show/hide like/retweet counts (default: true)
/>
```

## Features

The Twitter feed includes:

- ✅ Latest tweets from your account
- ✅ Formatted tweet text with clickable links, hashtags, and mentions
- ✅ Relative timestamps (e.g., "2h ago")
- ✅ Engagement metrics (likes, retweets, replies)
- ✅ Direct links to view tweets on X
- ✅ Responsive design that matches your site's theme
- ✅ Dark mode support
- ✅ Fallback display when tweets can't be loaded
- ✅ Graceful error handling

## Troubleshooting

### No tweets are showing

1. Check that your API credentials are correct
2. Verify your Twitter username is correct
3. Ensure your Twitter account is public
4. Check the browser console for error messages

### API rate limits

Twitter has rate limits on API calls. The feed will gracefully handle rate limit errors and show a fallback message.

### Development vs Production

- In development, tweets are fetched on each page load
- In production, tweets are cached and fetched during build time
- Consider implementing a caching strategy for production if you have high traffic

## Security Notes

- Never commit your `.env` file to version control
- Use Bearer Token authentication for read-only access (more secure)
- Keep your API credentials private and secure
- Consider using environment variables in your hosting platform

## API Limits

Twitter API v2 has the following limits for the endpoints used:
- User lookup: 300 requests per 15 minutes
- User timeline: 1800 requests per 15 minutes

For most personal blogs, these limits should be sufficient. 
