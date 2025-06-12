// This function fetches videos from YouTube Data API
export async function fetchYouTubeVideos(query: string, maxResults = 3) {
  const API_KEY = "AIzaSyDV_W02SDk5EPjSHKZHtE--X4nbKDWluSQ"
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${encodeURIComponent(query)}&type=video&key=${API_KEY}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (data.error) {
      console.error("YouTube API Error:", data.error)
      throw new Error(data.error.message)
    }

    return data.items || []
  } catch (error) {
    console.error("Error fetching YouTube videos:", error)
    throw error
  }
}
