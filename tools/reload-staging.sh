#!/bin/sh
# Reload server with new configuration settings.
pm2 delete test-icarus
yarn run staging
