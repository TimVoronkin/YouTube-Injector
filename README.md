# YouTube Injector  <img src="icon/icon48.png" alt="icon" width="32" height="32" style="vertical-align:middle;"/>

**YouTube Injector** is a Chrome extension that injects your custom videos into the YouTube home page feed. You can specify which videos to insert by editing a simple text file.

## Features

- Injects one or more custom videos into the YouTube home page feed.
- Fetches video and channel info using the YouTube Data API.
- Easy configuration via text file.

## Installation

1. **Clone or Download the Repository**

   Download or clone this repository to your computer.

2. **Get a YouTube Data API Key**

   - Go to the [Google Cloud Console](https://console.cloud.google.com/).
   - Create a new project (if you don't have one).
   - Enable the "YouTube Data API v3" for your project.
   - Create an API key.
   - Copy your API key.

3. **Configure the Extension**

   - In `src` folder create `apiKey.txt` and paste your API key inside (the file should contain only the key, no extra spaces or lines).
   - Open `videos-to-insert.txt` and add one YouTube video ID or link per line.
     
4. **Load the Extension in Chrome**

   - Open Chrome and go to `chrome://extensions/`.
   - Enable "Developer mode" (top right).
   - Click "Load unpacked".
   - Select the project folder.

5. **Usage**

   - Go to [YouTube](https://www.youtube.com/).
   - Your specified videos will appear in the home page feed.

## Notes

- The extension only works on the YouTube home page.
- Your API key is stored locally and never sent anywhere except to the YouTube Data API.
- Videos are inserted in random order in the first 15 positions in the feed.

---

By Tim Voronkin
