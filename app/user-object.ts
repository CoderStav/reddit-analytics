import { RedditService } from "./reddit.service";
import { AssociativeArray } from "./associative-array";
import "rxjs/add/operator/toPromise";

export class UserObject {

  Comments : Object[] = [];
  NextId : string;

  AllText : string = "";
  WordCounts : AssociativeArray = new AssociativeArray();

  SubCounts : AssociativeArray = new AssociativeArray();

  Dates : number[] = [];

  Scores : number[] = [0];

  constructor(private User : string, private _redditService : RedditService) { }

  username(){
    return this.User;
  }

  comments(){
    return this.Comments;
  }

  nextId(){
    return this.nextId;
  }

  topWords(){
    return this.WordCounts.inOrder(50);
  }

  uniqueWords(){
    return this.WordCounts.length();
  }

  topSubs(){
    return this.SubCounts.inOrder(10);
  }

  commentRate(){
    return (this._calculateCommentRate()/60/60/24).toFixed(2);
  }

  averageCommentScore(){
    return this._calculateAvgCommentScore().toFixed(2);
  }

  fetchData(topWordsCount : number = 10, topSubsCount : number = 10){
    return this._getUserComments(this.User)
      .then((res) => {
        this.NextId = res.data.after;
        this.Comments = this.Comments.concat(res.data.children);

        for(var i = 0; i < this.Comments.length; ++i) {
          this._countSubreddit(this.Comments[i]["data"]["subreddit_id"]);
          this.AllText += this.Comments[i]["data"]["body"];
          this.Dates.push(this.Comments[i]["data"]["created"]);
          this.Scores.push(this.Comments[i]["data"]["score"]);
        }
      })
      .then(() => this._countWords())
      .then(() => {
        let newSubCounts = new AssociativeArray();
        let subCountsCopy = this.SubCounts.copy();
        let keys = this.SubCounts.forEach();

        for(let i = 1; i < keys.length; ++i){
          this._redditService.getSubData(keys[i])
            .toPromise().then((res) => {
              if(res.data.children.length){
                let subName = res.data.children[0].data.url;
                newSubCounts.push(subName, subCountsCopy[keys[i]]);
              }
            });
        }

        this.SubCounts = newSubCounts;
      })
      .catch((err) => console.log(err));
  }

  private _countWords(){
    var allWords : string[] = this.AllText.split(" ");
    this.WordCounts = new AssociativeArray();

    for(let i = 0; i < allWords.length; ++i){
      var word : string = allWords[i];
      this.WordCounts[word] && word.length > 3 ?
        this.WordCounts.addToKey(word, 1) : this.WordCounts.push(word, 1);
    }
  }

  private _countSubreddit(subreddit_fullname : string){
    this.SubCounts[subreddit_fullname] ?
      this.SubCounts.addToKey(subreddit_fullname, 1) : this.SubCounts.push(subreddit_fullname, 1)
  }

  private _calculateCommentRate(){
    var dateDiffs : number[] = [0];
    var avg : number;

    for(let i = 1; i < this.Dates.length; ++i)
      dateDiffs.push(this.Dates[i - 1] - this.Dates[i])

    return dateDiffs.reduce((prev, val) => prev + val)/dateDiffs.length;
  }

  private _calculateAvgCommentScore(){
    return this.Scores.reduce((prev, val) => prev + val)/this.Scores.length;
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
