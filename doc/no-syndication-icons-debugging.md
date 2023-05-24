# People can't see their syndication icons

Every so often, we will get requests for help because “the user isn’t seeing the green ticks” or “they should be able to syndicate videos and they can’t”. More often than not, the query is accompanied by the contract Id (generally starts with “FTS”) or the licence Id (a standard uuid). 

There can be many reasons for the above, generally something has been set incorrectly in Salesforce, once or twice we had a user who had two different uuids across systems (and the wrong one was in the Syndication database). 

This document contains instructions for a number of steps you may need to take to debug this.

[Figure out contract from the licence id](#figure-out-contract-from-the-licence-id)
[Figure out user from contract ID](#figure-out-user-from-contract-id-this-will-allow-you-to-find-someone-to-masquerade-as-if-you-need-to)
[When there’s a complaint that a specific asset isn’t available](#when-theres-a-complaint-that-a-specific-asset-isnt-available)

## Figure out contract from the licence id
Use heroku dataclip https://data.heroku.com/dataclips/fltxbwayytlwphksmxpoypterezu
Or query

```sql
SELECT *
FROM syndication.contract_data
WHERE licence_id = 'licence-id-here'
```

to get a list of contracts associated with a given licence. Many licences will have multiple contract IDs as a new contract is issued every year. If the query is about something happening “now”, look at the Start_date and End_date columns to find the current contract. 

## Figure out user from contract ID (this will allow you to find someone to masquerade as if you need to)
Use dataclip https://data.heroku.com/dataclips/qwxpmxpfivhqraccnfxxtlekxvdh
Or query

```sql
SELECT *
from syndication.contract_users
where contract_id='FTS-xxxxxxx';
```

Generally each contract will have one person with Owner `true` - this is the FT representative who “owns” the contract and the relationship with the client. If you need to figure out who this person is, you can use the GraphQL query to do this (more information on how to do this can be found [in Confluence](https://financialtimes.atlassian.net/wiki/spaces/Accounts/pages/7952433192/Make+a+call+to+a+membership+endpoint)). 

If there is only one person on the contract (and they turn out to be the FT representative), make sure to contact them - in at least one instance when the client was complaining about not having Syndication icons, it turned out that their contract only had the FT representative as a user - everyone else has been taken off - because the company didn’t pay their Syndication bill! It is not our responsibility to mediate this, but we should put the FT representative in touch with the person who is reporting the problem to us. 

## When there’s a complaint that a specific asset isn’t available 
(eg they are paying for videos but can’t syndicate them) you can run dataclip https://data.heroku.com/dataclips/fzvtaufwdnqvrfbkvgsilyjyfvgy

Query

```sql
SELECT *
FROM syndication.contract_data
WHERE contract_id =  'FTS-xxxxxxx'
```

to get a high level overview of the contract - the columns you’re interested in are Assets and Items. I need to admit I’m not entirely sure what the difference is between the two.

## To get more specific information about each asset 

Use dataclip https://data.heroku.com/dataclips/gnkoyftmwdkhbjkdgoijfvvbjjbl

```sql
SELECT * FROM syndication.contract_assets WHERE contract_id='FTS-xxxxxxx'
```

If the asset isn’t present in this dataclip, this means that either it hasn’t been correctly set up in Salesforce and needs to be ingested, ALS refresh needs to be, or for some reason Salesforce API is not giving us the correct information. Use the syndication API /contracts  endpoint to see what we’re getting from Salesforce. 

We had an incident where users couldn’t see the icons at all because the code wasn’t defensive enough - note, if this is the case nobody from that contract can see the icons. If you’ve gone through the above dataclips and everything looks as it should, open heroku’s syndication logs https://dashboard.heroku.com/apps/ft-next-syndication-api/logs , masquerade as one of the affected users and trail the logs to get the error (there’s a chance the error ends up in Splunk, but I find trailing the logs to be more cause-effect).

We had several cases where only one user (from several that are on the contract) couldn’t see the icons. This is an example of this happening https://financialtimes.slack.com/archives/C3LRB6JCE/p1676469538264649?thread_ts=1674487536.107369&cid=C3LRB6JCE. The root of the problem is a conflict between uuids and email addresses and can be fixed by following inscrutions in the [runbook's "Conflict of uuids and email addresses section"](../runbook.md#conflict-of-uuids-and-email-addresses)
