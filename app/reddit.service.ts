import { Injectable } from "angular2/core";
import { Http, Headers, URLSearchParams } from "angular2/http";
import "rxjs/add/operator/map";

import { COMMENTS } from "./mock-user-comments";

const API_ENDPOINT = "http://api.reddit.com";

@Injectable()
export class RedditService {
  constructor(private _http : Http) { }

  getUser(username : string, start_id : string) {
    let endpoint = API_ENDPOINT + "/user/" + username + "/comments?limit=100"
                    + ((start_id != undefined) ? ("&after=" + start_id) : "");
    return this._http.get(endpoint)
      .map(res => res.json());
    /* Mock request /* return Promise.resolve(COMMENTS)
      .then(result => result);*/
  }

  getSub(subname : string, start_id : string){
    let endpoint = API_ENDPOINT + "/r/" + subname + "?limit=100"
                    + ((start_id != undefined) ? ("&after=" + start_id) : "");
    return this._http.get(endpoint)
      .map(res => res.json());
  }

  getSubData(sub_fullname : string){
    let endpoint = "https://www.reddit.com/api/info.json?id=" + sub_fullname;
    return this._http.get(endpoint)
      .map(res => res.json());
  }
}
