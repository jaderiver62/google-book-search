// Resolvers script using apollo, grabbing models and signToken
const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
    // Get the logged in user's data
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select("-__v -password");

                return userData;
            }

            throw new AuthenticationError("Must be Logged in");
        }
        // Unless something goes wrong
    },
    Mutation: {
        // Get a user logged in, create token
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError("Error with credentials");
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError("Error with credentials");
            }
            // Check if something was incorrect
            const token = signToken(user);
            return { token, user };
        },
        addUser: async (parent, args) => {
            // Create new user
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        saveBook: async (parent, { book }, context) => {
            // Save new book to user's saved books
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: book } },
                    { new: true, runValidators: true }
                );

                return updatedUser;
            }

            throw new AuthenticationError("Must be Logged in");
        // Unless not logged in
        },
        removeBook: async (parent, { bookId }, context) => {
            // Remove book from user's saved books
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true }
                );

                return updatedUser;
            }

            throw new AuthenticationError("Not logged in");
        }
    }
};

module.exports = resolvers;
