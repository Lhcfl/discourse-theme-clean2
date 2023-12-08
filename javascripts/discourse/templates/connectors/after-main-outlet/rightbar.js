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
        if (!api.getCurrentUser()) {
          component.set("user", {
            isSiteUser: true,
            summary_url: "/about",
            profile_background_upload_url:
              settings.rightbar_site_background_url || undefined,
            name: this.siteSettings.title,
            username: this.siteSettings.title,
            avatar_template: this.siteSettings.logo_small,
            bio_cooked: settings.rightbar_site_desctiption,
          });
        } else {
          component.set("user", api.getCurrentUser());

          let username = component.get("currentUser.username");

          ajax("/u/" + username + ".json").then((res) => {
            addRequiredUserInfo(res.user);

            component.set("user", res.user);
          });
        }
      });
    }
  },
};
