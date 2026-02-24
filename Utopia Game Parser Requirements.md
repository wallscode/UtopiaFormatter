# Utopia Game Parser Website Requirements

* This project is a static website with functionality to parse lines of text that is copied from Utopia which is an online text-based game.
* Utopia's main website is https://utopia-game.com/
* The guide for the game is https://utopia-game.com/guide/ which contains high level explanations of game concepts
* The wiki for the game is http://wiki.utopia-game.com/ which gives details on specific game mechanics including in some cases the formulas for calculating various aspects of the game.
* The website will be deployed in AWS using S3 and CloudFront with a Route53 domain.
  The environment should be set up to regularly sync with my git repository at https://github.com/wallscode/UtopiaFormatter with a standard development and production branching strategy with no need for a third quality assurance or staging environment.
  Deployments should happen to a dev environment which can simply be a different folder within the existing S3 bucket so long as the assets remain separate for each environment.
* When confirmed to be working changes can be promoted to a production environment through a standard merge to main branch.

## Overview of Kingdom News Parser Functionality

The parser will parse raw kingdom news text copied directly from the Utopia game interface and extract detailed attack information, generating comprehensive reports and summaries.

### Input Format

* Raw text copied from Utopia game interface containing individual news entries
* Each entry starts with a date prefix (e.g., "February 2, YR0")
* Contains unformatted attack descriptions and game events
* Requires parsing of attack types, provinces, and impacts to generate structured reports

### Date Details

* Applies to all news line items across both Kingdom and Province news.
* Dates in this game are formatted Month, Day of Month, Year (YR).
* There are only 7 months in a year with the months ranging from January to July.
* There are only 24 days in a month with the range being from 1 to 24.
* Years are always represented with in the format YR## with YR being immediately followed by either a one or two digit number starting at 0.

### Kingdom and Province details

* Kingdoms in this game are made up of up to 25 provinces.
* When represented in the game the province number is immediately followed by a dash and then the province name.  For example "1 - Holo Wolf (4:1)" would be province 1 named Holo Wolf in kingdom 4:1.
* Actions in this game are always reported with the attacking province first and the defending province second.
* Anonymous attacks use the format "An unknown province from Odd-lympics (3:7)" and should be attributed to "An unknown province"

### Attack Details

* Attack Details for actions that appear in kingdom news
* There are several types of attacks in this game.
  * Traditional March
  * Ambush
  * Conquest
  * Raze
  * Learn
  * Massacre
  * Plunder
  * Bounces
* Sometimes attacks are made anonymously and the attacking province is not specified but instead has text in the format of "An unknown province from Odd-lympics (3:7)" indicating the name of the kingdom from which the attack originated.  These types of attacks should be attributed to "An unknown province" when listing out provinces and their attack metrics.
* **Traditional March** (often shortened to Trad March) attacks are the most common and involve one province attacking another province and capturing acres of land.
  * The format of these attacks is either "21 - ticking time (5:1) captured 71 acres of land from 11 - Reese Severalspoon (2:11)." when the attack is successful and originates from kingdom 5:1 or "13 - Remove the firewood (5:5) invaded 5 - Time to play (5:1) and captured 48 acres of land." when the attack is successful and originates from a different kingdom hitting into 5:1.  In both of these examples the news is from the perspective of kingdom 5:1.
* **Conquest** attacks look almost identical to Traditional March attacks but include a comma after the attacking kingdom name for example "18 - Sushi Sampo Time (5:1), captured 60 acres of land from 6 - Teemo (2:11)." or when received by the kingdom from which the news was copied is in the format "13 - Remove the firewood (5:5), invaded 5 - Time to play (5:1) and captured 48 acres of land."
* **Ambush** attacks are when a province attacks another province to recapture land that was previously captured.  The format of these attacks is "19 - Tea time (5:1) recaptured 17 acres of land from 4 - Downhill (3:7)." where the first province is the one that is ambushing and the second province is the one that is being ambushed.  Ambush attacks when received by the kingdom from which the news was copied is in the format "4 - Downhill (3:7) ambushed armies from 1 - Time to Shine (5:1) and took 30 acres of land."
* **Raze** attacks are when a province attacks another province to destroy buildings and infrastructure but the land isn't actually captured or removed.  The format of these attacks is "14 - About time dude (5:1) invaded 15 - Snow Kayaking (3:7) and razed 133 acres of land." or when received by the kingdom from which the news was copied is in the format "1 - Uncontrolled Ice Screaming (3:7) razed 59 acres of 10 - Timeless Rock Band (5:1)." where the first province is the one that is razing and the second province is the one that is being razed.
  * Raze attack land calculation should be maintained separately from other acre calculations.
