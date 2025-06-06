// --- Переменные для видео ---
const videoId = "hjNGszC1oDs";
const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
const videoTitle = "ZViT studio - intro";
const channelName = "ZViT studio";
const channelUrl = "/@ZViT_studio";
const channelAvatar =
  "https://yt3.googleusercontent.com/0hA_-TR2HgxlsGJj_VvVnDlpZPvwdHMbuXxz1twz5zGc7AwKagKYH-aSyioH3YYO1Jp6_-14dg=s68-c-k-c0x00ffffff-no-rj";
const previewUrl = `https://i.ytimg.com/vi/${videoId}/hq720.jpg`;
const views = "123K views";
const published = "1 day ago";
const duration = "1:05";
const verified = true;

function injectVideo() {
  // Для главной страницы YouTube
  const grid = document.querySelector("ytd-rich-grid-renderer #contents");
  if (grid && !document.getElementById("my-custom-video")) {
    const videoElement = document.createElement("ytd-rich-item-renderer");
    videoElement.id = "my-custom-video";
    videoElement.className = "style-scope ytd-rich-grid-renderer";
    videoElement.setAttribute("items-per-row", "3");
    videoElement.setAttribute("lockup", "true");
    videoElement.setAttribute("rendered-from-rich-grid", "");

    videoElement.innerHTML = `
  <div id="content" class="style-scope ytd-rich-item-renderer">
    <ytd-rich-grid-media class="style-scope ytd-rich-item-renderer" lockup="true">
      <div id="dismissible" class="style-scope ytd-rich-grid-media">
        <div id="thumbnail" class="style-scope ytd-rich-grid-media">
          <ytd-thumbnail rich-grid-thumbnail="" use-hovered-property="" width="9999" class="style-scope ytd-rich-grid-media" size="large" loaded="">
            <a id="thumbnail" class="yt-simple-endpoint inline-block style-scope ytd-thumbnail" aria-hidden="true" tabindex="-1" rel="null" href="${videoUrl}">
              <yt-image alt="" ftl-eligible="" notify-on-loaded="" notify-on-unloaded="" class="style-scope ytd-thumbnail">
                <img alt="" class="yt-core-image yt-core-image--fill-parent-height yt-core-image--fill-parent-width yt-core-image--content-mode-scale-aspect-fill yt-core-image--loaded" style="background-color: transparent;" src="${previewUrl}">
              </yt-image>
              <div id="overlays" class="style-scope ytd-thumbnail">
                <ytd-thumbnail-overlay-time-status-renderer class="style-scope ytd-thumbnail" hide-time-status="" overlay-style="DEFAULT">
                  <div class="thumbnail-overlay-badge-shape style-scope ytd-thumbnail-overlay-time-status-renderer">
                    <badge-shape class="badge-shape-wiz badge-shape-wiz--thumbnail-default badge-shape-wiz--thumbnail-badge" role="img" aria-label="${duration}">
                      <div class="badge-shape-wiz__text">${duration}</div>
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
            <a id="avatar-link" class="yt-simple-endpoint style-scope ytd-rich-grid-media" tabindex="-1" title="${channelName}" href="${channelUrl}">
              <yt-img-shadow id="avatar-image" width="48" class="style-scope ytd-rich-grid-media no-transition" style="background-color: transparent;">
                <img id="img" draggable="false" class="style-scope yt-img-shadow yt-core-image yt-spec-avatar-shape__image yt-core-image--fill-parent-height yt-core-image--fill-parent-width yt-core-image--content-mode-scale-to-fill yt-core-image--loaded" alt="" width="48" src="${channelAvatar}">
              </yt-img-shadow>
            </a>
          </div>
          <div id="meta" class="style-scope ytd-rich-grid-media">
            <h3 class="style-scope ytd-rich-grid-media">
              <a id="video-title-link"
                class="yt-simple-endpoint focus-on-expand style-scope ytd-rich-grid-media"
                aria-label="${videoTitle}"
                title="${videoTitle}"
                href="${videoUrl}">
                <span class="style-scope ytd-rich-grid-media" style="font-size:16px; font-weight:500; line-height:20px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
                  ${videoTitle}
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
                           href="${channelUrl}"
                           style="display: inline-flex; align-items: center; color: inherit; text-decoration: none;">
                          <span class="style-scope ytd-channel-name">${channelName}</span>
                          ${
                            verified
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
                  <span class="inline-metadata-item style-scope ytd-video-meta-block">${views}</span>
                  <span class="inline-metadata-item style-scope ytd-video-meta-block">${published}</span>
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
                        <path d="M12 16.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zM10.5 12c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5zm0-6c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5z"></path>
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
    `;
    grid.insertBefore(videoElement, grid.firstChild);
  }
}

setInterval(injectVideo, 2000);
