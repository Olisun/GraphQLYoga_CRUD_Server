const { GraphQLServer } = require('graphql-yoga');

let users = [
  {
    id: 'user-1',
    name: 'Oliver Sun',
    from: 'San Francisco',
    age: 47
  },
  {
    id: 'user-2',
    name: 'Wiggly Sun',
    from: 'San Francisco',
    age: 10
  },
  {
    id: 'user-3',
    name: 'Crazy Kitty',
    from: 'San Francisco',
    age: 9
  },
];

let idCount = users.length;

const typeDefs = `
type User {
  id: String!
  name: String!
  from: String!
  age: Int!
}

  type Query {
    info: String!
    users: [User]
    user(id: ID!): User!
  }

  type Mutation {
    createUser(name: String!, from: String!, age: Int!): User!
    deleteUser(id: ID!): User!
    updateUser(id: ID!, name: String, from: String, age: Int): User!
  }
`;

const resolvers = {
  Query: {
    info: () => {
      return `Server is running correctly`
    },
    users: () => {
      return users;
    },
    user: (args, { id }) => {
      const user = users.find(args => args.id === id);
      return user
    }
  },

  Mutation: {
    createUser: (parent, args) => {
      const newUser = {
        id: `user-${idCount++}`,
        name: args.name,
        from: args.from,
        age: args.age
      }
      users = [...users, newUser];
      return newUser;
    },
    deleteUser: (args, { id }) => {
      const userToDelete = users.find(args => args.id === id);
      users = users.filter(user => {
        return user.id !== userToDelete.id;
      });
      return userToDelete;
    },
    updateUser: (args, { id, name, from, age }) => {
      let updatedUser;
      users = users.map(user => {
        if (user.id === id) {
          updatedUser = {
            id: user.id,
            name: name !== undefined ? name : user.name,
            from: from !== undefined ? from : user.from,
            age: age !== undefined ? age : user.age
          }
          return updatedUser;
        } else {
          return user;
        }
      });
      return updatedUser;
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => console.log(`Server is running on localhost:4000`))