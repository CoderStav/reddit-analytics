import { RedditService } from "./reddit.service";
import "rxjs/add/operator/toPromise";

export class UserObject {

  Comments : Object[] = [];
  NextId : string;

  AllText : string = "";
  AllWordCounts : Object = {};
  TopWords : Object[] = [];

  AllSubCounts : Object = {};
  TopSubs : Object[] = [];

  constructor(private User : string, private _redditService : RedditService) { }

  comments(){
    return this.Comments;
  }

  nextId(){
    return this.nextId;
  }

  topWords(){
    return this.TopWords;
  }

  topSubs(){
    return this.TopSubs;
  }

  fetchData(topWordsCount : number = 10, topSubsCount : number = 10){
    return this._getUserComments(this.User)
      .then((res) => {
        this.NextId = res.data.after;
        this.Comments = this.Comments.concat(res.data.children);

        for(var i = 0; i < this.Comments.length; ++i) {
          this._countSubreddit(this.Comments[i]["data"]["subreddit_id"]);
          this.AllText += this.Comments[i]["data"]["body"];
        }
      })
      .then(() => this._countWords())
      .then(() => this._topWords(topWordsCount))
      .then(() => this._topSubs(topSubsCount))
      .then(() => this._convertTopSubFullnames());
  }

  private _countWords(){
    var allWords : string[] = this.AllText.split(" ");
    this.AllWordCounts = {};

    for(var i = 0; i < allWords.length; ++i){
      var word : string = allWords[i];
      this.AllWordCounts[word] && word.length > 3 ?
        this.AllWordCounts[word] += 1 : this.AllWordCounts[word] = 1;
    }
  }

  private _countSubreddit(subreddit_fullname : string){
    this.AllSubCounts[subreddit_fullname] ?
      this.AllSubCounts[subreddit_fullname] += 1 : this.AllSubCounts[subreddit_fullname] = 1;
    /*this._redditService.getSubData(subreddit_fullname)
      .toPromise().then((res) => {
        let subName = res.data.children[0].data.url;
        this.AllSubCounts[subName] ?
          this.AllSubCounts[subName] += 1 : this.AllSubCounts[subName] = 1;
      });
      /*.subscribe(
        subData => {
          let subName = subData.data.children[0].data.url;
          this.AllSubCounts[subName] ?
            this.AllSubCounts[subName] += 1 : this.AllSubCounts[subName] = 1;
        },
        error => console.log(error),
        () => console.log("Name for %s retrieved!", subreddit_fullname)
      );*/
  }

  private _convertTopSubFullnames(){
    let sub : Object, size : number;
    let newTopSubs : Object[] = [];

    for(let i = 0; i < this.TopSubs.length-1; ++i){
      sub = this.TopSubs[i];
      this._redditService.getSubData(sub["key"])
        .toPromise().then((res) => {
          if(res.data.children.length){
            let subName = res.data.children[0].data.url;
            newTopSubs.push({key:subName});
          }
        });
    }

    this.TopSubs = newTopSubs;
  }

  private _topWords(iteration : number, wordCount : Object = this.AllWordCounts) : any {
    if(iteration < 0) return;

    let largestWordCount : Object = {key:undefined, size:0}
    let key : string, size : number;

    for(key in wordCount){
      size = wordCount[key];
      if(largestWordCount["size"] < size){
        largestWordCount["key"] = key;
        largestWordCount["size"] = size;
      }
    }

    this.TopWords.push(largestWordCount);
    wordCount[largestWordCount["key"]] = 0;
    return this._topWords(--iteration, wordCount);
  }

  private _topSubs(iteration : number, subCount : Object = this.AllSubCounts) : any {
    if(iteration < 0) return;

    let largestSubCount : Object = {key:undefined, size:0};
    let key : string, size : number;

    for(key in subCount){
      size = subCount[key];
      if(largestSubCount["size"] < size){
        largestSubCount["key"] = key;
        largestSubCount["size"] = size;
      }
    }

    this.TopSubs.push(largestSubCount);
    subCount[largestSubCount["key"]] = 0;
    return this._topSubs(--iteration, subCount);
  }

  private _getUserComments(username : string, start_id : string = undefined){
    return this._redditService.getUser(username, start_id).toPromise();
      /*.subscribe(
        comments => {
          this.NextId = comments.data.after;
          this.Comments = this.Comments.concat(comments.data.children);
          for(var i = 0; i < this.Comments.length; ++i) {
            this._getSubredditName(this.Comments[i]["data"]["subreddit_id"]);
            this.AllText += this.Comments[i]["data"]["body"];
          }
        },
        error => console.error("Error: " + error),
        () => console.log("Comments for " + username + " retrieved!")
      );*/
  }

}
