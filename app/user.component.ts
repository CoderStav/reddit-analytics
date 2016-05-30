import { Component, OnInit } from "angular2/core";
import { RedditService } from "./reddit.service";
import { RouteParams } from "angular2/router";
import { UserObject } from "./user-object";

@Component({
  selector : "reddit-user",
  template : `
  <div>
    <span>Top words:</span>
    <span *ngFor="#word of UserData.topWords()">
      {{word.key}},
    </span>
  </div>
  <hr/>
  <div>
    <span>Top subreddits:</span>
    <span *ngFor="#sub of UserData.topSubs()">
      <a href="{{sub.key}}">{{sub.key}}</a>
    </span>
  </div>
  <h1>User Breakdown: {{User}}</h1><br/>
  <div>
    <div *ngFor="#comment of UserData.comments()">
      <a href="{{comment.data.link_url}}" target="_blank">{{comment.data.link_title}}</a>
      <br/>
      {{comment.data.body}}
      <hr/>
    </div>
    <div *ngIf="UserData.nextId() != null">
      <button (click)="getUserComments(User, NextId)">Load more comments</button>
    </div>
  </div>
  `
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
