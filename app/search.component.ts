import { Component, OnInit } from "angular2/core";
import { RedditService } from "./reddit.service";
import { Router } from "angular2/router";

@Component({
  selector : "reddit-search",
  templateUrl: "templates/search.component.html",
  styleUrls: ['stylesheets/app.css'],
})

export class SearchComponent implements OnInit {

  constructor(private _router : Router, private _redditService : RedditService) { }

  ngOnInit(){ }

  search(data : any){
    const values = data.form._value;
    this._router.navigateByUrl(values.name);
  }

}
