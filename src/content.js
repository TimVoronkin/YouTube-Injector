// Настройки диапазона вставки видео
const minPos = 1;
const maxPos = 5;

// Дефолтные данные (если videoId пустой)
const defaultData = {
  videoId: "hjNGszC1oDs",
  videoUrl: `https://www.youtube.com/watch?v=hjNGszC1oDs`,
  videoTitle: "ZViT studio - intro",
  channelName: "ZViT studio",
  channelUrl: "/@ZViT_studio",
  channelAvatar:
    "https://yt3.googleusercontent.com/0hA_-TR2HgxlsGJj_VvVnDlpZPvwdHMbuXxz1twz5zGc7AwKagKYH-aSyioH3YYO1Jp6_-14dg=s68-c-k-c0x00ffffff-no-rj",
  previewUrl: `https://i.ytimg.com/vi/hjNGszC1oDs/hq720.jpg`,
  views: "123K views",
  published: "1 day ago",
  duration: "1:05",
  verified: true,
};

// Загружаем YouTube API ключ из файла
// В этом файле должен быть только ключ, без лишних символов и пробелов
function loadApiKey() {
  return new Promise((resolve, reject) => {
    if (window._yt_api_key_cache) return resolve(window._yt_api_key_cache);
    fetch(chrome.runtime.getURL("src/apiKey.txt"))
      .then((resp) => resp.text())
      .then((text) => {
        const key = text.trim();
        if (key) {
          window._yt_api_key_cache = key;
          resolve(key);
        } else {
          reject("API key not found in apiKey.txt");
        }
      })
      .catch(reject);
  });
}

// Функция для извлечения videoId из произвольной строки
function parseVideoId(str) {
  // Если это просто ID (11 символов, буквы/цифры/-, _)
  // dQw4w9WgXcQ
  if (/^[a-zA-Z0-9_-]{11}$/.test(str)) return str;
  // Ищем v=ID в ссылке
  // https://www.youtube.com/watch?v=dQw4w9WgXcQ
  const vMatch = str.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (vMatch) return vMatch[1];
  // Ищем короткую ссылку youtu.be/ID
  // https://youtu.be/dQw4w9WgXcQ
  const shortMatch = str.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];
  // Ищем youtube.com/watch/ID (без v=)
  // https://www.youtube.com/watch/dQw4w9WgXcQ
  const watchMatch = str.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];
  // Ищем youtube.com/embed/ID
  // https://www.youtube.com/embed/dQw4w9WgXcQ
  const embedMatch = str.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];
  // Если ничего не нашли, возвращаем пусто
  return '';
}

// Загружаем список видео которые нужно вставить
// В этом файле может быть ID или ссылка на видео, по одному на строку
async function loadVideoIds() {
  if (window._yt_video_ids_cache) return window._yt_video_ids_cache;
  const resp = await fetch(chrome.runtime.getURL("videos-to-insert.txt"));
  const text = await resp.text();
  const ids = text
    .split("\n")
    .map((line) => parseVideoId(line.trim()))
    .filter(Boolean);
  window._yt_video_ids_cache = ids;
  return ids;
}

