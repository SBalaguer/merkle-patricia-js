const hasher = require("./helper");
const util = require("util");

class MerkelTree {
    constructor(){
        this.root = [];
    }

    createTree(transactionList){
        //this adds an array of all the transactions transactions to the root of the merkletree
        this.root.unshift(transactionList);
        //this adds an array of all the hashes at the beginning of the tree.
        this.root.unshift(transactionList.map(singleTransaction => singleTransaction.hash));
    
        while(this.root[0].length > 1){
            let merkleBranch = [];
            for (let i = 0; i< this.root[0].length; i+=2){
                //merkle branch represents each level of my merkleTree
                if(this.root[0][i+1]){
                    //this means that there is a possibility of getting a pair of txs.
                    const leafHash = hasher(this.root[0][i] + this.root[0][i+1])
                    merkleBranch.push(leafHash)
                } else{
                    const leafHash = hasher(this.root[0][i])
                    merkleBranch.push(leafHash)
                }
            }
            this.root.unshift(merkleBranch);
            console.log("merkel tree",this.root)
        }
    }

    verify(transaction){
        //the objective here is to get the position of a specific transaction the the txs list, and compute the merke tree from there.
        let position = this.root.slice(-1)[0].findIndex(t => t.hash == transaction.hash);
        console.log(position);
        if (position) {
      
          let verifyHash = transaction.getHash();
      
          for (let index = this.root.length - 2; index > 0; index--) {
      
            let neighbour = null;
            if (position % 2 == 0) {
              neighbour = this.root[index][position + 1];
              position = Math.floor((position) / 2)
              verifyHash = hasher(verifyHash + neighbour);
            }
            else {
              neighbour = this.root[index][position - 1];
              position = Math.floor((position - 1) / 2)
              verifyHash = hasher(neighbour + verifyHash);
            }
      
          }
          console.log(verifyHash == this.root[0][0] ? "Valid" : "Not Valid");
        }
        else {
          console.log("Data not found with the id");
      
        }
    }

}

module.exports = MerkelTree;