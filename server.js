const express = require('express');
const {buildSchema} = require('graphql');
const {graphqlHTTP}  = require('express-graphql');
const axios = require('axios')
const app = express()

let message = "I love you"


const schema = buildSchema(`
    type User{
        name:String,
        age: Int,
        college:String,
    }
    type Post{
        userId: Int,
        id    : Int,
        title : String,
        body  : String,
    },
    type Query{
        hello:String,
        numerals: [Int],
        welcomeMessage(name: String, dayOfWeek:String! ): String,
        getUser: User,
        getUsers: [User],
        getPosts: [Post],
        message : String,
    },

    type Mutation{
        setMessage(newMessage: String): String,
        createUser(name:String,age:Int,college:String): User
    }
`);


const root = {
    hello: ()=>{
        return "Hello World"
    },
    numerals: ()=>{
        return [1,2,3,4,5,]
    },
    welcomeMessage: (args)=>{
        return `Hello ${args.name} it is  ${args.dayOfWeek}`;
    },
    getUser : ()=>{
        let user = {
            name:"Peter",
            age:18,
            college:"UG"
        }
        return user
    },
    getUsers : ()=>{
        let users =[
            {
                name:"Peter",
                age:18,
                college:"UG"
            },    {
                name:"JOHN",
                age:18,
                college:"UG"
            },
            {
                name:"Jeremy",
                age:18,
                college:"Ucla"
            },
        ]
        return users
    },
    getPosts : async ()=>{
        return await axios.get("https://jsonplaceholder.typicode.com/posts")
        .then(function (response) {
            return response.data;
          })
          .catch(function(error){
            console.log(error)
          })
    },
    setMessage : function(args){
        message = args.newMessage ;
        return message;
    },
    message: ()=> message,

}


app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema:schema,
    rootValue: root
}))



app.listen(4000 , ()=>{
    console.log(`Server running on 4000`)
})