import { withPluginApi } from "discourse/lib/plugin-api";
import Rightbar from "../components/rightbar";

const pluginId = "clean2";

function makeTopicClickable(api) {
  /** @param {HTMLElement} elem  */
  function isTopicClick(elem) {
    if (!elem) {
      return false;
    }
    if (elem.classList.contains("topic-list-item-wrapper")) {
      return true;
    }
    const tagName = elem.tagName.toLowerCase();
    if (["img", "a", "body", "input"].includes(tagName)) {
      return false;
    }
    return isTopicClick(elem.parentNode);
  }
  api.modifyClass("component:topic-list-item", {
    pluginId,

    unhandledRowClick(e, topic) {
      if (!isTopicClick(e.target)) {
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

  initialize(container) {
    withPluginApi("1.6.0", (api) => {
      addClassWhenScroll(api);
      makeTopicClickable(api);
      const site = container.owner.lookup("service:site");

      if (site.desktopView) {
        api.renderInOutlet("before-main-outlet", Rightbar);
      }
    });
  },
};
