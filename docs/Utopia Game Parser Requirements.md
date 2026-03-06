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

Province News is the news feed visible to a single province — a chronological log of external events affecting that province (incoming attacks, thievery, spells, aid, monthly summaries, etc.). It is distinct from Province Logs, which records actions the province itself initiates.

### Input Format

* Province News lines use the format `Month Day of YR##[tab]Event text` (note "of YR" with the word "of", distinguishing it from Province Logs which use "Month Day, YR##")
* Lines that do not match the date-tab pattern should be ignored (e.g. a pasted header line)
* The date prefix including the tab should be stripped before processing each line
* Empty lines should be ignored

### Detection

Province News input can be auto-detected by the presence of lines matching `Month Day of YR[digit]` combined with phrases such as "have settled X acres of new land", "Our mages noticed a possible spell attempt", or "We have found thieves causing trouble".

### Supported Event Types

#### Monthly Land Exploration

* Pattern: `"Our people decided to explore new territories and have settled X acres of new land."`
* Occurs on day 1 of each in-game month
* Extract: acres settled (integer)

#### Monthly Income Summary

* Pattern: `"Your people appreciate the [adjective] dedication and time devoted to them in the last month and have worked harder to generate X,XXX gold coins. Additionally, your scholars have been busy, contributing X,XXX books to your growing library of knowledge."`
* Occurs on day 1 of each in-game month
* Extract: gold coins generated (integer), books contributed (integer)

#### New Scientist Recruited

* Pattern: `"A new scientist, Recruit [Name] ([Field]), has emerged and has joined our academic ranks."`
* Extract: scientist name, field (e.g. Economy, Arcane Arts, Military)

#### Aid Received

* Runes: `"We have received a shipment of X,XXX runes from [Province] ([Kingdom])."`
* Gold coins: `"We have received a shipment of X,XXX gold coins from [Province] ([Kingdom])."`
* Bushels: `"We have received a shipment of X,XXX bushels from [Province] ([Kingdom])."`
* Explore pool acres: `"We have received a shipment of X acres (Y acres lost!) from [Province] ([Kingdom])."`
  * Extract both the gross shipment and the acres-lost value separately
* Extract for all: amount, resource type, sender province name, sender kingdom

#### Resources Stolen

* Runes: `"X,XXX runes of our runes were stolen!"`
* Gold: `"X,XXX gold coins were stolen from our coffers!"`
* Extract: amount, resource type

#### Thievery Detected

* Known source: `"We have found thieves from [Province] ([Kingdom]) causing trouble within our lands!"`
* Unknown source: `"We have found thieves causing trouble within our lands. Unfortunately, we know not where they came from."`
* Shadowlight revealed thief (prevented): `"Shadowlight has revealed thieves from [Province] ([Kingdom]) causing trouble and prevented what may have been a successful operation within our lands!"`
  * These operations were prevented — count them separately from successful detections
* Extract: source province and kingdom (when known), whether it was a Shadowlight intercept

#### Spell Attempts Detected

* Pattern: `"Our mages noticed a possible spell attempt by [Province] ([Kingdom]) causing trouble on our lands!"`
* Some lines are prefixed with: `"Your spell is disrupted by the natural leyline energies surrounding the target's Faery province, causing it to fail completely. "` — strip this prefix and count the spell attempt normally
* Extract: source province and kingdom

#### Shadowlight — Attacker Identified

* Pattern: `"Shadowlight has revealed that [Province] ([Kingdom]) was responsible for this attack."`
* This reveals the attacker for an otherwise anonymous attack — track separately from thief revelations

#### Attacks Suffered

All attack lines begin with optional modifier text followed by the core battle report. The core pattern is:

`"Forces from [Province/Number - Province] ([Kingdom]) came through and ravaged our lands! They [captured X acres | looted X,XXX books]! [Savages! ]We lost [troop counts] in this battle. [optional aftermath text]"`

* **Land capture**: `"They captured X acres!"`
* **Learn attack** (books looted): `"They looted X,XXX books! Savages!"`
* Extract: attacker province (with number prefix if present), attacker kingdom, acres captured or books looted (whichever applies), troop losses by type (soldiers, Druids, Beastmasters, Magicians, peasants)

Optional modifiers that may prefix or append to the core line:
* `"Multiple enemy generals coordinate their assault with ruthless precision, leaving your forces in disarray and suffering catastrophic casualties."` — prefix indicating a multi-general (ambush) attack
* `"The enemy's ferocious battle cry tore through our ranks, leaving X of our population dead in its wake."` — suffix, extract additional peasant deaths
* `"It appears we have a turncoat General commanding our forces my Liege, his ill command of our forces has resulted in increased military casualties."` — suffix, note turncoat general involvement

#### Mana Disruption

* Lasting: `"Our Wizards' ability to regain their mana has been disrupted! Our mana recovery will be affected for X days!"`
  * Extract: duration in days
* Instant recovery: `"Our Wizards' ability to regain their mana has been disrupted! Fortunately, our Wizards recovered quickly and remain unaffected."`
  * Count as a disruption event but note no lasting effect (0 days affected)

#### Meteor Shower

* Start: `"Meteors rain across our lands, and are not expected to stop for X days."`
  * Extract: expected duration