* **Learn** attacks are when a province attacks and steals science books instead of acres. The format of these attacks is "5 - Time to play (5:1) invaded and looted 12,220 books from 20 - Fist (4:1)." or when received by the kingdom from which the news was copied is in the format "15 - Max Tool Inc (2:6) attacked and looted 3,288 books from 18 - Sushi Sampo Time (5:1)."
  * The number of books looted should be maintained as a sum
* **Massacre** attacks are when a province attacks and kills enemy troops but doesn't capture any land. The format of these attacks is "14 - About time dude (5:1) killed 881 people within 16 - Nordic ice removal (3:7)." or when received by the kingdom from which the news was copied is in the format "4 - Downhill (3:7) invaded 18 - Sushi Sampo Time (5:1) and killed 833 people."
  * The number of people killed should be maintaned as a sum
* **Plunder** attacks are when a province attacks and steals resources but doesn't capture any land. The format of these attacks is "21 - ticking time (5:1) invaded and pillaged 6 - Theyre Eating the Babies (6:12)." or when received by the kingdom from which the news was copied is in the format "8 - Natalya Simonova (3:8) attacked and pillaged the lands of 20 - Its 5 OClock Somewhere (5:1)."
* **Bounces** are failed attacks and take the format of "5 - Time to play (5:1) attempted an invasion of 7 - Nordic Noodling (3:7), but was repelled."  These should count as attacks made but should not update the captured acres metric.

### Other actions:

There are other actions that show up in kingom news such as Dragons started, Dragons completed, Enemy dragons killed, Rituals started, and Rituals completed.

### Output Requirements for Kingdom News Report

The expected format for outputting results from Kingdom News is as follows:

The text "Kingdom News Report"

The date range and total number of days in the date range in the format "February 1, YR0 - April 2, YR0 (50 days)".  It's important to note the date details for this game which have already been provided above.

#### Overall summary

##### Own Kingdom Attacks Made Summary

An overall summary which contains the following summary information about all attacks made by the kingdom from which the news was copied:

* Count of total attacks made by the kingdom from which the news was copied as well as a sum of all land captured in those attacks (excluding razed land).
* Count of unique attacks made by the kingdom from which the news was copied.

  * Unique attacks are defined by a 6 day window from the first attack so that all attacks made within 6 in-game days of the first attack count as 1 unique attack and on the 7th in-game day, an attack made would count as a new unique attack.
  * The Unique attack day counter should be set as a variable so that it can be changed easily in the future.
* Count of traditional march attacks made by the kingdom from which the news was copied as well as a sum of all land captured through traditional march attacks by that kingdom.

  * The land captured through these attacks counts towards the overall land captured amount
  * If no traditional march attacks are detected, this can be left out of the summary
* Count of conquest attacks made by the kingdom from which the news was copied as well as a sum of all land captured through conquest attacks.

  * The land captured through these attacks counts towards the overall land captured amount
  * If no conquest attacks are detected, this can be left out of the summary
* Count of ambush attacks made by the kingdom from which the news was copied as well as a sum of all land captured through ambush.

  * The land captured through these attacks counts towards the overall land captured amount
  * If no ambush attacks are detected, this can be left out of the summary
* Count of raze attacks made by the kingdom from which the news was copied as well as a sum of all land razed through raze attacks.

  * This is a separate count of land from the land captured amount
  * If no raze attacks are detected, this can be left out of the summary
