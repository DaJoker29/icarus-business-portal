# Icarus

Web Interface to allow [Zero Daedalus](https://zerodaedalus.com) customers to create and manage hosting plans and domain names. Providing transparency and streamlined access to support, if needed.

## Getting Started

1. *Clone repo* - `git clone git@github.com:DaJoker29/icarus-business-portal.git`
2. *Run Install Script* - `yarn install`
3. *Start* - `yarn start`

### Prerequisites
- NodeJS
- Yarn
- MongoDB

### Installing
An `.env` file must be created in the root of the directory.

```
SESSION_SECRET=
HOST=
PORT=
DB=
REDIS_PORT=
EMAIL_SERVICE=
EMAIL_HOST=
EMAIL_PORT=
EMAIL_FROM=
EMAIL_USER=
EMAIL_PASS=
LINODE_API_KEY=
DEBUG=
```
**SESSION_SECRET** A token string used to create cookies. KEEP THIS PRIVATE!

**HOST** Your app's hostname (default: localhost:3000)

**PORT** The port your app will listen on (default: 3000)

**DB** URL to Mongo Database

**REDIS_PORT** Port to connect to Redis (default: 6379)

**EMAIL_SERVICE**, **EMAIL_HOST**, **EMAIL_PORT**, **EMAIL_FROM**, **EMAIL_USER**, **EMAIL_PASS** Node Mailer configuration options for sending emails

**LINODE_API_KEY** To access a linked Linode account

**DEBUG** Used by [debug](https://github.com/visionmedia/debug) for logging.

## Running the tests
No notes on testing yet.

## Deployment
No notes on deployment yet.

## Built With

* [Express](http://expressjs.com/) - Web Framework
* [Yarn](https://yarnpkg.com/en/) - Dependency Management
* [MongoDB](https://www.mongodb.com/) - NoSQL Document-Oriented Database
* [Mongoose](http://mongoosejs.com/) - Node library for MongoDB
* [Pug](https://pugjs.org/api/getting-started.html) - Templating Engine
* [Passport](http://www.passportjs.org/) - Express Authentication System
* [ESLint](https://eslint.org/) - Code Linting
* [Moment](http://momentjs.com/) - Date Parsing/Display
* [Numeral](http://numeraljs.com/) - Number Formatting

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/dajoker29/icarus-business-portal/tags). 

## Authors

* **Dewitt Buckingham** - [DaJoker29](https://github.com/DaJoker29)

See also the list of [contributors](https://github.com/dajoker29/icarus-business-portal/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

* [Billie Thompson](https://github.com/PurpleBooth) - Initial README.md template

