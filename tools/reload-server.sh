#!/bin/sh
# Reload server with new configuration settings.
pm2 delete icarus
npm run prod