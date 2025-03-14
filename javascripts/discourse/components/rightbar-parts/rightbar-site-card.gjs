import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { service } from "@ember/service";
import { htmlSafe } from "@ember/template";
import dIcon from "discourse/helpers/d-icon";
import { renderAvatar } from "discourse/helpers/user-avatar";
import { ajax } from "discourse/lib/ajax";
import DiscourseURL from "discourse/lib/url";

let aboutCache = null;

export default class RightbarSiteCard extends Component {
  @service siteSettings;
  @service site;

  @tracked about = {};

  constructor() {
    super(...arguments);
    if (aboutCache) {
      this.about = aboutCache.about;
    } else {
      ajax("/about.json").then((res) => {
        this.about = res.about;
        aboutCache = res;
      });
    }
  }

  @action
  routeToAbout() {
    DiscourseURL.routeTo(`${this.summaryUrl}/preferences/profile`);
  }

  get backgroundUrl() {
    return settings.rightbar_site_background_url || null;
  }

  get siteUser() {
    return {
      username: this.siteSettings.title,
      avatar_template: this.siteSettings.logo_small,
      name: this.siteSettings.title,
    };
  }

  get descriptionCooked() {
    return settings.rightbar_site_desctiption;
  }

  <template>
    <div class="rightbar-user-card">
      <div class="user-card-wrapper">
        {{#if this.backgroundUrl}}
          <div
            class="user-banner has-banner"
            style="background-image: url({{this.backgroundUrl}})"
          >
          </div>
        {{else}}
          <div class="user-banner no-banner">
            {{htmlSafe (renderAvatar this.siteUser)}}
          </div>
        {{/if}}
        <div class="user-card-content">
          <div class="user-avatar">
            <a href="{{this.summaryUrl}}">
              {{htmlSafe (renderAvatar this.siteUser)}}
            </a>
          </div>
          <div class="user-meta">
            <div class="user-display-name">
              <a href="{{this.summaryUrl}}">
                {{this.siteUser.name}}
              </a>
            </div>
            <div class="user-title">
              {{this.about.description}}
            </div>
          </div>
          <div class="user-bio">
            {{htmlSafe this.descriptionCooked}}
          </div>
          <div class="site-meta">
            {{#if this.about}}
              <span class="users-count">{{dIcon "users"}}
                {{this.about.stats.users_count}}</span>
              <span class="topics-count">{{dIcon "layer-group"}}
                {{this.about.stats.topics_count}}</span>
              <span class="posts-count">{{dIcon "comments"}}
                {{this.about.stats.posts_count}}</span>
            {{/if}}
          </div>
        </div>
      </div>
    </div>
  </template>
}
