# Syndication
- [Quick Overview](#quick-overview)
- [What do users see](#what-do-users-see)
    - [Syndication Icons](#syndication-icons)
    - [Republishing Platform](#republishing-platform)
- [Key systems](#key-systems)
    - [n-syndication](#n-syndication)
    - [next-syn-list](#next-syn-list)
    - [next-syndication-api](#next-syndication-api)
    - [next-syndication-dl](#next-syndication-dl)
    - [next-syndication-lambdas](#next-syndication-lambdas)
    - [Syndication PostgresDB](#syndication-postgresdb)
- [Diagrams](#diagrams)

## Quick Overview

Syndication (also known as Republishing), is the term for allowing other publishers to use our content in their own publications.

## What do users see
### Syndication Icons

Once the user has syndication licence, [ft.com](http://ft.com) appears sightly different. 

When on [ft.com](http://ft.com), users see coloured symbols next to the title of every article/podcast/video on the page.

![ft_homepage.png](https://github.com/Financial-Times/next-syndication-api/blob/master/doc/images/ft_homepage.png)

The symbols indicates different syndication grants:

![syndication_symbols.png](https://github.com/Financial-Times/next-syndication-api/blob/master/doc/images/syndication_symbols.png)

On clicking on the `green tick` icon, the user can save or download the content

![syndication_modal.png](https://github.com/Financial-Times/next-syndication-api/blob/master/doc/images/syndication_modal.png)

### Republishing Platform

On the top right corner on the page, the `Republishing` link takes users to the republishing platform.

![republishing_menu.png](https://github.com/Financial-Times/next-syndication-api/blob/master/doc/images/republishing_menu.png)

On the republishing tool, Users can see their contract details, allowance details and select their preferred download format.

![republishing_platform.png](https://github.com/Financial-Times/next-syndication-api/blob/master/doc/images/republishing_platform.png)

Users can also manage saved, downloaded and Spanish content.

## Key systems

### [**n-syndication**](https://github.com/Financial-Times/n-syndication)

This is the client side library responsible for adding syndication symbols next to article/podcast and video headlines on ft.com. Allowing syndication customers to download or save content for republishing.

**What it does**

- Checks if logged in user is a syndication user
- Gets all the `contentIds` from the DOM

![get_content_ids_snippet.png](https://github.com/Financial-Times/next-syndication-api/blob/master/doc/images/get_content_ids_snippet.png)

- Passes them to [next-syndication-api](https://github.com/Financial-Times/next-syndication-api/tree/master/doc#post-syndicationresolve) to get the syndication data for each content ID

![syndication_api_response_snippet.png](https://github.com/Financial-Times/next-syndication-api/blob/master/doc/images/syndication_api_response_snippet.png)

- Uses the response to put the syndication symbols

### [**next-syn-list**](https://github.com/Financial-Times/next-syn-list)

This is the application for the Republishing platform.

### [**next-syndication-api**](https://github.com/Financial-Times/next-syndication-api)

This is the REST API responsible for powering Syndication. It lives in Heroku with a Postgres DB attached. It handles requests from `n-syndication` and `next-syn-list`. It also runs some Cron jobs and sync tasks.

Here are the available [API endpoints](https://github.com/Financial-Times/next-syndication-api/tree/master/doc)

**What it does**
- Manages connection and interactions with attached Postgres DB
- Stores most of its data in the Postgres DB
- Periodically updates information about contracts with up to date data from salesforce.
- Data about saved and downloaded content is added to the DB
- It stores Personal Identifiable Information (Membership API were flaky)


**Cron Jobs**
- **Backup**
    - Runs [periodically](https://github.com/Financial-Times/next-syndication-api/blob/master/config/default.yaml#L41).
    - Export database schema, zips it and uploads it to the `production` folder of the `next-syndication-db-backups` bucket on AWS (FT Infra Prod account).
- **Redshift**
    - Runs [periodically](https://github.com/Financial-Times/next-syndication-api/blob/master/config/default.yaml#L42).
    - Export analytics and uploads it to the `redshift` folder of the `next-syndication-db-backups` bucket on AWS (FT Infra Prod account).
- **Tidy-Bucket**
    - Runs [periodically](https://github.com/Financial-Times/next-syndication-api/blob/master/config/default.yaml#L43).
    - Deletes backup and redshift files older than one month from the S3 bucket.

The cron jobs are defined [here](https://github.com/Financial-Times/next-syndication-api/tree/master/worker/crons)


**Sync Tasks**
- **content-es**
    - Subscribes to `next-syndication-translations` SQS on AWS(FT Infra Prod account).
    - When a `created` event is triggered, the content is created / updated in the PostgresDB .
    - When a `deleted` event is triggered, the content is marked as deleted in the PostgresDB.

- **db-persist**
    - Subscribes to `next-syndication-downloads-prod` SQS on AWS(FT Infra Prod account).
    - When save, unsave, and download event is triggered, the event is
        - Written into the PostgresDB
        - Published to Spoor
        - For download event that requires contributor payment, an email is sent to syndication@ft.com containing content, user and contract data.

The sync tasks are defined [here](https://github.com/Financial-Times/next-syndication-api/tree/master/worker/sync)

### [**next-syndication-dl**](https://github.com/Financial-Times/next-syndication-dl)

Deploys `next-syndication-api` for the purposes of running the downloads as a separate application.


### [**next-syndication-lambdas**](https://github.com/Financial-Times/next-syndication-lambdas)
- Serverless application
- One function - transformXml
- Used for Spanish content

**How does it work - Spanish Content**

- A 3rd Party, Vanguard Publications translates the articles
- They upload the XML file into an S3 bucket called **ft-article-translations-en-to-es-from-vanguard-publications**
- This triggers a Lambda function which transforms the XML into JSON and puts it in another S3 bucket called **ft-next-content-translations**
- That triggers an event (on create and delete), which prompts the syndication-api to go and fetch the content, and upserts it into the Postgres DB (**syndication.content_es**)

### [**Syndication PostgresDB**](https://github.com/Financial-Times/next-syndication-db-schema)

## Diagrams

### High Level Architecture

[Syndication | Lucidchart](https://app.lucidchart.com/invitations/accept/1166b19b-7ad0-4cf7-a679-3cfa3a618d76)

### Cron Jobs

[Syndication - Cron Jobs | Lucidchart](https://app.lucidchart.com/invitations/accept/5ab2ecac-3235-4aa0-a325-f71526ace32b)

### Sync Tasks

[Syndication - Sync Tasks | Lucidchart](https://app.lucidchart.com/invitations/accept/6b57996f-8927-416a-8d25-deeb76755798)

### Display Syndication Icons on FT.com

[Financial-Times/next-syndication-api](https://github.com/Financial-Times/next-syndication-api/blob/master/doc/02%20Display%20Syndication%20Icons%20on%20FT.com.png)

### Authenticate Syndication User and Contract

[Financial-Times/next-syndication-api](https://github.com/Financial-Times/next-syndication-api/blob/master/doc/03%20Authenticate%20Syndication%20User%20and%20Contract.png)

### Save for later

[Financial-Times/next-syndication-api](https://github.com/Financial-Times/next-syndication-api/blob/master/doc/04%20Save%20for%20Later.png)

### Download

[Financial-Times/next-syndication-api](https://github.com/Financial-Times/next-syndication-api/blob/master/doc/05%20Download.png)
