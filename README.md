# Doodle Discord bot

**Note:**
This is mainly a personal bot. I do not guarantee it works and it probably won't get any new features or updates/maintainance.

## Usage

Rename the `config.json.dist` to `config.json` and set your own bot token.

You can find a Docker image here: https://hub.docker.com/repository/docker/saitho/discord-doodle-bot
Make sure to mount the config.json at `/app/config.json` and the SQLite database at `/app/dist/database.sqlite3`.

---

## Commands

### Doodle

#### doodle-add

Add a new Doodle link

Format: `.doodle-add <url> or @saibot#5262 doodle-add <url>`

#### doodle-list

List all Doodle links

Format: `.doodle-list`

#### doodle-remove

Remove a Doodle link

Format: `.doodle-remove <url>`

#### doodle-update

Update an existing Doodle link's data

Format: `.doodle-update <url>`

### Trigger

#### trigger-check

Checks status of polls and trigger if necessary (Usable only in servers)

Format: `.trigger-check`

#### trigger-list

List all Triggers

Format: `.trigger-list`

#### trigger-add

Add a new Doodle trigger

Format: `.trigger-add <code> <condition> <message> [channel] [removeAfterExecution]`

Arguments:
- code (string) = The Doodle code from URL
- condition (string) = The condition that has to be matched in order to trigger. template functions available, see below
- message (string) = the message to send. template functions available, see below
- time (string) = time at which trigger is checked (crontab format)
- channel (string) = the channel to send the message to. if none given it will be send where the check-command was triggered
- removeAfterExecution (boolean) = whether to remove the trigger after it was executed (defaults to true)

Examples:

Send message to #dev channel if more than 1 person said yes for date 2020-09-15. Checks every minute:
```
.trigger-add c46457x3iyz5ue6w "${poll.results.get('2020-09-15').yes > 1" "${poll.results.get('2020-09-15').yes} people are available" "* * * * *" #dev
```

Send message to @foobar user if more than 3 people might be available tomorrow. Checks every day at 00:00am:
```
.trigger-add c46457x3iyz5ue6w "${r.yes(d.tomorrow) + r.maybe(d.tomorrow) > 3" "${r.yes(d.tomorrow)} people are available tomorrow and ${r.maybe(d.tomorrow)} may be" "0 0 0 * * *" @foobar
```

#### trigger-remove

Remove a trigger by ID. The ID is displayed after a trigger is created and in the trigger list.

Format: `.trigger-remove <trigger-id>`

#### trigger-toggle

Toggle a trigger (enable/disable). Disabled triggers are ignored in execution.

Format: `.trigger-toggle <trigger-id>`

## Template functions

In trigger condition and message you can use the following template functions.
You can use these to access certain information about the poll or participants to use in the condition or message.

### results / r

* `r.yes(date: string)`: number – Number of people that are available at given date
* `r.no(date: string)`: number – Number of people that are unavailable at given date
* `r.maybe(date: string)`: number – Number of people that may be available at given date
* `r.undecided(date: string)`: number – Number of people that have not voted at given date yet (only works if dates are added after they have already voted)
* `r.yesUser(date: string)`: string[] – List of participant names that are available at given date
* `r.noUser(date: string)`: string[] – List of participant names that are unavailable at given date
* `r.maybeUser(date: string)`: string[] – List of participant names that may be available at given date
* `r.undecidedUser(date: string)`: string[] – List of participant names that have not voted yet (only works if dates are added after they have already voted)

### date / d

* `d.today` - Today's date in format YYYY-MM-DD
* `d.tomorrow` - Tomorrow's date in format YYYY-MM-DD
* `d.yesterday` - Yesterday's date in format YYYY-MM-DD
* `d.plusDays(days: number)` - Date today + given days in format YYYY-MM-DD
* `d.thisWeek` - Date range for current week. Result has to match every day in the range to be considered relevant.
* `d.nextWeek` - Date range for next week. Result has to match every day in the range to be considered relevant.

### user / u

* `u.mention(userName: string)`: string – Mention a given user name (regular `@Username` may not work – use `${u.mention('Username')}`!)

### poll / p (mainly internal use)

* `p.results`: Map<string, PollResult> (use `results` instead)
* `p.participant`: Map<string, DiscordParticipant>