* Count of learn attacks made by the kingdom from which the news was copied as well as a sum of all books looted in these attacks.

  * If no learn attacks are detected, this can be left out of the summary
* Count of massacre attacks made by the kingdom from which the news was copied as well as a sum of people killed.

  * If no massacre attacks are detected, this can be left out of the summary
* Count of failed or bounced attacks as well as a percent failure rate which would be failed attacks over the total attacks made by the kingdom from which the news was copied.

  * If no bounced attacks are detected, this can be left out of the summary

##### Own Kingdom Attacks Suffered Summary

An overall summary which contains the following summary information about all attacks suffered by the kingdom from which the news was copied:

* Count of total attacks suffered by the kingdom from which the news was copied as well as a sum of all land captured in those attacks (excluding razed land).
* Count of unique attacks suffered by the kingdom from which the news was copied.

  * Unique attacks are defined by a 6 day window from the first attack so that all attacks made within 6 in-game days of the first attack count as 1 unique attack and on the 7th in-game day, an attack made would count as a new unique attack.
  * The Unique attack day counter should be set as a variable so that it can be changed easily in the future.
* Count of traditional march attacks suffered by the kingdom from which the news was copied as well as a sum of all land captured through traditional march attacks by that kingdom.

  * The land captured through these attacks counts towards the overall land captured amount
  * If no traditional march attacks are detected, this can be left out of the summary
* Count of conquest attacks suffered by the kingdom from which the news was copied as well as a sum of all land captured through conquest attacks.

  * The land captured through these attacks counts towards the overall land captured amount
  * If no conquest attacks are detected, this can be left out of the summary
* Count of ambush attacks suffered by the kingdom from which the news was copied as well as a sum of all land captured through ambush.

  * The land captured through these attacks counts towards the overall land captured amount
  * If no ambush attacks are detected, this can be left out of the summary
* Count of raze attacks suffered by the kingdom from which the news was copied as well as a sum of all land razed through raze attacks.

  * This is a separate count of land from the land captured amount
  * If no raze attacks are detected, this can be left out of the summary
* Count of learn attacks suffered by the kingdom from which the news was copied as well as a sum of all books looted in these attacks.

  * If no learn attacks are detected, this can be left out of the summary
* Count of massacre attacks suffered by the kingdom from which the news was copied as well as a sum of people killed.

  * If no massacre attacks are detected, this can be left out of the summary
* Count of failed or bounced attacks as well as a percent failure rate which would be failed attacks over the total attacks suffered by the kingdom from which the news was copied.

  * If no bounced attacks are detected, this can be left out of the summary

#### Summaries of each individual kingdom

Starting with the kingdom from which the news was copied this section will list the overview of each individual kingdom showing the following details:

* Kingdom identifier
* Total land exchanged for that specific kingdom which includes the difference between land captured and land lost to attacks suffered and also includes an indication of count of attacks made and count of attacks suffered
* List of provinces that have registered attacks outbound or inbound and for each includes the difference between land captured and land lost to attacks suffered and also includes an indication of count of attacks made and count of attacks suffered
* Unique Attacks List
  * List of provinces sorted by highest unique attacks count (based on the unique attack logic described above)
  * For each province show the province name and the number of unique attacks

#### Highlights Section

This section provides notable highlights and extreme values from the parsed kingdom news data, focusing on record-breaking performances and unusual occurrences. The highlights section should only be shown for the kingdom from which the news was copied (the "own kingdom").

##### Attack Performance Highlights

* **Most land gained in a single trad march**
  * Format: "Most land gained in a single trad march - [province number] - [province name]: [acres]"
  * Shows the province that achieved the highest land capture in a single traditional march attack
  * If no trad march attacks were made, this should not be shown

* **Most land lost in a single trad march**
  * Format: "Most land lost in a single trad march - [province number] - [province name]: [acres]"
  * Shows the province that suffered the highest land loss in a single traditional march attack
  * If no trad march attacks were suffered, this should not be shown

