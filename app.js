const express = require('express');
const app = express();
const graphqlHTTP = require("express-graphql");
const schema = require("./graphql/bookSchema");


const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/graphqldb",
{useNewUrlParser: true }, (err)=>{
  if(err) throw err;
  console.log("Connected to mongodb...");
});

app.use("/book", graphqlHTTP({
  schema: schema,
  graphiql: true
}));

let port = process.env.PORT || 5000
app.listen(port, () => console.log(`Running on port ${port}`));
