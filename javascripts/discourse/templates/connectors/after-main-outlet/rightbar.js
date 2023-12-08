import { ajax } from "discourse/lib/ajax";
import { withPluginApi } from "discourse/lib/plugin-api";
import { getURLWithCDN } from "discourse-common/lib/get-url";

function addRequiredUserInfo(user) {
  user.summary_url = `/u/${user.username}`;
  user.profile_background_upload_url = user.profile_background_upload_url
    ? getURLWithCDN(user.profile_background_upload_url)
    : undefined;
}

export default {
  setupComponent(attrs, component) {
    if (!this.site.mobileView) {
      withPluginApi("0.8.7", (api) => {
        // script wont run unless user is logged in
        if (api.getCurrentUser() === null) {
          return false;
        }

        component.set("user", api.getCurrentUser());

        let username = component.get("currentUser.username");

        ajax("/u/" + username + ".json").then((res) => {
          addRequiredUserInfo(res.user);

          component.set("user", res.user);
        });
      });
    }
  },
};
