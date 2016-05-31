export class AssociativeArray {

  private _length : number = 0;

  length(){
    return this._length;
  }

  push(key : string, val : number){
    if(key != "_length"){
      this[key] = val;
      this._length += 1;
    }
  }

  addToKey(key : string, val : number){
    if(key != "_length"){
      this[key] += val;
    }
  }

  forEach(){
    let arr : string[] = [];
    for(let key in this)
      if(key != "_length")
        arr.push(key);
    return arr;
  }

  copy(){
    let that : AssociativeArray = new AssociativeArray();
    for(let key in this){
      that[key] = this[key];
    }
    return that;
  }

  inOrder(amount : number, arr : any[] = [], that : AssociativeArray = this.copy()) : Object[]{
    let numbersRemain : boolean = false;
    let largestKey : string, largestVal : number;

    for(let key in that){
      let val = that[key];
      if(typeof val == "number" && key != "_length"){
        numbersRemain = true;
        if(!(largestKey && largestVal) || largestVal < val){
          largestKey = key;
          largestVal = val;
        }
      }
    }

    if(numbersRemain && amount > 0){
      arr.push({key:largestKey, val:largestVal});
      that[largestKey] = undefined;
      return this.inOrder(--amount, arr, that);
    }

    return arr;
  }

}
