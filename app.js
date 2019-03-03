const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql') 
// destructure to pull certain properties from object
const { buildSchema } = require('graphql'); 
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Event = require('./models/event')
const User = require('./models/user')
// creates express app object;
const app = express();


// parse JSON information through middleware
app.use(bodyParser.json());

const events = eventIds => {
    return Event.find({_id: {$in: eventIds}}).then(events => {
        return events.map(event => {
            return { ...event._doc, _id: event.id, creator: user.bind(this, event.creator)}
        })
    }).catch(error => {
        throw err;
    })
}
const user = userId => {
    return User.findById(userId).then(user => {
        return {...user._doc, _id: user.id, createdEvents: events.bind(this, user._doc.createdEvents) }
    }).catch(err => {
        throw err
    })
}

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
            creator: User!
        }

        type User {
            _id: ID!
            email: String!
            password: String
            createdEvents: [Event!]
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input UserInput {
            email: String!
            password: String!
        }

        type RootQuery {
            events: [Event!]! 
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
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
                        return { ...event._doc, _id: event.id, creator: user.bind(this, event._doc.creator) } //poss convert to string if graphql not reading properly
                })
            })
            .catch(err => {
                throw err
            })
        },
        createEvent: (args) => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: "5c7b7025c6f39d7d63229c54" //mongoose auto converts to object id
        })
        let createdEvent
        return event
            .save()
            .then(result => {
                createdEvent = {...result._doc, creator: user.bind(this, result._doc.creator)}; //spread operator to return only information we want.
              return User.findById("5c7b7025c6f39d7d63229c54")
             
            })
            .then(user => {
                if (!user) {
                    throw new Error('User does not exist')
                }
                user.createdEvents.push(event)
                return user.save()
            })
            .then(result => {
                return createdEvent
            })
            .catch(err => {
              console.log(err)
              throw err;
            }); //provided by mongoose, connects and saves data to the mongodb
        },
        createUser: args => {
        return User.findOne({email: args.userInput.email}).then(user => {
                if (user) {
                    throw new Error('User exists already.')
                }
                return bcrypt.hash(args.userInput.password, 12)
            })
            .then(hashedPassword => {
                const user = new User({
                    email: args.userInput.email,
                    password: hashedPassword
                });
                return user.save()             
            }).then( result => {
                return {...result._doc, password: null }
            }).catch(err => {
                throw err
            })
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