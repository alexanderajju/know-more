const {
  userCollection,
  postCollection
} = require("../config/collections");
const db = require("../config/connection");
const Promise = require("promise");
const ObjectId = require("mongodb").ObjectId;
const bcrypt = require("bcrypt");

module.exports = {
    doAdminLogIn: (data) => {
    // console.log("..............", data);
    return new Promise(async (resolve, reject) => {
      let resposnse = {};
      let user = await db
        .get()
        .collection(userCollection)
        .findOne({ username: data.username });
        // console.log(user);
      if (user) {
        if (user.admin) {
          bcrypt.compare(data.password, user.password).then((status) => {
            if (status) {
              console.log("login Success");
              resposnse.username = user;
              resposnse.status = true;
              resolve(resposnse);
            } else {
              console.log("failed");
              resolve({ status: false });
            }
          });
        } else {
          console.log("login failed");
          resolve({ status: false });
        }
      } else {
        resolve({ status: false });
      }
    });
  },
addPost:(data)=>{
  return new Promise(async (resolve, reject) => {
// console.log(data)
db.get().collection(postCollection).insertOne(data).then((doc)=>{

  if(doc.ops[0]._id){
resolve(true)
  }else{
  resolve(false)
}
    
  

})
  })
},
getAllPost:(data)=>{
  return new Promise(async (resolve, reject) => {
    let posts = await db.get().collection(postCollection).find().toArray();
    // console.log(posts)
    resolve(posts)
  })
},
sortPost:(data)=>{
  // console.log(data[1],">>>>>>>>>>data")
  return new Promise(async (resolve, reject) => {
let posts = await db.get().collection(postCollection)  .aggregate([
          {
            $match: { gridRadios: data[1] },
          },
        ])
        .toArray();
      resolve(posts)


  })
},
getPost:(data)=>{
    return new Promise(async (resolve, reject) => {
let post = await db.get().collection(postCollection)  .aggregate([
          {
            $match: { _id: ObjectId(data) },
          },
        ])
        .toArray();
        // console.log(post)
      resolve(post)


  })

}
}
