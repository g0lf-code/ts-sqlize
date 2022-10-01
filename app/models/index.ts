import { Options, Sequelize } from 'sequelize';

import Class from './class';
import Student from './student';
import Teacher from './teacher';

import database from '../config';

// Open database connection
console.log();
const sequelize = new Sequelize(
  database.database,
  database.username,
  database.password,
  {
    dialect: 'postgres',
    database: database.database,
    username: database.username,
    host: database.host,
    port: database.port,
    password: database.password,
  }
);

// Initialize each model in the database
// This must be done before associations are made
let models = [Class, Student, Teacher];
models.forEach((model) => model.initialize(sequelize));

// Many students in each class
Class.belongsToMany(Student, { through: 'Classes_Students' });
// Many classes for each student
Student.belongsToMany(Class, { through: 'Classes_Students' });

// One teacher for each class
Class.belongsTo(Teacher);
// Many classes for one teacher
Teacher.hasMany(Class);

// Create database tables
//   force: true causes database to reset with each run
// sequelize.sync({ force: true }).then(() => 'Syncing database');

export { sequelize as Database, Class, Student, Teacher };
