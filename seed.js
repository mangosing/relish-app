require('dotenv').load();
const BASE_URL = process.env.BASE_URL;
const { Admin, Referrer } = require('./models');
const mongoose = require('mongoose');
mongoose.Promise = Promise;

const admins = [
  {
    firstname: 'Jette',
    lastname: 'Hernandez',
    email: 'jettestrong@gmail.com',
    password: 'password',
    passwordResetToken: ''
  },
  {
    firstname: 'Sean',
    lastname: 'Mangosing',
    email: 'seanmangosing@gmail.com',
    password: 'password',
    passwordResetToken: ''
  },
  {
    firstname: 'Elie',
    lastname: 'Schoppik',
    email: 'elieschoppik@gmail.com',
    password: 'password',
    passwordResetToken: ''
  },
  {
    firstname: 'Darien',
    lastname: 'Duong',
    email: 'darienduong@gmail.com',
    password: 'password',
    passwordResetToken: ''
  },
  {
    firstname: 'Zejian',
    lastname: 'Shen',
    email: 'zesansan@gmail.com',
    password: 'password',
    passwordResetToken: ''
  },
  {
    firstname: 'Stephen',
    lastname: 'Carrera',
    email: 'stephen.carrera@gmail.com',
    password: 'password',
    passwordResetToken: ''
  },
  {
    firstname: 'Ashley',
    lastname: 'Wellington-Fahey',
    email: 'ashley@therelish.com',
    password: 'password',
    passwordResetToken: ''
  },
  {
    firstname: 'Lisa',
    lastname: 'Raphael',
    email: 'lisa@therelish.com',
    password: 'password',
    passwordResetToken: ''
  }
];

const allReferrers = [
  {
    vimeoId: '3',
    name: 'Ashley Wellington-Fahey',
    email: 'ashley@therelish.com'
  },
  {
    vimeoId: '13',
    name: 'Lisa Raphael',
    email: 'lisa@therelish.com'
  },
  {
    vimeoId: '123',
    name: 'Jane Doe',
    email: 'janedoe@gmail.com'
  },
  {
    vimeoId: '333',
    name: 'Zejian Shen',
    email: 'zesansan@gmail.com'
  }
];

async function createAdmin(obj) {
  try {
    const admin = await Admin.create(obj);
  } catch (err) {
    console.log(`There was a problem creating an admin: ${err}`);
  }
}

async function createReferrer(obj) {
  try {
    const referrer = await Referrer.create(obj);
  } catch (err) {
    console.log(`There was a problem creating an referrer: ${err}`);
  }
}

async function createAndRemoveAdmins() {
  try {
    await Admin.remove({});
    const adminGroup = await admins.map(admin => createAdmin(admin));
    return await Promise.all(adminGroup);
  } catch (err) {
    console.log(err);
  }
}

async function createAndRemoveReferrers() {
  try {
    await Referrer.remove({});
    const refGroup = await allReferrers.map(referrer =>
      createReferrer(referrer)
    );
    return await Promise.all(refGroup);
  } catch (err) {
    console.log(err);
  }
}

Promise.all([createAndRemoveAdmins(), createAndRemoveReferrers()]).then(() =>
  process.exit(0)
);
