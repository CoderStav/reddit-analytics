import { Component, OnInit } from "angular2/core";
import { RedditService } from "./reddit.service";
import { RouteParams } from "angular2/router";
import { UserObject } from "./user-object";

@Component({
  selector : "reddit-user",
  template : `
  <h1>User Breakdown: {{User}}</h1><br/>
  <div class="page-analytics">
    <h1>Analytics</h1>
    <br/>
    <div class="page-analytics-data">
      <span>Top words:</span>
      <span *ngFor="#word of UserData.topWords()">
        {{word.key}}: {{word.val}},
      </span>
      <hr/>
      <span>Unique words used: {{UserData.uniqueWords()}}</span>
    </div>
    <br/>
    <div class="page-analytics-data">
      <span>Favorite Subreddits:</span>
      <span *ngFor="#sub of UserData.topSubs()">
        <a href="{{sub.key}}">{{sub.key}}</a>
      </span>
    </div>
    <br/>
    <div class="page-analytics-data">
      Comment Rate: {{UserData.commentRate()}} comments per day
    </div>
  </div>
  <div class="page-posts-container">
    <h1>Content</h1>
    <br/>
    <div class="page-posts">
      <div *ngFor="#comment of UserData.comments()">
        <a href="{{comment.data.link_url}}" target="_blank">{{comment.data.link_title}}</a>
        <br/>
        {{comment.data.body}}
        <hr/>
      </div>
    </div>
  </div>
  `,
  styleUrls: ['app/app.component.css'],
})

export class UserComponent implements OnInit {

  User : string;
  UserData : UserObject;

  constructor(private _routeParams : RouteParams,
              private _redditService : RedditService) { }

  ngOnInit(){
    this.User = this._routeParams.get("id");
    this.UserData = new UserObject(this.User, this._redditService);
    this.UserData.fetchData();
  }

}
