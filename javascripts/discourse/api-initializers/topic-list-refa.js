import { apiInitializer } from "discourse/lib/api";

export default apiInitializer((api) => {
  window.api = api;
});
