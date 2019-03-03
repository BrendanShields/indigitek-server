const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql') 
// destructure to pull certain properties from object
const { buildSchema } = require('graphql'); 
// creates express app object;
const app = express();

// parse JSON information through middleware
app.use(bodyParser.json());

//graphql config, defining schema, endpoints, resolvers.
// backticks allow multi-line string
app.use('/graphql', graphqlHttp({
    
    schema: buildSchema(`
        type RootQuery {

        }

        type RootMutation {

        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {}
}));
//listens on port 3000
app.listen(3000);