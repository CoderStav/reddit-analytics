import { RedditService } from "./reddit.service";
import { UserObject } from "./user-object";
import "rxjs/add/operator/toPromise";

export class SubredditObject {

  Posts : Object[] = [];
  Users : UserObject[] = [];
  RelatedSubs : Object[] = [];
  NextId : string;

  constructor(private Subreddit : string, private _redditService : RedditService) {  }

  posts(){
    return this.Posts;
  }

  users(){
    return this.Users;
  }

  relatedSubs(){
    return this.RelatedSubs;
  }

  fetchData(){
    this._getSubPosts()
      .then((res) => {
        let subPosts = res.data.children;
        this.Posts = this.Posts.concat(subPosts);

        for(let i = 0; i < subPosts.length; ++i){
          let authorName = subPosts[i]["data"]["author"];
          let user = new UserObject(authorName, this._redditService);
          this.Users.push(user);
          user.fetchData();
        }
      })
      .then(() => setTimeout(() => this._getRelatedSubs(), 5000));
  }

  _getRelatedSubs(){
    for(let i = 0; i < this.Users.length; ++i){
      let userSubs = this.Users[i].topSubs();
      this.RelatedSubs = this.RelatedSubs.concat(userSubs);
    }
    console.log(this.RelatedSubs);
  }

  _getSubPosts(start_id : string = undefined){
    return this._redditService.getSub(this.Subreddit, start_id).toPromise();
      /*.subscribe(
        posts => {
          this.Posts = this.Posts.concat(posts.data.children);
          this.NextId = posts.data.after;
        },
        err => console.error("Error: " + err),
        () => console.log("Posts retrieved for " + this.Subreddit + " successfully!")
      );*/
  }

}
