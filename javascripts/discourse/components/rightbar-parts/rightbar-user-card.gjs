import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { service } from "@ember/service";
import { htmlSafe } from "@ember/template";
import DButton from "discourse/components/d-button";
import { renderAvatar } from "discourse/helpers/user-avatar";
import { ajax } from "discourse/lib/ajax";
import DiscourseURL from "discourse/lib/url";
import { getURLWithCDN } from "discourse-common/lib/get-url";

let userCache = undefined;

export default class RightbarUserCard extends Component {
  @service currentUser;
  @tracked user = this.currentUser;

  constructor(...args) {
    super(...args);
    if (userCache) {
      this.user = userCache;
    } else {
      ajax("/u/" + this.user.username + ".json").then((res) => {
        this.user = Object.assign({}, res.user, this.user);
        userCache = this.user;
      });
    }
  }

  get summaryUrl() {
    return `/u/${this.user.username}`;
  }

  get profileBackgroundUrl() {
    return this.user.profile_background_upload_url
      ? getURLWithCDN(this.user.profile_background_upload_url)
      : undefined;
  }

  @action
  routeToSettings() {
    DiscourseURL.routeTo(`${this.summaryUrl}/preferences/profile`);
  }

  <template>
    <div class="rightbar-user-card">
      <div class="user-card-wrapper">
        {{#if this.profileBackgroundUrl}}
          <div
            class="user-banner has-banner"
            style="background-image: url({{this.profileBackgroundUrl}})"
          >
          </div>
        {{else}}
          <div class="user-banner no-banner">
            {{htmlSafe (renderAvatar this.user)}}
          </div>
        {{/if}}
        <div class="user-card-content">
          <div class="user-avatar">
            <a href="{{this.summaryUrl}}">
              {{htmlSafe (renderAvatar this.user)}}
            </a>
          </div>
          <div class="user-meta">
            <div class="user-display-name">
              <a href="{{this.summaryUrl}}">
                {{#if this.user.name}}
                  {{this.user.name}}
                {{else}}
                  @{{this.user.username}}
                {{/if}}
              </a>
            </div>
            {{#if this.user.name}}
              <div class="user-username">
                <a href="{{this.summaryUrl}}">
                  @{{this.user.username}}
                </a>
              </div>
            {{/if}}
            <div class="user-title">
              {{this.user.title}}
            </div>
          </div>
          <div class="user-bio">
            {{htmlSafe this.user.bio_excerpt}}
          </div>
          <div class="user-action">
            <DButton
              @class="user-settings"
              @icon="cog"
              @title={{themePrefix "rightbar-user-card.edit-profile"}}
              @action={{this.routeToSettings}}
            />
          </div>
        </div>
      </div>
    </div>
  </template>
}
