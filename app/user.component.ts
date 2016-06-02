import { Component, OnInit } from "angular2/core";
import { RedditService } from "./reddit.service";
import { RouteParams } from "angular2/router";
import { UserObject } from "./user-object";

@Component({
  selector : "reddit-user",
  templateUrl : "templates/user.component.html",
  styleUrls: ['stylesheets/app.css'],
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