// Получаем данные о видео и канале по ID
async function getVideoData(videoId) {
  const apiKey = await loadApiKey();
  if (!apiKey) {
    alert("YouTube API key не указан!");
    return null;
  }
  try {
    // Получаем данные о видео
    const videoResp = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apiKey}`
    );
    const videoJson = await videoResp.json();
    if (!videoJson.items || !videoJson.items.length) return null;
    const v = videoJson.items[0];
    // Получаем данные о канале
    const channelId = v.snippet.channelId;
    const channelResp = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`
    );
    const channelJson = await channelResp.json();
    const c = channelJson.items && channelJson.items[0];
    // Форматируем duration
    function parseDuration(iso) {
      const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      if (!match) return "";
      const h = match[1] ? match[1] + ":" : "";
      const m = match[2]
        ? (match[1] ? match[2].padStart(2, "0") : match[2]) + ":"
        : "0:";
      const s = match[3] ? match[3].padStart(2, "0") : "00";
      return h + m + s;
    }
    // Форматируем просмотры
    function formatViews(num) {
      if (!num) return "";
      if (num >= 1e9) return (num / 1e9).toFixed(1) + "B views";
      if (num >= 1e6) return (num / 1e6).toFixed(1) + "M views";
      if (num >= 1e3) return (num / 1e3).toFixed(1) + "K views";
      return num + " views";
    }
    // Форматируем дату публикации
    function formatDate(dateStr) {
      const date = new Date(dateStr);
      const now = new Date();
      const diff = (now - date) / 1000;
      if (diff < 60) return "just now";
      if (diff < 3600) return Math.floor(diff / 60) + " min ago";
      if (diff < 86400) return Math.floor(diff / 3600) + " hours ago";
      if (diff < 2592000) return Math.floor(diff / 86400) + " days ago";
      if (diff < 31536000) return Math.floor(diff / 2592000) + " months ago";
      return Math.floor(diff / 31536000) + " years ago";
    }
    return {
      videoId,
      videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
      videoTitle: v.snippet.title,
      channelName: v.snippet.channelTitle,
      channelUrl: `/channel/${channelId}`,
      channelAvatar: c ? c.snippet.thumbnails.default.url : "",
      previewUrl: v.snippet.thumbnails.high.url,
      views: formatViews(Number(v.statistics.viewCount)),
      published: formatDate(v.snippet.publishedAt),
      duration: parseDuration(v.contentDetails.duration),
      verified: c ? !!c.statistics.hiddenSubscriberCount : false,
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function injectVideo() {
  const grid = document.querySelector("ytd-rich-grid-renderer #contents");
  if (grid) {
    // Получаем videoIds из файла
    const videoIds = await loadVideoIds();

    // Удаляем ранее вставленные элементы
    videoIds.forEach((id, idx) => {
      const el = document.getElementById("my-custom-video-" + idx);
      if (el) el.remove();
    });

    //Сначала вставляем плейсхолдеры
    for (let idx = 0; idx < videoIds.length; idx++) {
      if (!document.getElementById("my-custom-video-" + idx)) {
        const placeholder = document.createElement("ytd-rich-item-renderer");
        placeholder.id = "my-custom-video-" + idx;
        placeholder.className =
          "style-scope ytd-rich-grid-renderer my-custom-placeholder";
        placeholder.setAttribute("items-per-row", "3");
        placeholder.setAttribute("lockup", "true");
        placeholder.setAttribute("rendered-from-rich-grid", "");
        placeholder.innerHTML = `
          <div style="height: 320px; background: transparent;"></div>
        `;
        // Вставляем на случайную позицию от minPos до maxPos (или в конец, если элементов меньше)
        const insertMax = Math.min(maxPos, grid.children.length);
        const insertPos = Math.floor(Math.random() * insertMax) + minPos;
        if (insertPos >= grid.children.length) {
          grid.appendChild(placeholder);
        } else {
          grid.insertBefore(placeholder, grid.children[insertPos]);
        }
      }
    }

    //Затем асинхронно наполняем плейсхолдеры контентом
    for (let idx = 0; idx < videoIds.length; idx++) {
      let videoData = defaultData;
      const id = videoIds[idx];
      if (id) {
        const fetched = await getVideoData(id);
        if (fetched) videoData = { ...defaultData, ...fetched };
      }
      const videoElement = document.createElement("div");
      videoElement.innerHTML = /* html */ `

  <div id="content" class="style-scope ytd-rich-item-renderer">
    <ytd-rich-grid-media class="style-scope ytd-rich-item-renderer" lockup="true">
      <div id="dismissible" class="style-scope ytd-rich-grid-media">
        <div id="thumbnail" class="style-scope ytd-rich-grid-media">
          <ytd-thumbnail rich-grid-thumbnail="" use-hovered-property="" width="9999" class="style-scope ytd-rich-grid-media" size="large" loaded="">
            <a id="thumbnail" class="yt-simple-endpoint inline-block style-scope ytd-thumbnail" aria-hidden="true" tabindex="-1" rel="null" href="${
              videoData.videoUrl
            }">
              <yt-image alt="" ftl-eligible="" notify-on-loaded="" notify-on-unloaded="" class="style-scope ytd-thumbnail">
                <img alt="" class="yt-core-image yt-core-image--fill-parent-height yt-core-image--fill-parent-width yt-core-image--content-mode-scale-aspect-fill yt-core-image--loaded" style="background-color: transparent;" src="${
                  videoData.previewUrl
                }">
              </yt-image>
              <div id="overlays" class="style-scope ytd-thumbnail">
                <ytd-thumbnail-overlay-time-status-renderer class="style-scope ytd-thumbnail" hide-time-status="" overlay-style="DEFAULT">
                  <div class="thumbnail-overlay-badge-shape style-scope ytd-thumbnail-overlay-time-status-renderer">
                    <badge-shape class="badge-shape-wiz badge-shape-wiz--thumbnail-default badge-shape-wiz--thumbnail-badge" role="img" aria-label="${
                      videoData.duration
                    }">
                      <div class="badge-shape-wiz__text">${
                        videoData.duration
                      }</div>
                    </badge-shape>
                  </div>
                </ytd-thumbnail-overlay-time-status-renderer>
              </div>
              <div id="mouseover-overlay" class="style-scope ytd-thumbnail"></div>
              <div id="hover-overlays" class="style-scope ytd-thumbnail"></div>
            </a>
          </ytd-thumbnail>
        </div>
        <div id="thumbnail-underlay" class="style-scope ytd-rich-grid-media" hidden=""></div>
        <div id="details" class="style-scope ytd-rich-grid-media">
          <div id="avatar-container" class="yt-simple-endpoint style-scope ytd-rich-grid-media">
            <a id="avatar-link" class="yt-simple-endpoint style-scope ytd-rich-grid-media" tabindex="-1" title="${
              videoData.channelName
            }" href="${videoData.channelUrl}">
              <yt-img-shadow id="avatar-image" width="48" class="style-scope ytd-rich-grid-media no-transition" style="background-color: transparent;">
                <img id="img" draggable="false" class="style-scope yt-img-shadow yt-core-image yt-spec-avatar-shape__image yt-core-image--fill-parent-height yt-core-image--fill-parent-width yt-core-image--content-mode-scale-to-fill yt-core-image--loaded" alt="" width="48" src="${
                  videoData.channelAvatar
                }">
              </yt-img-shadow>
            </a>
          </div>
          <div id="meta" class="style-scope ytd-rich-grid-media">
            <h3 class="style-scope ytd-rich-grid-media">
              <a id="video-title-link"
                class="yt-simple-endpoint focus-on-expand style-scope ytd-rich-grid-media"
                aria-label="${videoData.videoTitle}"
                title="${videoData.videoTitle}"
                href="${videoData.videoUrl}">
                <span class="style-scope ytd-rich-grid-media" style="font-size:16px; font-weight:500; line-height:20px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
                  ${videoData.videoTitle}
                </span>
              </a>     
            </h3>
            <ytd-video-meta-block class="grid style-scope ytd-rich-grid-media" rich-meta="" amsterdam-post-mvp="">
              <div id="metadata" class="style-scope ytd-video-meta-block">
                <div id="byline-container" class="style-scope ytd-video-meta-block">
                  <ytd-channel-name id="channel-name" class="style-scope ytd-video-meta-block">
                    <div id="container" class="style-scope ytd-channel-name">
                      <div id="text-container" class="style-scope ytd-channel-name">
                        <a class="yt-simple-endpoint style-scope ytd-channel-name"
                           spellcheck="false"
                           href="${videoData.channelUrl}"
                           style="display: inline-flex; align-items: center; color: inherit; text-decoration: none;">
                          <span class="style-scope ytd-channel-name">${
                            videoData.channelName
                          }</span>
                          ${
                            videoData.verified
                              ? `<span class="badge badge-style-type-verified style-scope ytd-badge-supported-renderer"
                                      aria-label="Verified" role="img"
                                      style="display:inline-flex;align-items:center;margin-left:4px;">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 24 24" width="16" focusable="false" aria-hidden="true" style="pointer-events: none; display: inline-block; width: 16px; height: 16px;">
                                      <path fill="#aaa" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zM9.8 17.3l-4.2-4.1L7 11.8l2.8 2.7L17 7.4l1.4 1.4-8.6 8.5z"></path>
                                    </svg>
                                 </span>`
                              : ""
                          }
                        </a>
                      </div>
                    </div>
                  </ytd-channel-name>
                  <div id="separator" class="style-scope ytd-video-meta-block">•</div>
                </div>
                <div id="metadata-line" class="style-scope ytd-video-meta-block">
                  <span class="inline-metadata-item style-scope ytd-video-meta-block">${
                    videoData.views
                  }</span>
                  <span class="inline-metadata-item style-scope ytd-video-meta-block">${
                    videoData.published
                  }</span>
                </div>
              </div>
              <div id="additional-metadata-line" class="style-scope ytd-video-meta-block"></div>
            </ytd-video-meta-block>
          </div>
          <div id="buttons" class="style-scope ytd-rich-grid-media"></div>
        </div>
        <div id="menu" class="style-scope ytd-rich-grid-media">
          <ytd-menu-renderer class="style-scope ytd-rich-grid-media" safe-area="" menu-active="">
            <div id="top-level-buttons-computed" class="top-level-buttons style-scope ytd-menu-renderer"></div>
            <div id="flexible-item-buttons" class="style-scope ytd-menu-renderer"></div>
            <yt-icon-button id="button" class="dropdown-trigger style-scope ytd-menu-renderer" style-target="button">
              <button id="button" class="style-scope yt-icon-button" aria-label="Action menu">
                <yt-icon class="style-scope ytd-menu-renderer">
                  <span class="yt-icon-shape style-scope yt-icon yt-spec-icon-shape">
                    <div style="width: 100%; height: 100%; display: block; fill: currentcolor;">
                      <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;">
                        <path d="M12 16.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm0-6c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5z"></path>
                      </svg>
                    </div>
                  </span>
                </yt-icon>
              </button>
            </yt-icon-button>
          </ytd-menu-renderer>
        </div>
        <div id="immediate-load-menu" class="style-scope ytd-rich-grid-media"></div>
      </div>
      <div id="attached-survey" class="style-scope ytd-rich-grid-media"></div>
    </div>
    <yt-interaction id="interaction" class="extended style-scope ytd-rich-grid-media">
      <div class="stroke style-scope yt-interaction"></div>
      <div class="fill style-scope yt-interaction"></div>
    </yt-interaction>
  </ytd-rich-grid-media>
</div>
<yt-interaction id="interaction" class="extended rounded-large style-scope ytd-rich-item-renderer" hidden="">
  <div class="stroke style-scope yt-interaction"></div>
  <div class="fill style-scope yt-interaction"></div>
</yt-interaction>

      `.replaceAll("my-custom-video", "my-custom-video-" + idx);
      // Находим плейсхолдер и заменяем его содержимое
      const placeholder = document.getElementById("my-custom-video-" + idx);
      if (placeholder) {
        placeholder.innerHTML = videoElement.innerHTML;
        placeholder.classList.remove("my-custom-placeholder");
      }
    }
  }
}

// Добавляем стили для изменения цвета названия канала при наведении
if (!document.getElementById("my-channel-link-style")) {
  const style = document.createElement("style");
  style.id = "my-channel-link-style";
  style.textContent = `
    a.yt-simple-endpoint.style-scope.ytd-channel-name:hover span.style-scope.ytd-channel-name {
      color: #f1f1f1 !important;
    }
  `;
  document.head.appendChild(style);
}

// Ждем появления grid и запускаем injectVideo
function waitForGridAndInject() {
  const grid = document.querySelector("ytd-rich-grid-renderer #contents");
  if (grid) {
    injectVideo();
  } else {
    setTimeout(waitForGridAndInject, 300); // Проверяем каждые 300мс до появления grid
  }
}

// Запускаем проверку сразу
waitForGridAndInject();
