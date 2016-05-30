export class AssociativeArray {

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
      if(typeof val == "number"){
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
