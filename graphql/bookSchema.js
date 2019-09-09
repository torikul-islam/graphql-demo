const {GraphQLNonNull,GraphQLList, GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt } = require('graphql');
const Book = require('../model/book');
const Author = require('../model/author');



const BookType = new GraphQLObjectType({
    name: "Book",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type:GraphQLString },
        genre: { type:GraphQLString },
        author:{
            type: AuthorType,
            resolve: (root, args)=>{
                return Author.findById(root.authorId)
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: "Author",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type:GraphQLString },
        age: { type:GraphQLInt},
        books: {
            type: new GraphQLList(BookType),
            resolve: (root, args)=>{
                return Book.find({authorId:root.id})
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        book:{
            type: BookType,
            args: { id: {type: GraphQLID}},
            resolve: (root, args)=>{
                //fetch database or or any data source...
                const book = Book.findById(args.id);
                if(!book) throw new Error("No books found with the givwen Id");
                return book;
            }
        },
        author:{
            type: AuthorType,
            args: {id:{ type: GraphQLID}},
            resolve: (root, args)=> {
                return Author.findById(args.id)
            }
        },
        books:{
            type: new GraphQLList(BookType),
            resolve: (root, args)=>{
                return Book.find({});
            }
        },
        authors:{
            type: new GraphQLList(AuthorType),
            resolve: (root, args)=> {
                return Author.find({});
            }
        }
    }
});


const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addAuthor:{
            type: AuthorType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString)},
                age: { type: GraphQLNonNull(GraphQLInt)}
            },
            resolve: (root, args)=> {
                const author = new Author({
                    name: args.name,
                    age: args.age,
                });
                return author.save();
            }
        },
        addBook:{
            type: BookType,
            args: {
                name: {type:GraphQLNonNull(GraphQLString)},
                genre: {type: GraphQLNonNull(GraphQLString)},
                authorId: {type: GraphQLNonNull(GraphQLString)}
            },
            resolve: (root, args)=> {
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });
                return book.save();
            }
        }
    }
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})