import { Blog } from "./blog.js";
import { User } from "./user.js";
import { ReadingList } from "./readingList.js";
import { Session } from "./session.js";
User.hasMany(Blog);
Blog.belongsTo(User);
User.belongsToMany(Blog, { through: ReadingList, as: "readings" });
Blog.belongsToMany(User, { through: ReadingList });
User.hasMany(Session);
// await User.sync({ alter: true });
// await Blog.sync({ alter: true });

export { Blog, User, ReadingList, Session };
