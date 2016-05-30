import { Component, OnInit } from "angular2/core";
import { RedditService } from "./reddit.service";
import { RouteParams } from "angular2/router";
import { SubredditObject } from "./subreddit-object";

@Component({
  selector : "reddit-subreddit",
  template : `
  <div>
    <span>Recent Users:</span>
    <span *ngFor="#user of SubObject.users()">
      <a href="/u/{{user.User}}">{{user.User}}</a>,
    </span>
  </div>
  <div>
    <span>Related Subs:</span>
    <span *ngFor="#sub of SubObject.relatedSubs()">
      <a href="{{sub.key}}">{{sub.key}} : {{sub.val}}</a>,
    </span>
  </div>
  <hr/>
  <h1>Subreddit Breakdown: {{Subreddit}}</h1>
  <div>
    <div *ngFor="#post of SubObject.posts()">
      <a href="http://reddit.com{{post.data.permalink}}" target="_blank">{{post.data.title}}</a>
      <hr/>
    </div>
    <div *ngIf="NextId != undefined">
      <button (click)="getSubPosts(Subreddit)">Load More Posts</button>
    </div>
  </div>
  `
})

export class SubredditComponent implements OnInit {

  Subreddit : string;
  SubObject : SubredditObject;

  constructor(private _routerParams : RouteParams,
              private _redditService : RedditService) { }

  ngOnInit(){
    this.Subreddit = this._routerParams.get("id");
    this.SubObject = new SubredditObject(this.Subreddit, this._redditService);
    this.SubObject.fetchData();
  }

}
