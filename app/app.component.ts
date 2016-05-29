import { Component, enableProdMode } from 'angular2/core';
import { Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router';
import { HTTP_PROVIDERS } from "angular2/http";

import { SearchComponent } from "./search.component";
import { SubredditComponent } from "./subreddit.component";
import { UserComponent } from "./user.component";
import { RedditService } from "./reddit.service";

@Component({
  selector: 'reddit-analytics',
  template: `
    <button style="background:none;border:none;" (click)="goHome()"><h1>{{title}}</h1></button>
    <nav>
    </nav>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['app/app.component.css'],
  directives: [ROUTER_DIRECTIVES],
  providers: [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    RedditService
  ]
})
@RouteConfig([
  {
    path : "/search",
    name : "Search",
    component : SearchComponent,
    useAsDefault : true
  },
  {
    path : "/r/:id",
    name : "Subreddit Breakdown",
    component : SubredditComponent
  },
  {
    path : "/u/:id",
    name : "User Breakdown",
    component : UserComponent
  }
])
export class AppComponent {
  title = 'Reddit Analytics';

  constructor(private _router : Router) { }

  goHome(){
    this._router.navigateByUrl("/");
  }

}

enableProdMode();
