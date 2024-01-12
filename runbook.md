<!--
    Written in the format prescribed by https://github.com/Financial-Times/runbook.md.
    Any future edits should abide by this format.
-->

# Syndication Api

API for FT syndication features

## Code

next-syndication-api

## Primary URL

http://ft-next-syndication-api.herokuapp.com

## Service Tier

Bronze

## Lifecycle Stage

Production

## Contains Personal Data

Yes

## Contains Sensitive Data

No

<!-- Placeholder - remove HTML comment markers to activate
## Can Download Personal Data
Choose Yes or No

...or delete this placeholder if not applicable to this system
-->

<!-- Placeholder - remove HTML comment markers to activate
## Can Contact Individuals
Choose Yes or No

...or delete this placeholder if not applicable to this system
-->

## Host Platform

Heroku

## Architecture

Here is a diagram for the high level architecture of Syndication
<https://app.lucidchart.com/documents/edit/4d31c9e5-eafe-4639-bba0-24d7a488b08f/0_0>

## First Line Troubleshooting

### The app is erroring

This is a standard Heroku app, so try all the normal things here (bounce the dynos etc). For localised errors, check the user trying to access the application is actually on a syndication licence.

### People can't see their syndication icons (first line)

If syndication icons are not appearing for an individual user (as opposed to all users) then it is likely this user is not on a licence or has been removed from a licence.

This system has an upstream dependency on Salesforce, so it is worth investigating the user's licence status there too. If the licence was recently renewed or set up, it is worth checking if they have been given the correct assets.

As an example an incident in February 2020 occurred because an `FTB Article` asset was added by the account manager instead of `FT Article`.

To debug issues where only one person or one contract can't see the icons, please follow [a separate document on the subject](https://financialtimes.atlassian.net/wiki/spaces/Accounts/pages/8121811189/When+one+user+cannot+see+their+syndication+icons)

