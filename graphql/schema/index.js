// The graphQL Schema tells graphql what the different models look like.
// the rootQuery tells graphQL what it can query and return
// likewise the rootmutation tells graphQL what can be altered.
const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Booking {
    _id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
}
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
  first_name: String!
  surname: String!
  email: String!
  password: String
  createdEvents: [Event!]
}
type AuthData {
  userId: ID!
  token: String!
  tokenExpiration: Int!
}
input EventInput {
  title: String!
  description: String!
  price: Float!
  date: String!
  creator: String!
}
input UserInput {
  first_name: String!
  surname: String!
  email: String!
  password: String!
}
type RootQuery {
    events: [Event!]!
    bookings: [Booking!]!
    users: [User!]!
    login(email: String!, password: String!): AuthData!
}
type RootMutation {
    createEvent(eventInput: EventInput): Event
    createUser(userInput: UserInput): User
    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Event!
}
schema {
    query: RootQuery
    mutation: RootMutation
}
`);