* **Most land gained in a single ambush**
  * Format: "Most land gained in a single ambush - [province number] - [province name]: [acres]"
  * Shows the province that achieved the highest land recapture in a single ambush attack
  * If no ambush attacks were made, this should not be shown

* **Most land lost in a single ambush**
  * Format: "Most land lost in a single ambush - [province number] - [province name]: [acres]"
  * Shows the province that suffered the highest land loss in a single ambush attack
  * If no ambush attacks were suffered, this should not be shown

##### Bounce Performance Highlights

* **Most bounces made**
  * Format: "Most bounces made - [province number] - [province name]: [count]"
  * Shows the province with the highest number of failed/bounced attacks made
  * If multiple provinces tie for the highest count, list all of them separated by commas
  * If no bounces were made, show "Most bounces made - : 0"

* **Most bounces received**
  * Format: "Most bounces received - [province number] - [province name], [province number] - [province name]: [count]"
  * Shows the province(s) that caused the most enemy attacks to bounce (i.e., enemies failed when attacking them)
  * If multiple provinces tie for the highest count, list all of them separated by commas before the colon
  * If no bounces were received, this should not be shown

##### Output Formatting Rules

* The highlights section should be titled "Highlights"
* Each highlight should be on its own line
* Province names should be shown exactly as they appear in the original text
* If a specific highlight category has no data (e.g., no ambush attacks), that highlight line should be omitted entirely
* The section should only include highlights that have actual data to report


## Overview of Province News Requirements

Will be added later

## Overview of Province Logs Requirements

The province logs parser will parse individual province log entries and extract and summarize various types of actions and events that occur within a province. Unlike kingdom news which shows interactions between provinces, province logs show the internal and external actions performed by or affecting a single province.

### Input Format

* Province logs consist of individual lines that start with a date prefix in the format "Month Day, YR##" followed by the log entry
* Each line should be parsed by removing the date prefix up to and including "YR" and the following number
* Lines that begin with a timestamp in "00:00" format (two-digit hour and two-digit minute) should be skipped
* Empty lines should be ignored

### Supported Event Types

#### Spell Casting

* The parser detects spells that begin casting by looking for the phrase "begin casting" in the log entry
* Each spell has specific text that identifies it and may have an impact value (such as duration, resources affected, etc.)
* Supported spells include:
  * **Offensive Spells**: Fireball, Lightning Strike, Amnesia, Land Lust, Tornadoes, Vermin, Fool's Gold, Nightmares, Blizzard, Explosions, Droughts, Pitfalls, Storms, Meteor Showers, Nightfall, Gluttony, Greed, Chastity, Mystic Vortex, Expose Thieves, Abolish Ritual
* For spells with impacts, the parser extracts the numerical value and unit (e.g., "493 days", "14,884 runes", "3,639 peasants")

#### Thievery Operations

* The parser detects successful thievery operations by looking for the phrase "Early indications show that our operation was a success"
* Each operation has specific identifying text and may track impacts such as acres burned, wizards assassinated, or duration of effects
* Supported operations include:
  * **Standard Operations**: Arson, Assassinate Wizards, Destabilize Guilds, Free Prisoners, Incite Riots, Kidnapping, Night Strike, Sabotage Wizards
  * **Special Operations**:
    * **Arson**: Tracks acres of buildings burned
    * **Bribe Generals**: Counts successful bribery operations
    * **Bribe Thieves**: Counts successful bribery operations
    * **Propaganda**: Tracks conversion of different troop types (thieves, soldiers, wizards, specialist troops, elites)

#### Resource Management

* **Aid Sent**: Parses lines containing "We have sent" to track resources sent to other provinces
  * Tracks: gold coins, bushels, runes, soldiers, explore pool acres
* **Resources Stolen**: Parses lines containing "Our thieves have returned with" or "Our thieves were able to steal"
  * Tracks: gold coins, bushels, runes, war horses

#### Special Events

