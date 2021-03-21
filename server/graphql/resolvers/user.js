import { User, Message } from "../../models";
import bycrpt from "bcryptjs";
import { isEmpty, validEmail, ismatchPassword } from "../../helpers";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/env.json";
import { AuthenticationError } from "apollo-server";
import { Op } from "sequelize";

export default {
  Query: {
    getUsers: async (_, __, { user }) => {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");

        let users = await User.findAll({
          attributes: ["username", "imageUrl", "createdAt", "id"],
          where: { username: { [Op.ne]: user.username } },
        });

        const allUserMessages = await Message.findAll({
          where: {
            [Op.or]: [{ from: user.username }, { to: user.username }],
          },
          order: [["createdAt", "DESC"]],
        });

        users = users.map((otherUser) => {
          const latestMessage = allUserMessages.find(
            (m) => m.from === otherUser.username || m.to === otherUser.username
          );
          otherUser.latestMessage = latestMessage;
          return otherUser;
        });

        return users;
      } catch (err) {
        throw err;
      }
    },
  },

  Mutation: {
    login: async (_, args) => {
      try {
        const { email, password } = args;
        if (isEmpty(password)) {
          return {
            ok: false,
            errors: [
              {
                path: "login",
                message: "Password cannot be empty",
              },
            ],
          };
        }
        if (isEmpty(email)) {
          return {
            ok: false,
            errors: [
              {
                path: "login",
                message: "Email cannot be empty",
              },
            ],
          };
        }

        if (!validEmail(email)) {
          return {
            ok: false,
            errors: [
              {
                path: "Email",
                message: "Not a valid email",
              },
            ],
          };
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
          return {
            ok: false,
            errors: [
              {
                path: "login",
                message: "Email or password is incorrect",
              },
            ],
          };
        }

        const correctPassword = await bycrpt.compare(password, user.password);

        if (!correctPassword) {
          return {
            ok: false,
            errors: [
              {
                path: "login",
                message: "Email or password is incorrect",
              },
            ],
          };
        }

        const token = jwt.sign({ username: user.username }, JWT_SECRET, {
          expiresIn: "24h",
        });

        return {
          ok: true,
          token,
          user,
        };
      } catch (err) {
        return {
          ok: false,
          errors: [
            {
              path: "login",
              message: "Something went wrong",
            },
          ],
        };
      }
    },

    register: async (_, args) => {
      const { username, email, password, confirmPassword } = args;

      const hashPassword = await bycrpt.hash(password, 12);
      try {
        const emailExist = await User.findOne({ where: { email } });
        if (emailExist) {
          return {
            ok: false,
            errors: [
              {
                path: "register",
                message: "User already exist",
              },
            ],
          };
        }

        const usernameExist = await User.findOne({ where: { username } });
        if (usernameExist) {
          return {
            ok: false,
            errors: [
              {
                path: "username",
                message: "Username is taken",
              },
            ],
          };
        }

        if (!validEmail(email)) {
          return {
            ok: false,
            errors: [
              {
                path: "Email",
                message: "Not a valid email",
              },
            ],
          };
        }

        if (isEmpty(username)) {
          return {
            ok: false,
            errors: [
              {
                path: "Username",
                message: "Username cannot be empty",
              },
            ],
          };
        }

        if (username.trim().length < 6) {
          return {
            ok: false,
            errors: [
              {
                path: "Username",
                message: "Username should be atleast 6 letters long",
              },
            ],
          };
        }

        if (isEmpty(password)) {
          return {
            ok: false,
            errors: [
              {
                path: "Password",
                message: "Password cannot be empty",
              },
            ],
          };
        }

        if (!ismatchPassword(password, confirmPassword)) {
          return {
            ok: false,
            errors: [
              {
                path: "ConfirmPassword",
                message: "Passwords do not match",
              },
            ],
          };
        }

        const user = await User.create({
          username,
          email,
          password: hashPassword,
        });
        return {
          ok: true,
          user,
        };
      } catch (err) {
        // if ((err.name = "SequelizeUniqueConstraintError")) {
        //   return {
        //     okay: false,
        //     errors: [
        //       {
        //         path: err.errors[0].path,
        //         message: err.errors[0].message,
        //       },
        //     ],
        //   };
        // }
        return {
          ok: false,
          errors: [
            {
              path: "register",
              message: "Something went wrong",
            },
          ],
        };
      }
    },
  },
};
