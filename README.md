# next-syndication-api

[![CircleCI](https://circleci.com/gh/Financial-Times/next-syndication-api.svg?style=svg)](https://circleci.com/gh/Financial-Times/next-syndication-api)
[![Coverage Status](https://coveralls.io/repos/github/Financial-Times/next-syndication-api/badge.svg?branch=master)](https://coveralls.io/github/Financial-Times/next-syndication-api?branch=master)
[![Splunk Logs](https://img.shields.io/badge/splunk-logs-brightgreen.svg)](https://financialtimes.splunkcloud.com/en-US/app/search/search?q=search%20source%3D%22%2Fvar%2Flog%2Fapps%2Fheroku%2Fft-next-syndication-api.log%22%20index%3D%22heroku%22&display.page.search.mode=verbose&dispatch.sample_ratio=1&earliest=-6d&latest=now&sid=1533553215.15335907)

## Troubleshooting

All troubleshooting information is gathered in the [Syndication API Troubleshooting runbook](https://runbooks.ftops.tech/next-syndication-api).

## What is Syndication and how does it work

The API behind the FT.com/republishing tool.

_NB: There is a common misconception that you need all parts of Syndication to be running locally to test a single part of it. However, `next-router` will only look for a locally-running syndication API if it has the `syn-` environmental variables in the `.env` file. You can run n-syndication or next-syn-list locally and the router will use the syndication API running in production if those variables are not there._

[next-syndication-api wiki page](https://github.com/Financial-Times/next-syndication-api/wiki/Syndication-API-(next-syndication-api))

### More information about the syndication system

* [The Syndication Wiki](https://github.com/Financial-Times/next-syndication-api/wiki) explains the system and its architecture, including endpoints and authentication.
* [Next Wiki](https://github.com/Financial-Times/next/wiki/Syndication) covers GDPR SAR and erasure requests so that people without github access can read it, as it is automatically published to <https://customer-products.in.ft.com/wiki/Syndication>.
* [Database Credentials & Key Rotation](https://github.com/Financial-Times/next-syndication-api/wiki#database-credentials-and-key-rotation) info related with key rotation in the systems
## Installation

```shell

    ~$ git clone git@github.com:Financial-Times/next-syndication-api.git

    ~$ cd next-syndication-api

    ~$ npm install
    

```

----

## Deployment

**Important!**

Syndication deviates from our standard deployment process please refer to the steps detailed [Deploying the download server](https://github.com/Financial-Times/next-syndication-dl#deploying-the-download-server) if you are making a release on this app.

---

## Salesforce dependency

### Setting yourself up on a contract

See [getting started](https://github.com/Financial-Times/next-syndication-api/wiki/Syndication-API:-authentication#getting-started) on the authentication wiki page

### Other contracts

If you need to test a specific contract, since all contracts live in the production salesforce environment, in order to test certain contracts locally you will need to use the production `SALESFORCE_*` environment variables rather than the development ones (see Vault).

In development mode you should be using the FT Staff contract, which is stubbed in `stubs/CA-00001558.json`

---

## Run locally

You WILL need:

* to be [set up on a syndication contract](#Setting-yourself-up-on-a-contract)
* [next-syndication-db-schema](https://github.com/Financial-Times/next-syndication-db-schema) - database schema (see Database dependency below)
* [pandoc](https://pandoc.org/installing.html) installed on your machine for `/download` to work locally
  * [What is Pandoc?](https://github.com/Financial-Times/next-syndication-api/wiki/Syndication-API-&-DL:-Pandoc-and--pandoc-dpkg)

You MIGHT need:

* [next-syn-list](https://github.com/Financial-Times/next-syn-list) - front-end app for syndication customers. If you want to work on the pages that users see when they go to `/republishing` you will need this.
* [n-syndication](https://github.com/Financial-Times/n-syndication) - client-side library for syndication icons and overlays which you can `bower link` to an app (e.g. next-front-page) for local development.
* [next-syndication-dl](https://github.com/Financial-Times/next-syndication-dl) - downloads app, you are less likely to need to work on this though.

### Database dependency

If you need to use the database locally, set up the database by following the instructions in [next-syndication-db-schema](https://github.com/Financial-Times/next-syndication-db-schema).

If you are using postgres in Docker, you will need to edit your `.env` file to set `DATABASE_HOST` to `192.168.99.100`

### Running the API

Once you have set up the projects you want to work on, and want to run all projects easily, you can do so from within the `next-syndication-api`, you will need to:

* update your local [next-router](https://github.com/Financial-Times/next-router)'s `.env` file to include the following:

  ```properties

     syndication-api=3255
     syn-contract=3984
     syn-list=3566

  ```

  (request will fail on the browser because is an API and it requires `x-api-key` to be present in the request)


  * HOWEVER if you are also running another app like `next-syn-list` or `next-article`, do not run `next-router` at the same time. Those apps run `next-router` by default so you don't need an independent instance. In fact, trying to run an independent instance of `next-router` will stop your local `next-article` app from working.
* `cd` into `next-syndication-api` and `npm start`
  * This will start the `next-syndication-api`, the associated worker processes and the republishing contract and history pages using [PM2](https://www.npmjs.com/package/pm2), and tail the logs for all HTTP servers/processes.
* go to [http://local.ft.com:3255/__gtg](http://local.ft.com:3255/__gtg) to confirm the syndication API app is responding

* go to [https://local.ft.com:5050/syndication/user-status](https://local.ft.com:5050/syndication/user-status) to confirm the app is responding with data
* Optionally, you can also run `npm run monit` to bring up the [PM2 process monitor](https://www.npmjs.com/package/pm2#cpu--memory-monitoring) e.g. for checking out CPU and memory usage.

### Running against prod DB (optional)
To run `next-syndication-api` against prod DB is necessary add to the environment variables defined in `custom-environment-variables.yaml` the prefix `_PROD`.  
("DATABASE_NAME_PROD",DATABASE_HOST_PROD","DATABASE_PASSWORD_PROD","DATABASE_PORT_PROD","DATABASE_URL_PROD","DATABASE_USER_NAME_PROD").  
These variables are already defined in development Vault folder.

### Running the Syndication UI (optional)

* if you also want to locally test all the `/republishing` pages, `cd` into `next-syn-list` and run `npm run start`

* if you want to test that the syndication icon buttons work too, install and run [next-article](https://github.com/Financial-Times/next-article) locally.

  * Make sure to stop any instances of `next-router` you have running before you run `next-article`.
  * Which syndication icon gets shown for each article depends on the [article data returned from CAPI/ES](https://github.com/Financial-Times/next-syndication-api/wiki/Syndication-API:-article-syndication-permissions_)

### Restarting

When restarting the app to check your changes, you will need to make sure there are no pm2 processes kicking about that might show you the unchanged version.
You can stop all pm2 processes with the command `npm run killall`. You can chain commands with `run killall && npm start` so you don't have to wait for the kill-all process to finish before

---

## Configuration

This project and the [next-syndication-dL](https://github.com/Financial-Times/next-syndication-dl) project both use standard next environment variables for storing secrets in vault.

Though a lot of config for these projects is not secret, so rather than pollute vault with generic configuration, a layer has been added on top of the standard environment variables.

Both projects use a library called [config](https://www.npmjs.com/package/config) for which you define a `config/default.yaml` file which can be overlaid by other config files based on naming conventions like `config/${NODE_ENV}.yaml` and/or `config/${require('os').hostname()}.yaml` see the [config module documentation for File Load Order](https://github.com/lorenwest/node-config/wiki/Configuration-Files#file-load-order) for more information.

All secrets are added to the [generic config](https://github.com/Financial-Times/next-syndication-api/tree/master/config) using the [Custom Environment Variables](https://github.com/lorenwest/node-config/wiki/Environment-Variables#custom-environment-variables) feature provided by the config library, so as to keep in line with `next`'s architecture and maintain no leaking of secrets throughout environments.

### next-syndication-dl

You will notice that [next-syndication-dl](https://github.com/Financial-Times/next-syndication-dl) does not have its own `config` directory.

Don't worry, this is by design: the `config` directory and the `pandoc-dpkg` directories are both symlinked to the root of the project by the `npm install` task.

## Emails

Emails are sent by the `db-persist` worker using nodemailer and gmail. This is used to email the syndication team when a client interacts with an article where they would need to pay more to republish it (e.g. external contributor articles, frequently in Life & Arts section)

[Troubleshooting](runbook.md) help is in the runbook.

## API Endpoint Postman collection

There is a [JSON export of a Postman collection](doc/syndication-api-postman.json) that gives you an easy way to run all the endpoints that this API provides to run syndication, as well as some endpoints to troubleshoot and trigger workers jobs.

To run this, you will need to:

* import the JSON into your Postman app to create the collection
* set up an Environment in Postman with the following variables
  * `syndication-api-key`, set to the value of the `SYNDICATION_API_KEY` (see Vault) to run the troubleshooting and workers endpoints
  * `als-api-key`, set to the value of `ALS_API_KEY` (see Vault) to run the membership API licence details endpoint
  * `user-id`, set to the value of a user ID already in the users table (recommend your own or another FT staff member's) to run the `db-persist` worker testing endpoint
* set up `cookie` in Postman request headers for domain `local.ft.com` and get the values for `FTSession` and `FTSession_s` from your ft.com cookie in your browser to pass authentication

* Some of the endpoints for example `https://local.ft.com:5050/syndication/contracts/{CONTRAcT_ID}` requires a `x-api-key` set the value of `SYNDICATION_API_KEY` in vault to be the `x-api-key` in postman request headers.(Note: These endpoints won't return the expected response via the browser because they requires `x-api-key`)

### Important notes

* the endpoint set up to trigger the `db persist` worker will result in dummy data being written to the database, only use when connected to local databases.
* `backup worker` and `redshift worker` will save output files in a `/development` subfolder of the S3 bucket, the response to postman will time out but you can see success/failure logs in your terminal
* `reload` usually times out, this only runs `syndication.reload_all()` to refresh the full DB contents
* `get contract by id` will actually result in the contract record being updated in the database with latest data from Salesforce (unless it is the FT Staff contract which uses a stub), despite being a `GET` request

## Maintenance mode

To turn maintenance mode on, simply turn the `syndicationMaintenance` flag on for everyone.

Conversely, turn it off again to turn maintenance mode off.

If you want to run the API endpoints in Postman while this flag is on, set a cookie for domain `local.ft.com` in Postman for `next-flags` to override it with `next-flags=syndicationMaintenance%3Aoff`

## Get Articles To Check Syndication Status
This dev tool was set up after it turned out that the emails notifying the right person that an article written by a freelancer was syndication were not sent. The emails are really important as freelancers get paid for each instance their article is syndicated. This is a back-up to get this information from [Heroku Dataclips](https://data.heroku.com/dataclips).

Step 1: 

Run the following query on the Syndication Database. You'll need to set the `time` variables to reflect the time period you need to check.
```sql
SELECT *
FROM syndication.downloads
WHERE time >= '2022-05-25'
AND time <= '2022-05-26'
```

Step 2:

Download the json file, move it to the dev-tools folder. You will need to change the json file and/or the `const { downloads } = require('../syndicationDownloads');` so that it imports the array correctly (you may need to change the .json file to .js and add `const downloads =` to the start). If you are changing the json file, please be patient - sometimes the files are huge and can take minutes to save the change. 

Step 3:
In your terminal go to dev-tools folder. Set the ES access and secret access keys as described in the [n-es-client readme](https://github.com/Financial-Times/n-es-client#installation). Run `node getArticlesToCheckSyndicationStatus.js`. This will output a `syndicationBackpayWithNames.json` file, which will be an array of objects.

An example of output:
```json
[
	{
		"canBeSyndicated": "withContributorPayment",
		"id": "60084cef-9c34-4d12-8407-ea7007f0054e",
		"title": "Nigeria’s Afrobeats superstars take on the world",
		"byline": "Ayodeji Rotinwa",
		"syndicationDetails": [
			{
				"uuid": "userID-user1",
				"downloadTimestamp": "2020-10-30 11:09:17.125+00",
				"syndicatedBy": "email-address-of-the-user",
				"contract": "contract-this-user-is-on"
			},
			{
				"uuid": "userID-user1",
				"downloadTimestamp": "2020-10-30 11:09:17.452+00",
				"syndicatedBy": "email-address-of-the-user",
				"contract": "contract-this-user-is-on"
			}
		]
	},
]
```
