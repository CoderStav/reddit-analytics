import { RedditService } from "./reddit.service";
import { UserObject } from "./user-object";
import { AssociativeArray } from "./associative-array";
import "rxjs/add/operator/toPromise";

export class SubredditObject {

  Posts : Object[] = [];
  Users : UserObject[] = [];
  RelatedSubs : AssociativeArray = new AssociativeArray();
  NextId : string;

  constructor(private Subreddit : string, private _redditService : RedditService) { }

  posts(){
    return this.Posts;
  }

  users(){
    return this.Users;
  }

  relatedSubs(){
    return this.RelatedSubs.inOrder(10);
  }

  fetchData(){
    this._getSubPosts()
      .then((res) => {
        let subPosts = res.data.children;
        this.Posts = this.Posts.concat(subPosts);

        let usernames : String[] = [];
        for(let i = 0; i < subPosts.length; ++i){
          let authorName = subPosts[i]["data"]["author"];
          let user = new UserObject(authorName, this._redditService);
          if(usernames.indexOf(authorName) == -1){
            this.Users.push(user);
            usernames.push(user.username());
            user.fetchData();
          }
        }
      })
      .then(() => setTimeout(() => this._getRelatedSubs(), 3000));
  }

  _getRelatedSubs(){
    let aggregatedUserSubs : Object[] = [];
    let newSubCount : AssociativeArray = new AssociativeArray();

    for(let i = 0; i < this.Users.length; ++i){
      let userSubs = this.Users[i].topSubs();
      aggregatedUserSubs = aggregatedUserSubs.concat(userSubs);
    }

    for(let i = 0; i < aggregatedUserSubs.length; ++i){
      let sub = aggregatedUserSubs[i];
      newSubCount[sub["key"]] ? newSubCount.addToKey(sub["key"], 1)
        : newSubCount.push(sub["key"], 1);
    }

    this.RelatedSubs = newSubCount;
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