If _nobody_ can see their icons, then this is a more serious problem and should be pushed to [Second Line](#people-cant-see-their-syndication-icons-second-line) .

#### **Salesforce usage**

The app connects to Salesforce to get contract details for the user, and updates the Syndication database when it receives them

- User: `next-syndication`
- URLs: Logs in and uses an SDK, retrieves details from `/SCRMContract/[someContractID]`
- Splunk: [index="heroku" source=\*syndication-api\* salesforce error](https://financialtimes.splunkcloud.com/en-US/app/search/search?q=search%20index%3D%22heroku%22%20source%3D*syndication-api*%20salesforce%20error&display.page.search.mode=smart&dispatch.sample_ratio=1&workload_pool=standard_perf&earliest=-1h&latest=now&sid=1661952146.1430281), `NullApexResponse` is in the error message specifically for the call to Salesforce

## Second Line Troubleshooting

_NB: There is a common misconception that you need all parts of Syndication to be running locally to test a single part of it. However, `next-router` will only look for a locally-running syndication API if it has the `syn-` environmental variables in the `.env` file. You can run n-syndication or next-syn-list locally and the router will use the syndication API running in production if those variables are not there._

### Check the details of a specific contract

- **Contract check:** You can see the details of a specific contract by calling `GET https://www.ft.com/syndication/contracts/:contract_id` with a valid api key sent in `x-api-key` header. This will pull details from Salesforce and run them through the API.
  - You can find the API key in Doppler : `next` team, `next-syndication-api` project, `production` folder, the key is called `SYNDICATION_API_KEY`.
  - The `:contract_id` should have the `FTS-xxxxxxxx` format, unless it is the FT Staff licence which has a `CA-xxxxxxxx` format and uses a stub rather than Salesforce
- **Article republishing permissions check:** `POST` call to `https://www.ft.com/syndication/contracts/:contract_id/resolve` with a valid api key (as above) and a json body which is an array of content ids will return the syndication permissions for each article you listed
- **Tip:** You can reuse the [Postman collection](https://github.com/Financial-Times/next-syndication-api/blob/main/doc/syndication-api-postman.json) ([instructions](https://github.com/Financial-Times/next-syndication-api#api-endpoint-postman-collection)) for these API endpoints, you will need to adapt the `local.ft.com url:5050` to `www.ft.com`

### Check the user status page works

If the problem is happening for everyone, check the `/syndication/user-status` endpoint, otherwise see if you can get the person who is having the issue (or customer support masquerading as that user) to hit the URL while you're tailing the logs and look for any lines that `error: ` this should highlight JavaScript errors.

### People can't see their syndication icons (second line)

If you cannot see syndication icons, you can check your products with `https://session-next.ft.com/products`. 'Products' should include 'S1'. If you do not have this product, email customer support at `help@ft.com` and ask to be added to a staff syndication licence `CA-00001558`.

If this is a problem for an individual, it is likely to be an issue with their contract (have they been removed by accident?)

Get their user ID, and check their product allowances on https://api.ft.com/users/USER_ID_HERE/products (if you've never used this you will need an api key - see pinned items on #api-tech-support channel for self-service key creation)

If they are attached to a syndication license they will have S1 in the list of product codes. If they don't have this, the problem is either with syndication set up or membership. If they do have this, the problem is more likely with us.

If this is a problem for all Syndication users it could be:

- Is the `syndication` flag on in our feature flags?
- A problem with the front end applications ([next-front-page](https://github.com/Financial-Times/next-front-page), [next-article](https://github.com/Financial-Times/next-article), [next-myft-page](https://github.com/Financial-Times/next-myft-page), [next-stream-page](https://github.com/Financial-Times/next-stream-page), [next-video-page](https://github.com/Financial-Times/next-video-page))
- A problem with o-teaser (which is the Origami component that displays syndication icons)
- A problem with x-teaser (<https://github.com/Financial-Times/x-dash>)
- A problem with [n-syndication](https://github.com/Financial-Times/n-syndication) which contains the logic for the icons
- A problem with [next-syndication-api](https://github.com/Financial-Times/next-syndication-api)
- A problem with Salesforce (all contracts live in Salesforce)
- A problem with [next-syn-list](https://github.com/Financial-Times/next-syn-list)

We can check the details of a specific contract and the user status page to begin to debug the issue. It is useful to tail the heroku logs for next-syndication-api while doing this so you can also see database activity with `heroku logs --app ft-next-syndication-api --tail --num 0 `

#### Conflict of uuids and email addresses

This could be caused too by the user already existing in the database with their old ID and the same email address. The database
uses the user ID as the primary key and the email address as a unique index. Therefore, when you try to add a new user
id with an email address that already exists, it will fail. The system isn’t designed to handle user IDs changing.This
can be fixed by making a backup, running a sql transaction script against the database, and then testing that all
references to the old ID had disappeared.

```shell
 BEGIN;
    UPDATE syndication.users SET user_id='newId' WHERE user_id='oldId';
    UPDATE syndication.contract_users SET user_id='newId' WHERE user_id='oldId';
    UPDATE syndication.downloads SET user_id='newId' WHERE user_id='oldId';
    UPDATE syndication.contract_unique_downloads SET user_id='newId' WHERE user_id='oldId';
    UPDATE syndication.contributor_purchase SET user_id='newId' WHERE user_id='oldId';
    UPDATE syndication.save_history SET user_id='newId' WHERE user_id='oldId';
    UPDATE syndication.saved_items SET user_id='newId' WHERE user_id='oldId';
    UPDATE syndication.migrated_users SET user_id='newId' WHERE user_id='oldId';
 COMMIT;
```

### Contract details not refreshing

First go to the `/syndication/contract-status?contract_id=${CONTRACT_NUMBER_HAVING_ISSUES}` and look for the `last_updated` property. You will need to have your 'role' set to 'superuser' or 'superdooperuser' in the syndication users table for this to return anything other than the contract you are on.

The API won't go query Salesforce unless the `last_updated` date is greater than 24 hours. So check the date. If you need to force a refresh, you can do so by connecting to the production DB, e.g. via TablePlus or PGAdmin, and running:

```sql

    UPDATE syndication.contracts
       SET (last_updated) = (now() - '25 hours'::interval)
     WHERE contract_id = 'CONTRACT_NUMBER_HAVING_ISSUES';
```

### Masquerading

Aside from saving and downloading content, you can masquerade as a different contract by passing `contract_id=${VALID_CONTRACT_NUMBER}` in the query string of any public endpoint defined that uses contract information.

See [server/middleware/masquerade.js](https://github.com/Financial-Times/next-syndication-api/blob/main/server/middleware/masquerade.js#L6) for implementation. You must have at least a `superuser` role in the syndication user table for this to work.

This also works for the `/republishing/contract` endpoint (part of https://github.com/Financial-Times/next-syn-list) and can be handy for viewing contract details when debugging.

### Save/Downloads not showing up

Check the `next-syndication-downloads-prod` SQS queue to see if the events have been processed.

Tail the logs and try saving/downloading an item.

#### Downloads not working

Downloads (served on host dl.syndication.ft.com) are run from the `ft-next-syndication-dl` app so that downloads don't run through router, preflight, etc. Check the `ft-next-syndication-dl` heroku app, make sure it's running, tail its logs and try downloading.

### Spanish Translations not available

Two places to check: the S3 bucket where translations are placed in XML format, and the content_es table in the syndication database where the article is saved as JSON.

Spanish Translations of articles are provided by a 3rd Party, Vanguard Publications. Our contact Merle Thorpe puts XML files into an S3 bucket (ft-article-translations-en-to-es-from-vanguard-publications), next-syndication-lambdas then listens for files being put in, transforms the files and inserts the translation into the database in a JSON format.

Every 6 months the AWS Access Key and Secret Key for allowing them to upload the XML files into S3 will need to be rotated and sent to Merle. The AWS User is called vanguard_publications and new credentials can be created in the AWS IAM console, Merle has a Lastpass account so new credentials can be sent via that.

They should have been given the credentials before the current ones expire so that they have a chance to switch.

### Emails not working

Emails are sent by the `db-persist` worker using nodemailer and gmail.

If you are getting an `ETIMEDOUT` errors, this is probably because the connection is being blocked by the FT firewall.

You can test this by running (from terminal):

```shell

    ~$ openssl s_client -crlf -connect smtp.gmail.com:465

```

The last line of your out put should look something like this:

```shell

    220 smtp.gmail.com ESMTP q4sm4655414wmd.3 - gsmtp

```

If the last line of your output looks more like this:

```shell

    connect: Operation timed out
    connect:errno=60

```

Then you can't connect to the mail server.

Try turning wifi off on your phone to tether your computer to your phone's 4G connection and you should find it now works.

### Dealing with `no pg_hba.conf entry` - `Syndication database data integrity` errors

Turns out that our Database Integrity healthcheck (db-sync-state) runs against review branches, as well as production. The `DATABASE_URL` secret is not stored in Doppler; it automatically added by the Postgres add-on. However, this secret is only added to the `prod` app's secrets. If you encounter this error, this is most likely the database secrets were updated. To fix this, you need to get the `DATABASE_URL` secret from the `prod` app, and add it to the review apps' secrets. To do this, go to Heroku's next-syndication-api main pipeline page, click "Configure" in the `Review Apps` column, then select `More settings`. In the `Settings` page, scroll down to `Reveal Config Vars`, reveal the vars and add the `DATABASE_URL` secret

### General tips for troubleshooting Customer Products Systems

- [Out of hours runbook for FT.com (wiki)](https://customer-products.in.ft.com/wiki/Out-of-hours-troubleshooting-guide)
- [General tips for debugging FT.com (wiki)](https://customer-products.in.ft.com/wiki/Debugging-Tips).
- [General information about monitoring and troubleshooting FT.com systems (wiki)](https://customer-products.in.ft.com/wiki/Monitoring-and-Troubleshooting-systems)

## Monitoring

[General information about monitoring and troubleshooting FT.com systems (wiki)](https://customer-products.in.ft.com/wiki/Monitoring-and-Troubleshooting-systems)

### Grafana

[Syndication API Dashboard](http://grafana.ft.com/d/P1fH18Kiz/ft-com-heroku-apps?orgId=1&var-app=syndication-api)

### Pingdom

- [next-syndication-api--eu-gtg](https://my.pingdom.com/reports/responsetime#daterange=7days&tab=uptime_tab&check=4897636)
- [User Rights US Service reachable](https://my.pingdom.com/reports/responsetime#daterange=7days&tab=uptime_tab&check=7834166)
- [User Rights EU Service reachable](https://my.pingdom.com/reports/responsetime#daterange=7days&tab=uptime_tab&check=7834226)
- [Licence Service reachable](https://my.pingdom.com/reports/responsetime#daterange=7days&tab=uptime_tab&check=7834275)
- [User Profile Service US reachable](https://my.pingdom.com/reports/responsetime#daterange=7days&tab=uptime_tab&check=7834360)
- [User Profile Service EU reachable](https://my.pingdom.com/reports/responsetime#daterange=7days&tab=uptime_tab&check=7834372)
- [Auth Service US reachable](https://my.pingdom.com/reports/responsetime#daterange=7days&tab=uptime_tab&check=7834376)
- [Auth Service EU reachable](https://my.pingdom.com/reports/responsetime#daterange=7days&tab=uptime_tab&check=7834387)

### Splunk searches

- [index="heroku" source="next-syndication-api" sourcetype="heroku:app"](https://financialtimes.splunkcloud.com/en-US/app/search/search?q=search%20index%3D%22heroku%22%20source%3D%22next-syndication-api%22%20sourcetype%3D%22heroku%3Aapp%22&display.page.search.mode=smart&dispatch.sample_ratio=1&earliest=-1h&latest=now&workload_pool=standard_perf&sid=1667810937.23521460)
- Salesforce failures can be found as [index="heroku" source="next-syndication-api" sourcetype="heroku:app" salesforce error](https://financialtimes.splunkcloud.com/en-US/app/search/search?q=search%20index%3D%22heroku%22%20source%3D%22next-syndication-api%22%20sourcetype%3D%22heroku%3Aapp%22%20salesforce%20error&display.page.search.mode=smart&dispatch.sample_ratio=1&workload_pool=standard_perf&earliest=-1h&latest=now&sid=1667810888.23521046), `NullApexResponse` is in the error message specifically for the call to Salesforce

## Failover Architecture Type

None

## Failover Process Type

NotApplicable

## Failback Process Type

NotApplicable

## Failover Details

This is a single region application so no failover is possible

## Data Recovery Process Type

Manual

## Data Recovery Details

A database backup happens every hour at 7 minutes past the hour, and the result outputted to s3 (arn:aws:s3:::next-syndication-db-backups).
<https://github.com/Financial-Times/next-syndication-db-schema#restoring-on-production-from-backup>

## Release Process Type

FullyAutomated

## Rollback Process Type

Manual

## Release Details

This app is hosted on Heroku and released using Circle CI.
Rollback is done manually on Heroku or Github. See [the guide on the wiki](https://customer-products.in.ft.com/wiki/How-does-deploying-our-Heroku-apps-work%3F) for instructions on how to deploy or roll back changes on Heroku.

## Key Management Process Type

PartiallyAutomated

## Key Management Details

You can read about how to rotate an AWS key [over on the Customer Products Wiki](https://customer-products.in.ft.com/wiki/Rotating-AWS-Keys)
See the Customer Products [key management and troubleshooting wiki page](https://customer-products.in.ft.com/wiki/Key-Management-and-Troubleshooting)
