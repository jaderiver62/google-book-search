const path = require("path");
const db = require("./config/connection");
const {
    typeDefs,
    resolvers
} = require("./schemas");
const {
    authMiddleware
} = require("./utils/auth");
const express = require("express");
const {
    ApolloServer
} = require("apollo-server-express");
const app = express();
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware
});

server.applyMiddleware({
    app
});

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

<<<<<<< HEAD
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/build")));
=======
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
>>>>>>> 9a7dc7f2d5181271d89440527be295a3f0d4c533
}

db.once("open", () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});