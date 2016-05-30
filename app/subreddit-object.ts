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
    /*let arr : Object[] = [];
    for(let key in this.RelatedSubs){
      let val = this.RelatedSubs[key];
      if(val > 10)
        arr.push({key : key});
    }
    return arr;*/
    return this.RelatedSubs.inOrder(10);
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
      .then(() => setTimeout(() => this._getRelatedSubs(), 1000));
  }

  _getRelatedSubs(){
    let aggregatedUserSubs : Object[] = [];
    let subCount1 : AssociativeArray = new AssociativeArray();
    let subCount2 : AssociativeArray = new AssociativeArray();

    for(let i = 0; i < this.Users.length; ++i){
      let userSubs = this.Users[i].topSubs();
      aggregatedUserSubs = aggregatedUserSubs.concat(userSubs);
    }

    for(let i = 0; i < aggregatedUserSubs.length; ++i){
      let sub = aggregatedUserSubs[i];
      subCount1[sub["key"]] ? subCount1[sub["key"]] += 1
        : subCount1[sub["key"]] = 1;
    }

    for(let key in subCount1){
      this._redditService.getSubData(key).toPromise()
        .then((res) => {
          if(res.data.children.length){
            let subName = res.data.children[0].data.url;
            subCount2[subName] = subCount1[key];
          }
        });
    }

    this.RelatedSubs = subCount2;
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
