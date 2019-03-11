
// express cuts down on repetitive tasks like parsing urls and ensures that
// things are secure. It is a node framework building upon node and offering
// functionality.

const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql') 

// destructure to pull certain properties from object
 
const mongoose = require('mongoose')

const graphQlSchema = require('./graphql/schema/index')
const graphQlResolvers = require('./graphql/resolvers/index')
const isAuth = require('./middleware/is-auth')

// creates express app object;

const app = express();

// parse JSON information through middleware

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'FETCH,POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200)
    }
    next();
})
app.use(isAuth)

//graphql config, defining schema, endpoints, resolvers.
// backticks allow multi-line string
// the ! makes sure it always returns a value not null.
// args comes from the createEvent() mutation
app.use('/graphql', graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
     graphiql: true
  })
);

app.set( 'port', ( process.env.PORT || 3000 ));

// connecting to database with credentials stored in nodemon.json
mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
        process.env.MONGO_PASSWORD
    }@indigitek-umcdl.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`
    ).then(() => {
        app.listen(app.get( 'port' ), function() {
            console.log( 'Node server is running on port ' + app.get( 'port' ));
            })
    }).catch(err => {
        console.log(err);
    })
//listens on port 3000