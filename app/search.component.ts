import { Component, OnInit } from "angular2/core";
import { RedditService } from "./reddit.service";
import { Router } from "angular2/router";

@Component({
  selector : "reddit-search",
  template : `
  <div class="search-form">
    <h1>Reddit Analytics Search</h1><br/>
    <form #data="ngForm" (ngSubmit)="search(data)">
      <input ngControl="name" placeholder="user/subreddit name" type="text" value="test">
      <input type="submit">
    </form>
  </div>
  `,
  styleUrls: ['app/app.component.css'],
})

export class SearchComponent implements OnInit {

  constructor(private _router : Router, private _redditService : RedditService) { }

  ngOnInit(){ }

  search(data : any){
    const values = data.form._value;
    values.search_type = 0;
    this._router.navigateByUrl("/u/" + values.name);
  }

}
