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

### People can't see their syndication icons

If syndication icons are not appearing for an idividual user (as opposed to all users) then it is likely this user is not on a licence or has been removed from a licence.
This system has an upstream dependency on Salesforce, so it is worth investigating the user's licence status there too. If the licence was recently renewed or set up, it is worth checking if they have been given the correct assets.

As an example an incident in February 2020 occurred because an `FTB Article` asset was added by the account manager instead of `FT Article`.

If _nobody_ can see their icons, then this is a more serious problem and should be pushed to Second Line.

## Second Line Troubleshooting

*   You can see the details of a specific contract by calling `GET https://www.ft.com/syndication/contracts/:contract_id` with a valid api key sent in `x-api-key` header. You can find the API key in Vault : `next` team, `next-syndication-api` project, `production` folder, the key is called `SYNDICATION_API_KEY`. The `:contract_id` should have the `FTS-xxxxxxxx` format.
*   `POST` call to `https://www.ft.com/syndication/contracts/:contract_id/resolve` with a valid api key and a json body which is an array of content ids will return the syndication permissions for each article

### People can't see their syndication icons

If this is a problem for an individual, it is likely to be an issue with their contract (have they been removed by accident?)

If this is a problem for all Syndication users it could be:

*   A problem with the front end applications ([n-front-page](https://github.com/Financial-Times/next-front-page), [next-article](https://github.com/Financial-Times/next-article))
*   A problem with o-teaser (which is the Origami component that displays syndication icons)
*   A problem with x-teaser (<https://github.com/Financial-Times/x-dash>)
*   A problem with this application
*   A problem with Salesforce (all contracts live in Salesforce)
*   A problem with [next-syn-list](https://github.com/Financial-Times/next-syn-list)

### General tips for troubleshooting Customer Products Systems

*   [Out of hours runbook for FT.com (wiki)](https://customer-products.in.ft.com/wiki/Out-of-hours-troubleshooting-guide)
*   [General tips for debugging FT.com (wiki)](https://customer-products.in.ft.com/wiki/Debugging-Tips).
*   [General information about monitoring and troubleshooting FT.com systems (wiki)](https://customer-products.in.ft.com/wiki/Monitoring-and-Troubleshooting-systems)

## Monitoring

[General information about monitoring and troubleshooting FT.com systems (wiki)](https://customer-products.in.ft.com/wiki/Monitoring-and-Troubleshooting-systems)

### Grafana

[Syndication API Dashboard](http://grafana.ft.com/d/P1fH18Kiz/ft-com-heroku-apps?orgId=1&var-app=syndication-api)

### Pingdom

* [next-syndication-api--eu-gtg](https://my.pingdom.com/reports/responsetime#daterange=7days&tab=uptime_tab&check=4897636)
* [User Rights US Service reachable](https://my.pingdom.com/reports/responsetime#daterange=7days&tab=uptime_tab&check=7834166)
* [User Rights EU Service reachable](https://my.pingdom.com/reports/responsetime#daterange=7days&tab=uptime_tab&check=7834226)
* [Licence Service reachable](https://my.pingdom.com/reports/responsetime#daterange=7days&tab=uptime_tab&check=7834275)
* [User Profile Service US reachable](https://my.pingdom.com/reports/responsetime#daterange=7days&tab=uptime_tab&check=7834360)
* [User Profile Service EU reachable](https://my.pingdom.com/reports/responsetime#daterange=7days&tab=uptime_tab&check=7834372)
* [Auth Service US reachable](https://my.pingdom.com/reports/responsetime#daterange=7days&tab=uptime_tab&check=7834376)
* [Auth Service EU reachable](https://my.pingdom.com/reports/responsetime#daterange=7days&tab=uptime_tab&check=7834387)

### Splunk searches

*   [index=heroku source="_syndication-api_"](https://financialtimes.splunkcloud.com/en-US/app/search/search?q=search%20index%3Dheroku%20source%3D%22*syndication-api*%22&display.page.search.mode=smart&dispatch.sample_ratio=1&earliest=-1h&latest=now&sid=1565272294.5309696)

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

## Heroku Pipeline Name

ft-next-syndication-api

## Key Management Process Type

PartiallyAutomated

## Key Management Details

You can read about how to rotate an AWS key [over on the Customer Products Wiki](https://customer-products.in.ft.com/wiki/Rotating-AWS-Keys)
See the Customer Products [key management and troubleshooting wiki page](https://customer-products.in.ft.com/wiki/Key-Management-and-Troubleshooting)
