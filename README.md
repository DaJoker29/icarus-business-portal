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

## Roadmap
### v2.0.0 - Gold Release/Locked API (Deadline: March 30, 2018)
- Automated Build Process
  - Linode's automatically created and loaded with server stack
  - DNS is automatically configured
  - CMS (WordPress or Podcast Manager) is automatically installed and given a basic configuration
  - SSL Certificates are auto-generated and free auto-renewal setup
- Automated Domain Names
  - Domain Names are purchased and renewed automatically
- Month-To-Date Resource Tracking
  - RAM
  - DISK
  - Bandwidth
- Integration and Unit Testing Suites
- Continuous Integration/Deployment
- Ticketing/Support System
### v1.0.0 - Data and UI (Deadline: February 23, 2018)
- Authentication
  - ~Email Confirmation~
  - Change Password
- User Actions
  - ~Users can create accounts with basic information.~
  - ~Users can edit account information~
  - ~Users can view current plans and allotments.~
  - Users can renew current plans and domains
  - Users can purchase new plans and domains
- Admin Actions
  - ~Admins can view current user and server information~
  - ~Admins can link/unlink users with servers~
  - Admins can update server/domain information


## Authors

* **Dewitt Buckingham** - [DaJoker29](https://github.com/DaJoker29)

See also the list of [contributors](https://github.com/dajoker29/icarus-business-portal/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

* [Billie Thompson](https://github.com/PurpleBooth) - Initial README.md template

