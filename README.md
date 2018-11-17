
# Swarmer JS Client

[![Build Status](https://travis-ci.com/stevepentland/swarmer-client-js.svg?branch=master)](https://travis-ci.com/stevepentland/swarmer-client-js) 
[![npm version](https://badge.fury.io/js/swarmer-client.svg)](https://badge.fury.io/js/swarmer-client)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

This is meant to be a companion application to work with [swarmer](https://github.com/stevepentland/swarmer). It is designed to act as the main 
[ENTRYPOINT](https://docs.docker.com/engine/reference/builder/#entrypoint) in a
`Dockerfile` and handles running the target process and submitting back the results.

# Using the Application

In your `Dockerfile`, install this as a global application via
```
RUN npm i -g swarmer-client
```

You will then need to define the command the `swarmer-client` should run
when it is started and where this command should be run from. These are set
as environment variables in the `Dockerfile` like so:
```
ENV RUN_CMD=node
ENV RUN_BASE_DIR=/app
```
Assuming you are going to be running a `node` application from the `/app` directory
in your image.

Once that is complete, you can set the ENTRYPOINT to run the `swarmer-client` like so:
```
ENTRYPOINT [ "swarmer-client" ]
```
Which will then automatically spin up this client when the container starts and 
run your app.

Once your image is completely built, you can host it somewhere that your swarm nodes
can access, and pass it as a new job base to `swarmer`. Please follow the documentation
in that project to see the other environment variables that are set.

# Changes

Please see the [Changelog](docs/CHANGELOG.md)