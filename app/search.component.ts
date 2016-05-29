import { Component, OnInit } from "angular2/core";
import { RedditService } from "./reddit.service";
import { Router } from "angular2/router";

@Component({
  selector : "reddit-search",
  template : `
  <h1>Search Page</h1>
  <form #data="ngForm" (ngSubmit)="search(data)">
    <!--
    <label><input type="radio" name="search_type" ngControl="search_type" value=0 checked> Subreddit </label>
    <label><input type="radio" name="search_type" ngControl="search_type" value=1> User </label>
    <br/>
    -->
    <input ngControl="name" placeholder="user/subreddit name" type="text" value="test">
    <br/>
    <input type="submit">
  </form>
  `,
})

export class SearchComponent implements OnInit {

  constructor(private _router : Router, private _redditService : RedditService) { }

  ngOnInit(){ }

  search(data : any){
    const values = data.form._value;
    values.search_type = 0;
    this._router.navigateByUrl((values.search_type == 0 ? "/user/" : "/subreddit") + values.name);
  }

}