* Daily damage: `"Meteors rain across the lands and kill X peasants[, X soldiers][, X Magicians] and X Beastmasters!"`
  * Extract: peasants, soldiers, Magicians, Beastmasters killed (each optional except at least one type)
  * Aggregate total casualties across all meteor damage lines

#### Rioting

* Pattern: `"Rioting has started amongst our people. Our tax collection efforts will be hampered for X days!"`
* Extract: duration in days; count occurrences

#### Pitfalls

* Pattern: `"Pitfalls are haunting our lands for X days, causing increased defensive losses during battle."`
* Extract: duration in days; count occurrences

#### Soldier Upkeep Demands

* Pattern: `"Enemies have convinced our soldiers to demand more money for upkeep for X days."`
* Extract: duration in days; count occurrences

#### Troop Desertion

* Pattern varies by troop type:
  * `"X wizards of our wizards abandoned us hoping for a better life!"`
  * `"X of our specialist troops abandoned us hoping for a better life!"`
  * `"X [TroopType] abandoned us hoping for a better life!"` (e.g. Beastmasters)
* Extract: count and troop type; aggregate total desertions

#### Turncoat General Discovered

* Pattern: `"We have discovered a turncoat general leading our military. He has been executed for treason!"`
* Count occurrences

#### Failed Propaganda

* Pattern: `"Enemies attempted to spread propaganda among our soldiers, but failed to convert any of them."`
* Count occurrences

#### War Outcomes

* Land penalty: `"My, Liege, as a result of our failed war we must give up some land to our enemy and to help rebuild our Kingdom we will re-allocate some of our land to assist our Kingdom's effort to rebuild. We have given up X acres of our total land. X acres has gone to our enemies as tribute from our withdrawal and X acres for our Kingdom to utilize and provide to those most in need."`
  * Extract: total acres given up, acres to enemies, acres redistributed
* Resource bonus: `"My, Liege, as a result of our war we have been provided an amalgam of resources. We have received X free building credits to rebuild our lands. We have received X free specialist credits to train our military. We have received X science books to further our academic research."`
  * Extract: building credits, specialist credits, science books

### Output Format

The Province News output is organized into the following sections (all optional — omit any section with no data):

#### Header

```
Province News Report
[First date in log] - [Last date in log] ([N] days)
```

#### Monthly Land

```
Monthly Land:
[Month Year]: [X] acres
[Month Year]: [X] acres
...
Total: [X] acres
```

#### Monthly Income

One line per month:

```
Monthly Income:
[Month Year]: [X,XXX] gold, [X,XXX] books
...
```

#### Scientists

```
Scientists ([N] total):
[Name] ([Field])
...
```

#### Aid Received

```
Aid Received:
Runes: [X,XXX] (from [N] shipments)
Gold: [X,XXX]
Bushels: [X,XXX]
Explore Pool: [X] acres ([Y] acres lost in transit)
```
Only show resource types with a non-zero total. List sender breakdown below each resource total if more than one sender.

#### Resources Stolen

```
Resources Stolen:
[X,XXX] runes
[X,XXX] gold coins
```
Only show resource types with a non-zero total.

#### Thievery

```
Thievery:
[N] operations detected ([N] from unknown sources)
[N] operations intercepted by Shadowlight
```
If any operations came from known sources, list them:
```
  [Province] ([Kingdom]): [N]
  ...
```

#### Spell Attempts

```
Spell Attempts: [N]
  [Province] ([Kingdom]): [N]
  ...
```
Unknown sources omitted from breakdown.

#### Shadowlight Attacker IDs

```
Shadowlight Attacker IDs:
  [Province] ([Kingdom])
  ...
```

#### Attacks Suffered

```
Attacks Suffered: [N] ([X] acres lost, [X,XXX] books looted)
  [Attacker Province] ([Kingdom]): [X] acres
  [Attacker Province] ([Kingdom]): [X,XXX] books (learn)
  ...
```
Total acres and total books shown in the header line.

#### Hazards & Events

```
Hazards & Events:
Meteor shower: [N] days of damage, [X,XXX] total casualties (peasants: X, soldiers: X, Magicians: X, Beastmasters: X)
Rioting: [N] occurrence(s), hampered tax for [X] days total
Pitfalls: [N] occurrence(s)
Mana disruptions: [N] (affecting [X] days total)
Troop desertions: [X] troops ([breakdown by type if multiple types])
Turncoat general(s) executed: [N]
Failed propaganda attempts: [N]
```
Only show lines with non-zero counts.

#### War Outcomes

```
War Outcomes:
Land given up: [X] acres ([X] to enemies, [X] redistributed)
Resources received: [X] building credits, [X] specialist credits, [X,XXX] science books
```

### Special Rules

* A single log line may contain both a prefix modifier (e.g. "Multiple enemy generals...") and a core battle report — parse them as one event, not two
* The "Your spell is disrupted..." prefix on spell attempt lines should be stripped; the spell attempt still counts
* Meteor shower start and damage lines are part of the same event; count total casualties across all damage ticks
* Mana disruptions with instant recovery (0 days) are counted as events but contribute 0 to the total days affected

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
