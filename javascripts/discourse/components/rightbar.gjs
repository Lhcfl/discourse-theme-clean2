import Component from "@glimmer/component";
import { service } from "@ember/service";
import RightbarSiteCard from "./rightbar-parts/rightbar-site-card";
import RightbarUserCard from "./rightbar-parts/rightbar-user-card";

export default class Rightbar extends Component {
  @service site;
  @service currentUser;

  <template>
    <div class="rightbar-wrapper">
      {{#if this.currentUser}}
        <RightbarUserCard />
      {{else}}
        <RightbarSiteCard />
      {{/if}}
    </div>
  </template>
}
