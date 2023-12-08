import { withPluginApi } from "discourse/lib/plugin-api";

const pluginId = "clean2";

function makeTopicClickable(api) {
  api.modifyClass("component:topic-list-item", {
    pluginId,

    unhandledRowClick(e, topic) {
      if (e.target.tagName.toLowerCase() === "img") {
        return;
      }
      if (e.target.tagName.toLowerCase() === "a") {
        return;
      }
      this.navigateToTopic(
        topic,
        topic.linked_post_number
          ? topic.urlForPostNumber(topic.linked_post_number)
          : topic.get("lastUnreadUrl")
      );
    },
  });
}

function addClassWhenScroll(api) {
  const site = api.container.lookup("site:main");
  if (!site.mobileView) {
    return;
  }
  let scrollTop = window.scrollY;
  const body = document.body;
  const scrollMax = 0;
  let lastScrollTop = 0;
  const hiddenNavClass = "nav-controls-hidden";

  const add_class_on_scroll = () => body.classList.add(hiddenNavClass);
  const remove_class_on_scroll = () => body.classList.remove(hiddenNavClass);

  window.addEventListener("scroll", function () {
    scrollTop = window.scrollY;
    if (
      lastScrollTop < scrollTop &&
      scrollTop > scrollMax &&
      !body.classList.contains(hiddenNavClass)
    ) {
      add_class_on_scroll();
    } else if (
      lastScrollTop > scrollTop &&
      body.classList.contains(hiddenNavClass)
    ) {
      remove_class_on_scroll();
    }
    lastScrollTop = scrollTop;
  });
}

export default {
  name: "discourse-navigation-controls",

  initialize() {
    withPluginApi("0.8.13", (api) => {
      addClassWhenScroll(api);
      makeTopicClickable(api);
    });
  },
};
