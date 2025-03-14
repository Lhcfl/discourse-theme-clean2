import { apiInitializer } from "discourse/lib/api";
import Rightbar from "../components/rightbar";

function addClassWhenScroll(api) {
  const site = api.container.lookup("service:site");
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

  window.addEventListener("scroll", () => {
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

export default apiInitializer((api) => {
  addClassWhenScroll(api);
  const site = api.container.lookup("service:site");

  if (site.desktopView) {
    api.renderInOutlet("before-main-outlet", Rightbar);
  }
});
