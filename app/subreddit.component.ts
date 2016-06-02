import { Component, OnInit } from "angular2/core";
import { RedditService } from "./reddit.service";
import { RouteParams } from "angular2/router";
import { SubredditObject } from "./subreddit-object";

@Component({
  selector : "reddit-subreddit",
  templateUrl: "templates/subreddit.component.html",
  styleUrls: ['stylesheets/app.css'],
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