* **Dragon Project**:
  * Tracks donations to dragon projects via "to the quest of launching a dragon" (gold coins and bushels)
  * Tracks troops sent to fight dragons via "the dragon is weakened by" (troops and points)
* **Rituals**: Counts successful ritual casts via "We are now closer to completing our ritual project"

### Output Requirements for Province Logs

The expected format for outputting results from Province Logs is as follows:

The text "Summary of Province Log Events"

A separator line of dashes (40 characters)

#### Thievery Summary

* Lists all thievery operations in descending order by frequency
* For operations with impacts, shows the count and total impact (e.g., "9 Arson for a total of 85 acres")
* For special operations:
  * **Propaganda**: Shows as "Propaganda:" with indented list of converted troop types and counts
  * **Bribe Operations**: Shows as "X Bribe Generals ops" or "X Bribe Thieves ops"
* Operations with zero count are omitted from the output

#### Resources Stolen

* Lists all stolen resources in descending order by value
* Format: "X,XXX resource stolen" (e.g., "1,404,731 gold coins stolen")
* Resources with zero count are omitted from the output

#### Spell Summary

* Lists all cast spells in descending order by frequency
* For spells with impacts, shows the count and total impact (e.g., "62 Meteor Showers for a total of 493 days")
* Spells with zero count are omitted from the output

#### Aid Summary

* Lists all sent aid resources in descending order by value
* Format: "X,XXX resource" (e.g., "5,072,494 gold coins")
* Resources with zero count are omitted from the output

#### Dragon Summary

* Shows gold coins donated (if any)
* Shows bushels donated (if any)
* Shows troops sent and points weakened (if any troops were sent)
* Format: "X,XXX troops sent and weakened by X,XXX points"

#### Ritual Summary

* Shows the total count of successful ritual casts
* Format: "X successful ritual casts"
* If no ritual casts are detected, this section should not be shown

## Overview of UI Requirements

* The user interface should be a modern UI and modern dark theme with hints of inspiration from the Utopia game website but be sure not to use any exact content from their site to prevent copyright claims.
* The UI should be mobile-responsive since half the users of this will be on mobile devices.
* Any functionality that includes copying text to a clipboard needs to support PC, Android, and iOS so that pasting into a WYSIWYG forum retains all line breaks and formatting.
* This site should avoid any known security vulnerabilities.
* This site should be ADA compliant and WCAG conformant as much possible without impeding core functionality.
* The text input box should support pasting any kind of text and the parser should be able to figure out whether it's Kingdom News or Province News based on the input.
  * The presence of any type of attack from the kingdom attacks section would indicate that it's Kingdom News.
  * The presence of "You have ordered" or "You have given orders to commence work" or "Your wizards gather" or "Early indications show that our operation" would indicate that it's Province News.
* There should be an output box that allows the user to highlight everything to copy it and paste it into a WYSIWYG forum.
* There should also be a button to allow the user to copy the contents of the output box to again paste it into a WYSIWYG forum.

### Advanced Parser Settings

* There should be an Advanced settings feature that only appears after parsing some text and is minimized by default when it does appear.
* The Advanced settings feature should dynamically change based on whether Kingdom News, Province Logs, or Province News as parsed.
* The Advanced settings feature should allow various formatting changes to be made such as:
  * For Kingdom News Output
    * Moving each of the sections of the output higher or lower in the list
    * Updating the number of days in the unique attacks calculation
    * Deciding whether to show learn, massacre, and plunder attacks in the output
    * Deciding whether to group uniques section with the corresponding kingdom attacks summary or having all the uniques sections at the bottom
    * Deciding whether to show additional actions like Dragons information and Ritual information
  * For Province Logs Output
    * Moving each of the sections of the output higher or lower in the list
    * Deciding whether to show science allocation summary info
    * Deciding whether to show military training info
    * Deciding whether to show self-spells
    * Deciding whether to show averages
  * For Province News Output
    * Moving each of the sections of the output higher or lower in the list
    * Deciding whether to show daily land in output
    * Deciding whether to show daily science and gc in the output
    * Deciding whether to show new scienctists in the output
