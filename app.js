const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql') 
// destructure to pull certain properties from object
const { buildSchema } = require('graphql'); 
const mongoose = require('mongoose')

const Event = require('./models/event')
// creates express app object;
const app = express();


// parse JSON information through middleware
app.use(bodyParser.json());


//graphql config, defining schema, endpoints, resolvers.
// backticks allow multi-line string
// the ! makes sure it always returns a value not null.
// args comes from the createEvent() mutation
app.use('/graphql', graphqlHttp({
    
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return Event.find()
                .then(events => {
                    return events.map(event => {
                        return { ...event._doc } //poss convert to string if graphql not reading properly
                })
            }).catch(err => {
                throw err
            })
        },
        createEvent: (args) => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date)
        })
        return event.save().then(result => {
              console.log(result)
              return {...result._doc}; //spread operator to return only information we want.
          }).catch(err => {
              console.log(err)
              throw err;
          }) //provided by mongoose, connects and saves data to the mongodb
        }
     },
     graphiql: true
  })
);

// connecting to database with credentials stored in nodemon.json
mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
        process.env.MONGO_PASSWORD
    }@indigitek-umcdl.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`
    ).then(() => {
        app.listen(3000)
    }).catch(err => {
        console.log(err);
    })
//listens on port 3000