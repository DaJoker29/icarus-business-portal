#!/usr/bin/env node

const program = require('commander');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const { User, Server, Domain } = require('../app/models');

program
  .option('-u, --user <user>', "User's email address")
  .option('-s, --server <server>', 'Server LINODE ID')
  .option('-n, --name <name>', 'Domain Name')
  .option('-d, --dev', 'Run in dev mode')
  .parse(process.argv);

mongoose.connect(program.dev ? process.env.TEST_DB : process.env.DB);
mongoose.connection.on('connected', async function() {
  console.log(program.server);
  await Promise.all([
    User.findOne({ email: program.user }),
    Server.findOne({ LINODEID: program.server }),
  ])
    .then(([user, server]) => {
      if (user && server) {
        const data = {
          name: program.name,
          user: user._id,
          server: server._id,
        };
        return Domain.create(data);
      }
      throw Error('Invalid user or server');
    })
    .then(domain => {
      console.log(`Successfully created domain record: ${domain.name}`);
      return Server.findOneAndUpdate(
        { _id: domain.server },
        {
          $push: { domains: domain._id },
        },
        { new: true },
      );
    })
    .then(server =>
      console.log(
        `Successfully pushed new domain to server: ${server.LINODEID}`,
      ),
    )
    .catch(e => console.log(e));

  mongoose.connection.close();
});

console.log(`Running in ${program.dev ? 'Dev mode' : 'Production mode'}`);
