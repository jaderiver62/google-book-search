// Resolvers file
const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
    Query: {
        // Finds the logged in user's data
        me: async(parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select("-__v -password");

                return userData;
            }

            throw new AuthenticationError("Not logged in");
        }
    },
    Mutation: {
        // Logs in users and generates a token
        login: async(parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError("Credentials are incorrect!");
            }

            const userPassword = await user.isCorrectPassword(password);

            if (!userPassword) {
                throw new AuthenticationError("Credentials are incorrect!");
            }

            const token = signToken(user);
            return { token, user };
        },
        // New user
        addUser: async(parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        // Save new book
        saveBook: async(parent, { book }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate({ _id: context.user._id }, { $addToSet: { savedBooks: book } }, { new: true, runValidators: true });

                return updatedUser;
            }

            throw new AuthenticationError("Not logged in");
        },
        // Remove book by ID
        removeBook: async(parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate({ _id: context.user._id }, { $pull: { savedBooks: { bookId: bookId } } }, { new: true });

                return updatedUser;
            }

            throw new AuthenticationError("You must be logged in first.");
        }
    }
};

module.exports = resolvers;