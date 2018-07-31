## Relish App

The Relish is a sports media brand for female fans. Sign up for sports news, lifestyle and pop culture on therelish.com. Like, follow and share @therelishsports and on Medium www.medium.com/the-relish

There are three types of users, an Admin, a Referrer which can turn into a Ambassador if 3 of their invitees sign up for the subscription service. Admins will have a dashboard that can see all referrers and the people they have invited. Referrers will have to enter their email to validate who they are. They will then have the ability to invite people. The link code that they send their invitees will have a reference to them so that we can keep track of who each referrer invites.

### Getting Started

Install Sass

1. Install RVM(Ruby Version Manager) `\curl -sSL https://get.rvm.io | bash`
2. Install version 2.3.0 of ruby
3. Install Sass `gem install sass`

Install Gulp

1. Run `npm install -g gulp`

Install NPM packages

1. In root prject folder run `npm install`

Make sure Mongo is running by typing `mongod` in your terminal.

To run the server you will be typing `gulp` instead of nodemon. Gulp is a javascript task manager that will be compiling all your sass files into css and automatically reloading the browser. To learn more about gulp you can read [here](https://gulpjs.com/).

All 'css' will be handled inside the scss folder. You DO NOT need to touch the 'main.css' file. The 'main.scss' file is being used to import all other sass files. As of now all custom sass (not Bootstrap) is in the \_settings.scss file. Please refer to the [Sass documents](http://sass-lang.com/) for basic syntax usage.

Install Ultrahook

1. gem install ultrahook
2. Run `ultrahook therelish 7000` in a separate terminal window

### Technologies Used

* [Node.js](https://nodejs.org/en/)
* [MongoDB](https://www.mongodb.com/)
* [Mongoose](http://mongoosejs.com/)
* [Express.js](https://expressjs.com/)
* [Pasport.js](passportjs.org)
* [Sass](http://sass-lang.com/)
* [Bootstrap](https://getbootstrap.com/)
* [CloudSponge](https://www.cloudsponge.com/)

Before you run the seed.js file make sure the you drop your invitees collection. To do that go to your terminal and run the following code:

 ```
 mongo
 use relish-app
 db.invitees.drop();
 ```
 After that run the seed.js file.