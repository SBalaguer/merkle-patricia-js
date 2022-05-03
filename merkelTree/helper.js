// This will allow us to create a hashing helper function

const crypto = require('crypto');

const hasher = function(data){
    if(data){
        return crypto.createHash("sha256").update(data.toString()).digest('hex');
    }else{
        return ""
    }
}

module.exports = hasher;