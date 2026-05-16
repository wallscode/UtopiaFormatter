---
id: Uto-8w3l
status: closed
deps: []
links: []
created: 2026-05-16T12:01:53Z
type: task
priority: 2
assignee: Jamie Walls
---
# Calculate Attacker Impact Ratings

Help me come up with a forumla for calculating the Attacker Impact ratings.  Right now the default is 1 point each for acres captured, acres razed, and people massacred.  It also counts land capture attacks, raze attacks, and massacre attacks but right now the default for those is also 0.  

I want to figure out what the appropriate default multipliers should be for each of these metrics.  The goal of the Attacker Impact ratings is to show which province did the most damage to the opposing kingdom.

Things that cause the most impact are:
- Attacks targeting a chained province.  A chained province is one that has been hit multiple times in a row.  We can add a setting under the Impact Ranking Weights section called Chain Threshold that defines the number of attacks on a target to consider that target a chain target and it should default to 10.  All attacks before and after the first 10 should count as attacks on a chain target.
- Attacks of type massacre are typically performed on provinces that are primarily thief and mage provinces who have a higher defense and very limited or no offensive power.  That is usually evidenced by that province having no or very few attacks showing up in the news.  When an attacker performs a massacre attack on them, it usually requires them to send a lot of offense which means they don't have as much to send on other attacks.
- A high volume of attacks in general 
- High volume of attacks in short succession on the same province or other chain target provinces.  This causes those provinces to lose land quickly which in turn causes them to become overpopulated which in turn causes military troops to desert.

Things that are typically not impactful:
- Attacks on provinces that are not chain targets
- Low volumes (typically 1 or 2) of attacks on a province that no one else is hitting.
- Failed attacks are especially not impactful because while they may kill some troops, they don't capture any land.  These should likely have a negative impact score count.

Other important notes:
- Raze attacks are attacks where the province that was hit doesn't lose the land but loses the buildings built on that land.  They are impactful, but not as impactful as land capture attacks. So the scoring should consider this.
- Chain targets hit repeatedly and in quick succession over the course of a few in-game days should be weighted higher than random attacks 24 or more in-game days later.
- When a thief and mage province is massacred we don't really want land attacks to follow.  When a thief and mage province is hit for land, that actually helps the thief and mage province because it increases their count of thieves and mages per acre.  Attacks for land on a thief and mage province near the end of the war are fine since the war was likely going to end soon anyway, but those attacks done in the middle of a war are considered bad.
- Hitting a thief and mage province for land early in the war is a standard strategy that some kingdoms do to negatively impact the economy of that province, so those should count as standard attacks.  But land attacks shortly after massacre attacks especially in the middle of the war are bad.

Below is an example of the Kingdom News data that we have available to us. In this data you can see that Kingdom 5:7 declared as the chain targets provinces 1 - Test of Time (2:6) and 2 - Entry Team (2:6) at the start.  The next chain target was 11 - Lord 4A Day (2:6). The next chain target was 18 - The Kipling Poem (2:6). Then the next chain target was Blood into lead (2:6).  The thief mage provinces targeted with massacres were 23 - GCode (2:6), 3 - no more petrol (2:6), and 7 - Into the Sun (2:6).

July 4 of YR1	An unknown province from This was a BAD IDEA (5:7) captured 45 acres of land from 2 - Entry Team (2:6).
July 4 of YR1	An unknown province from This was a BAD IDEA (5:7) attempted an invasion of 2 - Entry Team (2:6), but was repelled.
July 4 of YR1	2 - New Credit Card in a Bookstore (5:7) captured 53 acres of land from 2 - Entry Team (2:6).
July 4 of YR1	19 - One more snooze (5:7) captured 44 acres of land from 2 - Entry Team (2:6).
July 4 of YR1	Unnamed kingdom (2:6) has begun the Emerald Dragon project, Great idea incoming, against us!
July 4 of YR1	We have declared WAR on Unnamed kingdom (2:6)!
July 4 of YR1	3 - Razor across my throat (5:7) captured 67 acres of land from 1 - Test of Time (2:6).
July 4 of YR1	2 - New Credit Card in a Bookstore (5:7) captured 60 acres of land from 2 - Entry Team (2:6).
July 4 of YR1	15 - Saying Yes (5:7) captured 62 acres of land from 1 - Test of Time (2:6).
July 4 of YR1	10 - Red Apple (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 43 acres of land.
July 4 of YR1	15 - Saying Yes (5:7) captured 52 acres of land from 1 - Test of Time (2:6).
July 4 of YR1	15 - Saying Yes (5:7) captured 45 acres of land from 1 - Test of Time (2:6).
July 4 of YR1	4 - Line Stepping (5:7) captured 39 acres of land from 1 - Test of Time (2:6).
July 4 of YR1	12 - Self-Taught Proctologist (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 61 acres of land.
July 4 of YR1	4 - Line Stepping (5:7) captured 33 acres of land from 1 - Test of Time (2:6).
July 4 of YR1	4 - Line Stepping (5:7) captured 29 acres of land from 1 - Test of Time (2:6).
July 4 of YR1	5 - Kite Fying In The Rain (5:7) captured 23 acres of land from 1 - Test of Time (2:6).
July 4 of YR1	7 - Into the Sun (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 52 acres of land.
July 4 of YR1	5 - Kite Fying In The Rain (5:7) captured 20 acres of land from 1 - Test of Time (2:6).
July 4 of YR1	4 - Line Stepping (5:7) captured 18 acres of land from 1 - Test of Time (2:6).
July 4 of YR1	5 - Kite Fying In The Rain (5:7) captured 16 acres of land from 1 - Test of Time (2:6).
July 4 of YR1	8 - Blood into lead (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 24 acres of land.
July 4 of YR1	5 - Kite Fying In The Rain (5:7) captured 16 acres of land from 1 - Test of Time (2:6).
July 4 of YR1	7 - Playing Utopia (5:7) captured 12 acres of land from 1 - Test of Time (2:6).
July 4 of YR1	7 - Into the Sun (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 42 acres of land.
July 4 of YR1	7 - Playing Utopia (5:7) captured 12 acres of land from 1 - Test of Time (2:6).
July 4 of YR1	7 - Playing Utopia (5:7) captured 11 acres of land from 1 - Test of Time (2:6).
July 4 of YR1	7 - Playing Utopia (5:7) captured 10 acres of land from 1 - Test of Time (2:6).
July 4 of YR1	11 - I told you so (5:7) invaded 1 - Test of Time (2:6) and razed 53 acres of land.
July 4 of YR1	21 - Stealing from rogue (5:7) captured 43 acres of land from 2 - Entry Team (2:6).
July 4 of YR1	Our kingdom has begun the Ruby Dragon project, Baby bad idea 1, targeted at Unnamed kingdom (2:6).
July 4 of YR1	21 - Stealing from rogue (5:7) captured 36 acres of land from 2 - Entry Team (2:6).
July 4 of YR1	1 - That is what you said (5:7) captured 13 acres of land from 1 - Test of Time (2:6).
July 4 of YR1	19 - One more snooze (5:7) captured 37 acres of land from 2 - Entry Team (2:6).
July 4 of YR1	1 - That is what you said (5:7) captured 12 acres of land from 1 - Test of Time (2:6).
July 4 of YR1	1 - That is what you said (5:7) captured 11 acres of land from 1 - Test of Time (2:6).
July 5 of YR1	18 - Blow My Fish Balls (5:7) captured 28 acres of land from 2 - Entry Team (2:6).
July 5 of YR1	18 - Blow My Fish Balls (5:7) captured 24 acres of land from 2 - Entry Team (2:6).
July 5 of YR1	18 - Blow My Fish Balls (5:7) captured 22 acres of land from 2 - Entry Team (2:6).
July 5 of YR1	8 - Lighting a Fire at Gas Station (5:7) captured 20 acres of land from 2 - Entry Team (2:6).
July 5 of YR1	8 - Lighting a Fire at Gas Station (5:7) captured 15 acres of land from 2 - Entry Team (2:6).
July 5 of YR1	8 - Lighting a Fire at Gas Station (5:7) captured 14 acres of land from 2 - Entry Team (2:6).
July 5 of YR1	20 - Apple Intelligent (5:7) captured 14 acres of land from 2 - Entry Team (2:6).
July 5 of YR1	20 - Apple Intelligent (5:7) captured 13 acres of land from 2 - Entry Team (2:6).
July 5 of YR1	20 - Apple Intelligent (5:7) captured 12 acres of land from 2 - Entry Team (2:6).
July 5 of YR1	20 - Apple Intelligent (5:7) captured 12 acres of land from 2 - Entry Team (2:6).
July 5 of YR1	11 - Lord 4A Day (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 26 acres of land.
July 6 of YR1	13 - Mixing Rum and Tequila (5:7) captured 61 acres of land from 11 - Lord 4A Day (2:6).
July 6 of YR1	13 - Mixing Rum and Tequila (5:7) captured 10 acres of land from 2 - Entry Team (2:6).
July 6 of YR1	13 - Mixing Rum and Tequila (5:7) captured 9 acres of land from 1 - Test of Time (2:6).
July 6 of YR1	12 - eating 8 weed cookies AT ONCE (5:7) captured 48 acres of land from 11 - Lord 4A Day (2:6).
July 6 of YR1	12 - eating 8 weed cookies AT ONCE (5:7) captured 40 acres of land from 11 - Lord 4A Day (2:6).
July 6 of YR1	9 - Yes That Makes You Look Fat (5:7) captured 52 acres of land from 18 - The Kipling Poem (2:6).
July 6 of YR1	22 - Casting ms on mystics (5:7) captured 36 acres of land from 11 - Lord 4A Day (2:6).
July 6 of YR1	22 - Casting ms on mystics (5:7) captured 43 acres of land from 18 - The Kipling Poem (2:6).
July 6 of YR1	22 - Casting ms on mystics (5:7) captured 8 acres of land from 1 - Test of Time (2:6).
July 7 of YR1	23 - GCode (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 21 acres of land.
July 7 of YR1	4 - Offsome (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 17 acres of land.
July 7 of YR1	4 - Offsome (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 15 acres of land.
July 7 of YR1	4 - Offsome (2:6) invaded 2 - New Credit Card in a Bookstore (5:7) and captured 52 acres of land.
July 8 of YR1	5 - Most common (2:6) invaded 2 - New Credit Card in a Bookstore (5:7) and captured 47 acres of land.
July 8 of YR1	14 - attacking a bigger kingdom (5:7) captured 31 acres of land from 11 - Lord 4A Day (2:6).
July 8 of YR1	14 - attacking a bigger kingdom (5:7) captured 26 acres of land from 11 - Lord 4A Day (2:6).
July 8 of YR1	5 - Most common (2:6) invaded 2 - New Credit Card in a Bookstore (5:7) and captured 37 acres of land.
July 8 of YR1	14 - attacking a bigger kingdom (5:7) captured 22 acres of land from 11 - Lord 4A Day (2:6).
July 8 of YR1	5 - Most common (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 17 acres of land.
July 8 of YR1	14 - attacking a bigger kingdom (5:7) captured 8 acres of land from 1 - Test of Time (2:6).
July 8 of YR1	5 - Most common (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 8 acres of land.
July 9 of YR1	17 - Surfing a Tsunami (5:7) captured 32 acres of land from 18 - The Kipling Poem (2:6).
July 9 of YR1	17 - Surfing a Tsunami (5:7) captured 26 acres of land from 18 - The Kipling Poem (2:6).
July 9 of YR1	6 - Giving a toddler a Sharpie (5:7) captured 13 acres of land from 11 - Lord 4A Day (2:6).
July 9 of YR1	3 - no more petrol (2:6) invaded 6 - Giving a toddler a Sharpie (5:7) and captured 72 acres of land.
July 10 of YR1	10 - Red Apple (2:6) invaded 17 - Surfing a Tsunami (5:7) and captured 37 acres of land.
July 10 of YR1	10 - Red Apple (2:6) invaded 17 - Surfing a Tsunami (5:7) and captured 31 acres of land.
July 10 of YR1	14 - Maldek (2:6) invaded 17 - Surfing a Tsunami (5:7) and captured 31 acres of land.
July 10 of YR1	14 - Maldek (2:6) invaded 17 - Surfing a Tsunami (5:7) and captured 27 acres of land.
July 10 of YR1	13 - Auto (2:6) invaded 17 - Surfing a Tsunami (5:7) and captured 25 acres of land.
July 11 of YR1	1 - Test of Time (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 14 acres of land.
July 11 of YR1	1 - Test of Time (2:6) ambushed armies from 15 - Saying Yes (5:7) and took 22 acres of land.
July 11 of YR1	1 - Test of Time (2:6) ambushed armies from 15 - Saying Yes (5:7) and took 26 acres of land.
July 11 of YR1	1 - Test of Time (2:6) ambushed armies from 15 - Saying Yes (5:7) and took 31 acres of land.
July 11 of YR1	2 - Entry Team (2:6) ambushed armies from 21 - Stealing from rogue (5:7) and took 18 acres of land.
July 11 of YR1	2 - Entry Team (2:6) ambushed armies from 2 - New Credit Card in a Bookstore (5:7) and took 30 acres of land.
July 11 of YR1	15 - Random (2:6) invaded 6 - Giving a toddler a Sharpie (5:7) and captured 36 acres of land.
July 11 of YR1	2 - Entry Team (2:6) attempted to invade 2 - New Credit Card in a Bookstore (5:7).
July 11 of YR1	15 - Random (2:6) invaded 17 - Surfing a Tsunami (5:7) and captured 17 acres of land.
July 11 of YR1	8 - Blood into lead (2:6) invaded 17 - Surfing a Tsunami (5:7) and captured 16 acres of land.
July 11 of YR1	6 - Nighthollow (2:6) invaded 2 - New Credit Card in a Bookstore (5:7) and captured 36 acres of land.
July 11 of YR1	6 - Nighthollow (2:6) invaded 2 - New Credit Card in a Bookstore (5:7) and captured 30 acres of land.
July 11 of YR1	6 - Nighthollow (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 16 acres of land.
July 11 of YR1	8 - Blood into lead (2:6) invaded 17 - Surfing a Tsunami (5:7) and captured 16 acres of land.
July 12 of YR1	4 - Line Stepping (5:7) captured 24 acres of land from 18 - The Kipling Poem (2:6).
July 12 of YR1	4 - Line Stepping (5:7) captured 20 acres of land from 11 - Lord 4A Day (2:6).
July 12 of YR1	4 - Line Stepping (5:7) captured 18 acres of land from 11 - Lord 4A Day (2:6).
July 12 of YR1	4 - Line Stepping (5:7) invaded 2 - Entry Team (2:6) and razed 54 acres of land.
July 13 of YR1	9 - Heart o Pain (2:6) invaded 17 - Surfing a Tsunami (5:7) and captured 23 acres of land.
July 13 of YR1	9 - Heart o Pain (2:6) invaded 2 - New Credit Card in a Bookstore (5:7) and captured 9 acres of land.
July 14 of YR1	18 - Blow My Fish Balls (5:7) killed 891 people within 23 - GCode (2:6).
July 14 of YR1	18 - Blow My Fish Balls (5:7) captured 17 acres of land from 18 - The Kipling Poem (2:6).
July 14 of YR1	12 - Self-Taught Proctologist (2:6) invaded 17 - Surfing a Tsunami (5:7) and captured 26 acres of land.
July 14 of YR1	12 - Self-Taught Proctologist (2:6) invaded 17 - Surfing a Tsunami (5:7) and captured 22 acres of land.
July 14 of YR1	12 - Self-Taught Proctologist (2:6) invaded 17 - Surfing a Tsunami (5:7) and captured 20 acres of land.
July 15 of YR1	15 - Saying Yes (5:7) recaptured 15 acres of land from 1 - Test of Time (2:6).
July 15 of YR1	15 - Saying Yes (5:7) recaptured 13 acres of land from 1 - Test of Time (2:6).
July 15 of YR1	15 - Saying Yes (5:7) recaptured 11 acres of land from 1 - Test of Time (2:6).
July 15 of YR1	15 - Saying Yes (5:7) killed 607 people within 23 - GCode (2:6).
July 15 of YR1	11 - I told you so (5:7) killed 456 people within 23 - GCode (2:6).
July 16 of YR1	5 - Kite Fying In The Rain (5:7) captured 28 acres of land from 18 - The Kipling Poem (2:6).
July 16 of YR1	5 - Kite Fying In The Rain (5:7) captured 25 acres of land from 18 - The Kipling Poem (2:6).
July 16 of YR1	4 - Offsome (2:6) invaded 17 - Surfing a Tsunami (5:7) and captured 12 acres of land.
July 16 of YR1	4 - Offsome (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 15 acres of land.
July 16 of YR1	2 - New Credit Card in a Bookstore (5:7) captured 21 acres of land from 18 - The Kipling Poem (2:6).
July 16 of YR1	4 - Offsome (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 13 acres of land.
July 16 of YR1	4 - Offsome (2:6) invaded 17 - Surfing a Tsunami (5:7) and captured 11 acres of land.
July 16 of YR1	2 - New Credit Card in a Bookstore (5:7) captured 18 acres of land from 18 - The Kipling Poem (2:6).
July 16 of YR1	2 - New Credit Card in a Bookstore (5:7) captured 16 acres of land from 18 - The Kipling Poem (2:6).
July 16 of YR1	1 - That is what you said (5:7) captured 23 acres of land from 11 - Lord 4A Day (2:6).
July 16 of YR1	1 - That is what you said (5:7) captured 19 acres of land from 11 - Lord 4A Day (2:6).
July 16 of YR1	1 - That is what you said (5:7) captured 16 acres of land from 11 - Lord 4A Day (2:6).
July 17 of YR1	5 - Most common (2:6) invaded 2 - New Credit Card in a Bookstore (5:7) and captured 23 acres of land.
July 17 of YR1	5 - Most common (2:6) invaded 2 - New Credit Card in a Bookstore (5:7) and captured 20 acres of land.
July 17 of YR1	5 - Most common (2:6) invaded 2 - New Credit Card in a Bookstore (5:7) and captured 17 acres of land.
July 17 of YR1	8 - Blood into lead (2:6) invaded 17 - Surfing a Tsunami (5:7) and captured 10 acres of land.
July 17 of YR1	8 - Blood into lead (2:6) invaded 17 - Surfing a Tsunami (5:7) and captured 10 acres of land.
July 17 of YR1	3 - Razor across my throat (5:7) captured 62 acres of land from 10 - Red Apple (2:6).
July 17 of YR1	7 - Playing Utopia (5:7) captured 71 acres of land from 8 - Blood into lead (2:6).
July 17 of YR1	7 - Playing Utopia (5:7) captured 8 acres of land from 18 - The Kipling Poem (2:6).
July 17 of YR1	7 - Playing Utopia (5:7) captured 10 acres of land from 11 - Lord 4A Day (2:6).
July 17 of YR1	19 - One more snooze (5:7) captured 73 acres of land from 8 - Blood into lead (2:6).
July 17 of YR1	19 - One more snooze (5:7) captured 10 acres of land from 11 - Lord 4A Day (2:6).
July 17 of YR1	19 - One more snooze (5:7) captured 9 acres of land from 11 - Lord 4A Day (2:6).
July 17 of YR1	12 - eating 8 weed cookies AT ONCE (5:7) captured 59 acres of land from 8 - Blood into lead (2:6).
July 17 of YR1	12 - eating 8 weed cookies AT ONCE (5:7) captured 47 acres of land from 8 - Blood into lead (2:6).
July 17 of YR1	21 - Stealing from rogue (5:7) captured 44 acres of land from 8 - Blood into lead (2:6).
July 18 of YR1	21 - Stealing from rogue (5:7) captured 8 acres of land from 18 - The Kipling Poem (2:6).
July 18 of YR1	21 - Stealing from rogue (5:7) captured 7 acres of land from 18 - The Kipling Poem (2:6).
July 18 of YR1	8 - Lighting a Fire at Gas Station (5:7) captured 39 acres of land from 8 - Blood into lead (2:6).
July 18 of YR1	8 - Lighting a Fire at Gas Station (5:7) captured 35 acres of land from 8 - Blood into lead (2:6).
July 18 of YR1	22 - Casting ms on mystics (5:7) captured 30 acres of land from 8 - Blood into lead (2:6).
July 18 of YR1	22 - Casting ms on mystics (5:7) captured 26 acres of land from 8 - Blood into lead (2:6).
July 18 of YR1	22 - Casting ms on mystics (5:7) captured 9 acres of land from 11 - Lord 4A Day (2:6).
July 18 of YR1	22 - Casting ms on mystics (5:7) captured 8 acres of land from 11 - Lord 4A Day (2:6).
July 18 of YR1	14 - attacking a bigger kingdom (5:7) captured 23 acres of land from 8 - Blood into lead (2:6).
July 18 of YR1	14 - attacking a bigger kingdom (5:7) captured 19 acres of land from 8 - Blood into lead (2:6).
July 18 of YR1	14 - attacking a bigger kingdom (5:7) captured 10 acres of land from 1 - Test of Time (2:6).
July 18 of YR1	13 - Mixing Rum and Tequila (5:7) captured 69 acres of land from 10 - Red Apple (2:6).
July 18 of YR1	13 - Mixing Rum and Tequila (5:7) captured 16 acres of land from 8 - Blood into lead (2:6).
July 18 of YR1	7 - Into the Sun (2:6) invaded 12 - eating 8 weed cookies AT ONCE (5:7) and captured 72 acres of land.
July 18 of YR1	7 - Into the Sun (2:6) invaded 12 - eating 8 weed cookies AT ONCE (5:7) and captured 64 acres of land.
July 18 of YR1	9 - Yes That Makes You Look Fat (5:7) captured 58 acres of land from 10 - Red Apple (2:6).
July 19 of YR1	4 - Line Stepping (5:7) killed 753 people within 3 - no more petrol (2:6).
July 19 of YR1	4 - Line Stepping (5:7) captured 58 acres of land from 10 - Red Apple (2:6).
July 19 of YR1	4 - Line Stepping (5:7) invaded 11 - Lord 4A Day (2:6) and razed 43 acres of land.
July 19 of YR1	1 - Test of Time (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 20 acres of land.
July 19 of YR1	16 - Diggy diggy hole (2:6) invaded 13 - Mixing Rum and Tequila (5:7) and captured 77 acres of land.
July 19 of YR1	16 - Diggy diggy hole (2:6) invaded 13 - Mixing Rum and Tequila (5:7) and captured 61 acres of land.
July 19 of YR1	18 - The Kipling Poem (2:6) invaded 17 - Surfing a Tsunami (5:7) and captured 20 acres of land.
July 19 of YR1	18 - The Kipling Poem (2:6) invaded 17 - Surfing a Tsunami (5:7) and captured 18 acres of land.
July 19 of YR1	18 - The Kipling Poem (2:6) ambushed armies from 17 - Surfing a Tsunami (5:7) and took 13 acres of land.
July 19 of YR1	23 - GCode (2:6) invaded 12 - eating 8 weed cookies AT ONCE (5:7) and captured 53 acres of land.
July 19 of YR1	20 - Apple Intelligent (5:7) killed 596 people within 3 - no more petrol (2:6).
July 19 of YR1	20 - Apple Intelligent (5:7) captured 75 acres of land from 23 - GCode (2:6).
July 20 of YR1	6 - Giving a toddler a Sharpie (5:7) captured 15 acres of land from 8 - Blood into lead (2:6).
July 21 of YR1	3 - no more petrol (2:6) invaded 12 - eating 8 weed cookies AT ONCE (5:7) and captured 51 acres of land.
July 21 of YR1	3 - no more petrol (2:6) invaded 12 - eating 8 weed cookies AT ONCE (5:7) and captured 44 acres of land.
July 21 of YR1	3 - no more petrol (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 11 acres of land.
July 22 of YR1	10 - Red Apple (2:6) invaded 12 - eating 8 weed cookies AT ONCE (5:7) and captured 30 acres of land.
July 22 of YR1	10 - Red Apple (2:6) invaded 12 - eating 8 weed cookies AT ONCE (5:7) and captured 28 acres of land.
July 22 of YR1	10 - Red Apple (2:6) invaded 13 - Mixing Rum and Tequila (5:7) and captured 35 acres of land.
July 22 of YR1	1 - Test of Time (2:6) invaded 17 - Surfing a Tsunami (5:7) and captured 19 acres of land.
July 22 of YR1	1 - Test of Time (2:6) invaded 17 - Surfing a Tsunami (5:7) and captured 17 acres of land.
July 22 of YR1	14 - Maldek (2:6) invaded 12 - eating 8 weed cookies AT ONCE (5:7) and captured 19 acres of land.
July 22 of YR1	14 - Maldek (2:6) invaded 13 - Mixing Rum and Tequila (5:7) and captured 22 acres of land.
July 22 of YR1	14 - Maldek (2:6) invaded 13 - Mixing Rum and Tequila (5:7) and captured 20 acres of land.
July 22 of YR1	15 - Random (2:6) invaded 11 - I told you so (5:7) and captured 95 acres of land.
July 22 of YR1	15 - Random (2:6) invaded 13 - Mixing Rum and Tequila (5:7) and captured 18 acres of land.
July 22 of YR1	18 - Blow My Fish Balls (5:7) killed 612 people within 3 - no more petrol (2:6).
July 22 of YR1	17 - Surfing a Tsunami (5:7) captured 21 acres of land from 8 - Blood into lead (2:6).
July 22 of YR1	18 - Blow My Fish Balls (5:7) captured 78 acres of land from 15 - Random (2:6).
July 22 of YR1	17 - Surfing a Tsunami (5:7) captured 21 acres of land from 11 - Lord 4A Day (2:6).
July 22 of YR1	17 - Surfing a Tsunami (5:7) attempted an invasion of 7 - Into the Sun (2:6), but was repelled.
July 22 of YR1	6 - Nighthollow (2:6) invaded 13 - Mixing Rum and Tequila (5:7) and captured 35 acres of land.
July 22 of YR1	6 - Nighthollow (2:6) invaded 13 - Mixing Rum and Tequila (5:7) and captured 30 acres of land.
July 22 of YR1	6 - Nighthollow (2:6) invaded 13 - Mixing Rum and Tequila (5:7) and captured 26 acres of land.
July 23 of YR1	12 - Self-Taught Proctologist (2:6) invaded 12 - eating 8 weed cookies AT ONCE (5:7) and captured 35 acres of land.
July 23 of YR1	12 - Self-Taught Proctologist (2:6) invaded 13 - Mixing Rum and Tequila (5:7) and captured 21 acres of land.
July 23 of YR1	12 - Self-Taught Proctologist (2:6) invaded 13 - Mixing Rum and Tequila (5:7) and captured 19 acres of land.
July 23 of YR1	2 - Entry Team (2:6) invaded 17 - Surfing a Tsunami (5:7) and captured 22 acres of land.
July 23 of YR1	2 - Entry Team (2:6) invaded 17 - Surfing a Tsunami (5:7) and captured 19 acres of land.
July 23 of YR1	2 - Entry Team (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 17 acres of land.
July 23 of YR1	2 - Entry Team (2:6) invaded 17 - Surfing a Tsunami (5:7) and captured 18 acres of land.
July 23 of YR1	15 - Saying Yes (5:7) captured 67 acres of land from 10 - Red Apple (2:6).
July 23 of YR1	15 - Saying Yes (5:7) killed 461 people within 3 - no more petrol (2:6).
July 23 of YR1	4 - Offsome (2:6) invaded 12 - eating 8 weed cookies AT ONCE (5:7) and captured 20 acres of land.
July 23 of YR1	4 - Offsome (2:6) invaded 12 - eating 8 weed cookies AT ONCE (5:7) and captured 18 acres of land.
July 23 of YR1	4 - Offsome (2:6) invaded 17 - Surfing a Tsunami (5:7) and captured 6 acres of land.
July 23 of YR1	4 - Offsome (2:6) razed 36 acres of 17 - Surfing a Tsunami (5:7).
July 24 of YR1	9 - Heart o Pain (2:6) invaded 12 - eating 8 weed cookies AT ONCE (5:7) and captured 19 acres of land.
July 24 of YR1	9 - Heart o Pain (2:6) invaded 17 - Surfing a Tsunami (5:7) and captured 6 acres of land.
July 24 of YR1	9 - Heart o Pain (2:6) invaded 17 - Surfing a Tsunami (5:7) and captured 5 acres of land.
January 1 of YR2	The lords of Utopia pass over this kingdom without granting an extra invitation. It disappoints them that your monarch has not used existing invitations to strengthen the kingdom.
January 1 of YR2	11 - I told you so (5:7) killed 733 people within 7 - Into the Sun (2:6).
January 1 of YR2	2 - New Credit Card in a Bookstore (5:7) captured 68 acres of land from 12 - Self-Taught Proctologist (2:6).
January 1 of YR2	4 - Line Stepping (5:7) killed 826 people within 7 - Into the Sun (2:6).
January 1 of YR2	4 - Line Stepping (5:7) captured 56 acres of land from 10 - Red Apple (2:6).
January 1 of YR2	4 - Line Stepping (5:7) invaded 11 - Lord 4A Day (2:6) and razed 43 acres of land.
January 1 of YR2	4 - Line Stepping (5:7) killed 80 people within 11 - Lord 4A Day (2:6).
January 1 of YR2	2 - New Credit Card in a Bookstore (5:7) captured 25 acres of land from 8 - Blood into lead (2:6).
January 1 of YR2	2 - New Credit Card in a Bookstore (5:7) captured 21 acres of land from 8 - Blood into lead (2:6).
January 1 of YR2	11 - Lord 4A Day (2:6) invaded 17 - Surfing a Tsunami (5:7) and captured 14 acres of land.
January 1 of YR2	11 - Lord 4A Day (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 19 acres of land.
January 1 of YR2	11 - Lord 4A Day (2:6) invaded 17 - Surfing a Tsunami (5:7) and captured 12 acres of land.
January 1 of YR2	11 - Lord 4A Day (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 18 acres of land.
January 1 of YR2	2 - New Credit Card in a Bookstore (5:7) captured 18 acres of land from 8 - Blood into lead (2:6).
January 2 of YR2	3 - Razor across my throat (5:7) killed 727 people within 7 - Into the Sun (2:6).
January 2 of YR2	5 - Most common (2:6) invaded 4 - Line Stepping (5:7) and captured 99 acres of land.
January 2 of YR2	5 - Most common (2:6) invaded 4 - Line Stepping (5:7) and captured 73 acres of land.
January 2 of YR2	5 - Most common (2:6) invaded 4 - Line Stepping (5:7) and captured 54 acres of land.
January 2 of YR2	5 - Kite Fying In The Rain (5:7) captured 21 acres of land from 8 - Blood into lead (2:6).
January 2 of YR2	5 - Kite Fying In The Rain (5:7) captured 17 acres of land from 8 - Blood into lead (2:6).
January 2 of YR2	5 - Kite Fying In The Rain (5:7) captured 15 acres of land from 8 - Blood into lead (2:6).
January 2 of YR2	5 - Kite Fying In The Rain (5:7) captured 13 acres of land from 8 - Blood into lead (2:6).
January 2 of YR2	New Credit Card in a Bookstore has completed our dragon, Baby bad idea 1, and it sets flight to ravage Unnamed kingdom (2:6)!
January 3 of YR2	20 - Apple Intelligent (5:7) killed 571 people within 7 - Into the Sun (2:6).
January 3 of YR2	20 - Apple Intelligent (5:7) killed 481 people within 7 - Into the Sun (2:6).
January 3 of YR2	20 - Apple Intelligent (5:7) captured 48 acres of land from 10 - Red Apple (2:6).
January 3 of YR2	7 - Playing Utopia (5:7) captured 90 acres of land from 5 - Most common (2:6).
January 3 of YR2	7 - Playing Utopia (5:7) captured 72 acres of land from 5 - Most common (2:6).
January 3 of YR2	7 - Playing Utopia (5:7) captured 53 acres of land from 5 - Most common (2:6).
January 3 of YR2	19 - One more snooze (5:7) killed 378 people within 7 - Into the Sun (2:6).
January 3 of YR2	19 - One more snooze (5:7) captured 36 acres of land from 5 - Most common (2:6).
January 3 of YR2	19 - One more snooze (5:7) captured 30 acres of land from 5 - Most common (2:6).
January 4 of YR2	13 - Mixing Rum and Tequila (5:7) captured 31 acres of land from 10 - Red Apple (2:6).
January 4 of YR2	13 - Mixing Rum and Tequila (5:7) captured 28 acres of land from 10 - Red Apple (2:6).
January 4 of YR2	1 - That is what you said (5:7) captured 45 acres of land from 5 - Most common (2:6).
January 4 of YR2	1 - That is what you said (5:7) captured 38 acres of land from 5 - Most common (2:6).
January 5 of YR2	7 - Into the Sun (2:6) invaded 13 - Mixing Rum and Tequila (5:7) and captured 28 acres of land.
January 5 of YR2	7 - Into the Sun (2:6) invaded 13 - Mixing Rum and Tequila (5:7) and captured 23 acres of land.
January 5 of YR2	7 - Into the Sun (2:6) invaded 13 - Mixing Rum and Tequila (5:7) and captured 20 acres of land.
January 5 of YR2	8 - Lighting a Fire at Gas Station (5:7) captured 69 acres of land from 15 - Random (2:6).
January 5 of YR2	8 - Lighting a Fire at Gas Station (5:7) captured 35 acres of land from 10 - Red Apple (2:6).
January 5 of YR2	8 - Lighting a Fire at Gas Station (5:7) invaded 11 - Lord 4A Day (2:6) and razed 49 acres of land.
January 5 of YR2	1 - Test of Time (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 26 acres of land.
January 5 of YR2	21 - Stealing from rogue (5:7) captured 70 acres of land from 15 - Random (2:6).
January 5 of YR2	21 - Stealing from rogue (5:7) captured 8 acres of land from 8 - Blood into lead (2:6).
January 5 of YR2	22 - Casting ms on mystics (5:7) captured 55 acres of land from 15 - Random (2:6).
January 6 of YR2	22 - Casting ms on mystics (5:7) captured 62 acres of land from 6 - Nighthollow (2:6).
January 6 of YR2	9 - Yes That Makes You Look Fat (5:7) killed 1,533 people within 9 - Heart o Pain (2:6).
January 6 of YR2	8 - Blood into lead (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 18 acres of land.
January 6 of YR2	8 - Blood into lead (2:6) invaded 17 - Surfing a Tsunami (5:7) and captured 11 acres of land.
January 6 of YR2	8 - Blood into lead (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 16 acres of land.
January 6 of YR2	8 - Blood into lead (2:6) invaded 17 - Surfing a Tsunami (5:7) and captured 9 acres of land.
January 7 of YR2	18 - Blow My Fish Balls (5:7) killed 1,067 people within 9 - Heart o Pain (2:6).
January 7 of YR2	23 - GCode (2:6) invaded 20 - Apple Intelligent (5:7) and captured 90 acres of land.
January 7 of YR2	12 - Self-Taught Proctologist (2:6) invaded 4 - Line Stepping (5:7) and captured 57 acres of land.
January 7 of YR2	12 - Self-Taught Proctologist (2:6) invaded 4 - Line Stepping (5:7) and captured 48 acres of land.
January 7 of YR2	18 - Blow My Fish Balls (5:7) captured 14 acres of land from 1 - Test of Time (2:6).
January 7 of YR2	12 - Self-Taught Proctologist (2:6) invaded 2 - New Credit Card in a Bookstore (5:7) and captured 33 acres of land.
January 7 of YR2	18 - Blow My Fish Balls (5:7) captured 12 acres of land from 1 - Test of Time (2:6).
January 7 of YR2	18 - Blow My Fish Balls (5:7) captured 11 acres of land from 1 - Test of Time (2:6).
January 7 of YR2	4 - Offsome (2:6) invaded 20 - Apple Intelligent (5:7) and captured 70 acres of land.
January 7 of YR2	Our kingdom has begun the Topaz Dragon project, Really Bad Idea, targeted at Unnamed kingdom (2:6).
January 7 of YR2	4 - Offsome (2:6) invaded 4 - Line Stepping (5:7) and captured 33 acres of land.
January 7 of YR2	6 - Giving a toddler a Sharpie (5:7) captured 8 acres of land from 8 - Blood into lead (2:6).
January 7 of YR2	6 - Giving a toddler a Sharpie (5:7) captured 8 acres of land from 8 - Blood into lead (2:6).
January 7 of YR2	4 - Line Stepping (5:7) captured 93 acres of land from 7 - Into the Sun (2:6).
January 7 of YR2	4 - Line Stepping (5:7) captured 74 acres of land from 7 - Into the Sun (2:6).
January 7 of YR2	4 - Line Stepping (5:7) captured 54 acres of land from 7 - Into the Sun (2:6).
January 7 of YR2	4 - Line Stepping (5:7) captured 93 acres of land from 16 - Diggy diggy hole (2:6).
January 8 of YR2	14 - Maldek (2:6) invaded 20 - Apple Intelligent (5:7) and captured 32 acres of land.
January 8 of YR2	14 - Maldek (2:6) invaded 20 - Apple Intelligent (5:7) and captured 27 acres of land.
January 8 of YR2	1 - Test of Time (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 13 acres of land.
January 9 of YR2	13 - Auto (2:6) invaded 2 - New Credit Card in a Bookstore (5:7) and captured 17 acres of land.
January 9 of YR2	14 - attacking a bigger kingdom (5:7) killed 1,040 people within 9 - Heart o Pain (2:6).
January 9 of YR2	15 - Random (2:6) invaded 20 - Apple Intelligent (5:7) and captured 32 acres of land.
January 9 of YR2	15 - Random (2:6) invaded 20 - Apple Intelligent (5:7) and captured 27 acres of land.
January 9 of YR2	14 - attacking a bigger kingdom (5:7) captured 12 acres of land from 18 - The Kipling Poem (2:6).
January 9 of YR2	14 - attacking a bigger kingdom (5:7) captured 11 acres of land from 18 - The Kipling Poem (2:6).
January 9 of YR2	14 - attacking a bigger kingdom (5:7) captured 12 acres of land from 1 - Test of Time (2:6).
January 9 of YR2	15 - Random (2:6) invaded 20 - Apple Intelligent (5:7) and captured 24 acres of land.
January 9 of YR2	12 - eating 8 weed cookies AT ONCE (5:7) captured 39 acres of land from 5 - Most common (2:6).
January 9 of YR2	12 - eating 8 weed cookies AT ONCE (5:7) captured 32 acres of land from 5 - Most common (2:6).
January 9 of YR2	6 - Nighthollow (2:6) invaded 4 - Line Stepping (5:7) and captured 52 acres of land.
January 9 of YR2	6 - Nighthollow (2:6) invaded 4 - Line Stepping (5:7) and captured 39 acres of land.
January 9 of YR2	3 - Razor across my throat (5:7) captured 72 acres of land from 15 - Random (2:6).
January 9 of YR2	2 - Entry Team (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 21 acres of land.
January 9 of YR2	2 - Entry Team (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 20 acres of land.
January 9 of YR2	2 - Entry Team (2:6) invaded 17 - Surfing a Tsunami (5:7) and captured 7 acres of land.
January 9 of YR2	5 - Most common (2:6) invaded 4 - Line Stepping (5:7) and captured 38 acres of land.
January 9 of YR2	2 - Entry Team (2:6) invaded 17 - Surfing a Tsunami (5:7) and captured 6 acres of land.
January 9 of YR2	5 - Most common (2:6) invaded 4 - Line Stepping (5:7) and captured 33 acres of land.
January 9 of YR2	5 - Most common (2:6) invaded 4 - Line Stepping (5:7) and captured 28 acres of land.
January 9 of YR2	5 - Most common (2:6) invaded 4 - Line Stepping (5:7) and captured 24 acres of land.
January 10 of YR2	10 - Red Apple (2:6) invaded 20 - Apple Intelligent (5:7) and captured 40 acres of land.
January 10 of YR2	10 - Red Apple (2:6) invaded 20 - Apple Intelligent (5:7) and captured 33 acres of land.
January 10 of YR2	10 - Red Apple (2:6) invaded 5 - Kite Fying In The Rain (5:7) and killed 135 people.
January 10 of YR2	2 - New Credit Card in a Bookstore (5:7) captured 58 acres of land from 5 - Most common (2:6).
January 10 of YR2	2 - New Credit Card in a Bookstore (5:7) captured 47 acres of land from 5 - Most common (2:6).
January 11 of YR2	2 - New Credit Card in a Bookstore (5:7) captured 55 acres of land from 7 - Into the Sun (2:6).
January 11 of YR2	17 - Surfing a Tsunami (5:7) captured 21 acres of land from 1 - Test of Time (2:6).
January 11 of YR2	3 - no more petrol (2:6) invaded 18 - Blow My Fish Balls (5:7) and captured 90 acres of land.
January 11 of YR2	3 - no more petrol (2:6) invaded 18 - Blow My Fish Balls (5:7) and captured 72 acres of land.
January 11 of YR2	17 - Surfing a Tsunami (5:7) captured 19 acres of land from 1 - Test of Time (2:6).
January 11 of YR2	11 - I told you so (5:7) killed 634 people within 9 - Heart o Pain (2:6).
January 11 of YR2	11 - I told you so (5:7) captured 19 acres of land from 2 - Entry Team (2:6).
January 11 of YR2	5 - Kite Fying In The Rain (5:7) captured 23 acres of land from 2 - Entry Team (2:6).
January 11 of YR2	5 - Kite Fying In The Rain (5:7) captured 19 acres of land from 2 - Entry Team (2:6).
January 11 of YR2	5 - Kite Fying In The Rain (5:7) captured 16 acres of land from 2 - Entry Team (2:6).
January 11 of YR2	5 - Kite Fying In The Rain (5:7) captured 18 acres of land from 11 - Lord 4A Day (2:6).
January 12 of YR2	18 - The Kipling Poem (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 27 acres of land.
January 12 of YR2	18 - The Kipling Poem (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 21 acres of land.
January 12 of YR2	18 - The Kipling Poem (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 18 acres of land.
January 12 of YR2	18 - The Kipling Poem (2:6) invaded 17 - Surfing a Tsunami (5:7) and captured 7 acres of land.
January 12 of YR2	19 - One more snooze (5:7) captured 88 acres of land from 14 - Maldek (2:6).
January 13 of YR2	1 - That is what you said (5:7) captured 34 acres of land from 5 - Most common (2:6).
January 13 of YR2	1 - That is what you said (5:7) captured 28 acres of land from 5 - Most common (2:6).
January 13 of YR2	15 - Saying Yes (5:7) captured 57 acres of land from 15 - Random (2:6).
January 13 of YR2	15 - Saying Yes (5:7) killed 253 people within 7 - Into the Sun (2:6).
January 14 of YR2	4 - Line Stepping (5:7) captured 43 acres of land from 7 - Into the Sun (2:6).
January 14 of YR2	4 - Line Stepping (5:7) captured 34 acres of land from 5 - Most common (2:6).
January 14 of YR2	4 - Line Stepping (5:7) captured 28 acres of land from 5 - Most common (2:6).
January 14 of YR2	4 - Line Stepping (5:7) captured 10 acres of land from 11 - Lord 4A Day (2:6).
January 15 of YR2	8 - Lighting a Fire at Gas Station (5:7) captured 120 acres of land from 4 - Offsome (2:6).
January 15 of YR2	8 - Lighting a Fire at Gas Station (5:7) captured 74 acres of land from 4 - Offsome (2:6).
January 15 of YR2	8 - Lighting a Fire at Gas Station (5:7) invaded 11 - Lord 4A Day (2:6) and razed 51 acres of land.
January 15 of YR2	18 - Blow My Fish Balls (5:7) recaptured 36 acres of land from 3 - no more petrol (2:6).
January 15 of YR2	18 - Blow My Fish Balls (5:7) recaptured 45 acres of land from 3 - no more petrol (2:6).
January 15 of YR2	22 - Casting ms on mystics (5:7) captured 47 acres of land from 4 - Offsome (2:6).
January 15 of YR2	22 - Casting ms on mystics (5:7) captured 38 acres of land from 4 - Offsome (2:6).
January 15 of YR2	18 - Blow My Fish Balls (5:7) captured 36 acres of land from 4 - Offsome (2:6).
January 15 of YR2	22 - Casting ms on mystics (5:7) captured 28 acres of land from 4 - Offsome (2:6).
January 15 of YR2	18 - Blow My Fish Balls (5:7) captured 27 acres of land from 4 - Offsome (2:6).
January 15 of YR2	9 - Heart o Pain (2:6) invaded 4 - Line Stepping (5:7) and captured 50 acres of land.
January 15 of YR2	9 - Heart o Pain (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 8 acres of land.
January 15 of YR2	9 - Heart o Pain (2:6) invaded 17 - Surfing a Tsunami (5:7) and captured 6 acres of land.
January 15 of YR2	4 - Offsome (2:6) ambushed armies from 8 - Lighting a Fire at Gas Station (5:7) and took 37 acres of land.
January 15 of YR2	4 - Offsome (2:6) ambushed armies from 8 - Lighting a Fire at Gas Station (5:7) and took 60 acres of land.
January 15 of YR2	12 - Self-Taught Proctologist (2:6) invaded 18 - Blow My Fish Balls (5:7) and captured 71 acres of land.
January 15 of YR2	12 - Self-Taught Proctologist (2:6) invaded 4 - Line Stepping (5:7) and captured 35 acres of land.
January 15 of YR2	12 - Self-Taught Proctologist (2:6) invaded 4 - Line Stepping (5:7) and captured 29 acres of land.
January 15 of YR2	12 - Self-Taught Proctologist (2:6) invaded 17 - Surfing a Tsunami (5:7) and captured 6 acres of land.
January 15 of YR2	16 - Diggy diggy hole (2:6) invaded 18 - Blow My Fish Balls (5:7) and captured 57 acres of land.
January 15 of YR2	16 - Diggy diggy hole (2:6) invaded 4 - Line Stepping (5:7) and captured 31 acres of land.
January 16 of YR2	9 - Yes That Makes You Look Fat (5:7) captured 99 acres of land from 3 - no more petrol (2:6).
January 16 of YR2	9 - Yes That Makes You Look Fat (5:7) captured 70 acres of land from 3 - no more petrol (2:6).
January 16 of YR2	21 - Stealing from rogue (5:7) captured 29 acres of land from 4 - Offsome (2:6).
January 16 of YR2	21 - Stealing from rogue (5:7) captured 27 acres of land from 4 - Offsome (2:6).
January 16 of YR2	21 - Stealing from rogue (5:7) captured 24 acres of land from 4 - Offsome (2:6).
January 16 of YR2	21 - Stealing from rogue (5:7) captured 23 acres of land from 4 - Offsome (2:6).
January 16 of YR2	11 - Lord 4A Day (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 16 acres of land.
January 16 of YR2	3 - Razor across my throat (5:7) captured 94 acres of land from 12 - Self-Taught Proctologist (2:6).
January 16 of YR2	3 - Razor across my throat (5:7) captured 67 acres of land from 12 - Self-Taught Proctologist (2:6).
January 16 of YR2	11 - Lord 4A Day (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 14 acres of land.
January 16 of YR2	3 - Razor across my throat (5:7) captured 51 acres of land from 12 - Self-Taught Proctologist (2:6).
January 16 of YR2	11 - Lord 4A Day (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 13 acres of land.
January 16 of YR2	11 - Lord 4A Day (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 12 acres of land.
January 17 of YR2	20 - Apple Intelligent (5:7) captured 78 acres of land from 16 - Diggy diggy hole (2:6).
January 17 of YR2	20 - Apple Intelligent (5:7) captured 83 acres of land from 9 - Heart o Pain (2:6).
January 17 of YR2	20 - Apple Intelligent (5:7) captured 68 acres of land from 3 - no more petrol (2:6).
January 17 of YR2	7 - Playing Utopia (5:7) captured 34 acres of land from 16 - Diggy diggy hole (2:6).
January 17 of YR2	7 - Playing Utopia (5:7) captured 28 acres of land from 16 - Diggy diggy hole (2:6).
January 17 of YR2	7 - Playing Utopia (5:7) captured 24 acres of land from 16 - Diggy diggy hole (2:6).
January 17 of YR2	8 - Blood into lead (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 10 acres of land.
January 17 of YR2	8 - Blood into lead (2:6) invaded 13 - Mixing Rum and Tequila (5:7) and captured 20 acres of land.
January 17 of YR2	8 - Blood into lead (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 9 acres of land.
January 17 of YR2	6 - Giving a toddler a Sharpie (5:7) captured 45 acres of land from 12 - Self-Taught Proctologist (2:6).
January 17 of YR2	A Emerald Dragon, Great idea incoming, from Unnamed kingdom (2:6) has begun ravaging our lands!
January 17 of YR2	23 - GCode (2:6) invaded 14 - attacking a bigger kingdom (5:7) and captured 92 acres of land.
January 17 of YR2	1 - Test of Time (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 11 acres of land.
January 17 of YR2	1 - Test of Time (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 9 acres of land.
January 17 of YR2	1 - Test of Time (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 8 acres of land.
January 17 of YR2	1 - Test of Time (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 7 acres of land.
January 17 of YR2	14 - Maldek (2:6) invaded 19 - One more snooze (5:7) and captured 93 acres of land.
January 17 of YR2	14 - Maldek (2:6) invaded 19 - One more snooze (5:7) and captured 66 acres of land.
January 18 of YR2	23 - GCode (2:6) invaded 5 - Kite Fying In The Rain (5:7) and captured 2 acres of land.
January 18 of YR2	14 - attacking a bigger kingdom (5:7) captured 64 acres of land from 23 - GCode (2:6).
January 18 of YR2	14 - attacking a bigger kingdom (5:7) captured 8 acres of land from 8 - Blood into lead (2:6).
January 18 of YR2	14 - attacking a bigger kingdom (5:7) captured 8 acres of land from 8 - Blood into lead (2:6).
January 18 of YR2	13 - Mixing Rum and Tequila (5:7) captured 34 acres of land from 3 - no more petrol (2:6).
January 18 of YR2	5 - Most common (2:6) invaded 4 - Line Stepping (5:7) and captured 44 acres of land.
January 18 of YR2	5 - Most common (2:6) invaded 14 - attacking a bigger kingdom (5:7) and captured 80 acres of land.
January 18 of YR2	5 - Most common (2:6) invaded 14 - attacking a bigger kingdom (5:7) and captured 68 acres of land.
January 18 of YR2	5 - Most common (2:6) invaded 2 - New Credit Card in a Bookstore (5:7) and captured 55 acres of land.
January 18 of YR2	13 - Mixing Rum and Tequila (5:7) captured 8 acres of land from 11 - Lord 4A Day (2:6).
January 18 of YR2	13 - Mixing Rum and Tequila (5:7) captured 7 acres of land from 11 - Lord 4A Day (2:6).
January 18 of YR2	12 - eating 8 weed cookies AT ONCE (5:7) captured 36 acres of land from 5 - Most common (2:6).
January 18 of YR2	12 - eating 8 weed cookies AT ONCE (5:7) captured 29 acres of land from 5 - Most common (2:6).
January 19 of YR2	13 - Auto (2:6) invaded 7 - Playing Utopia (5:7) and captured 99 acres of land.
January 19 of YR2	I told you so has slain the dragon, Great idea incoming, ravaging our lands!
January 20 of YR2	5 - Kite Fying In The Rain (5:7) captured 28 acres of land from 2 - Entry Team (2:6).
January 20 of YR2	5 - Kite Fying In The Rain (5:7) captured 20 acres of land from 2 - Entry Team (2:6).
January 20 of YR2	5 - Kite Fying In The Rain (5:7) captured 21 acres of land from 2 - Entry Team (2:6).
January 20 of YR2	6 - Nighthollow (2:6) invaded 7 - Playing Utopia (5:7) and captured 85 acres of land.
January 20 of YR2	6 - Nighthollow (2:6) invaded 22 - Casting ms on mystics (5:7) and captured 96 acres of land.
January 20 of YR2	2 - Entry Team (2:6) invaded 17 - Surfing a Tsunami (5:7) and captured 11 acres of land.
January 20 of YR2	2 - Entry Team (2:6) invaded 17 - Surfing a Tsunami (5:7) and captured 9 acres of land.
January 20 of YR2	2 - Entry Team (2:6) invaded 17 - Surfing a Tsunami (5:7) and captured 7 acres of land.
January 20 of YR2	2 - Entry Team (2:6) invaded 17 - Surfing a Tsunami (5:7) and captured 6 acres of land.
January 20 of YR2	15 - Random (2:6) invaded 21 - Stealing from rogue (5:7) and captured 97 acres of land.
January 20 of YR2	15 - Random (2:6) invaded 21 - Stealing from rogue (5:7) and captured 78 acres of land.
January 20 of YR2	2 - New Credit Card in a Bookstore (5:7) captured 81 acres of land from 6 - Nighthollow (2:6).
January 20 of YR2	2 - New Credit Card in a Bookstore (5:7) captured 68 acres of land from 6 - Nighthollow (2:6).
January 20 of YR2	19 - One more snooze (5:7) recaptured 33 acres of land from 14 - Maldek (2:6).
January 20 of YR2	19 - One more snooze (5:7) recaptured 46 acres of land from 14 - Maldek (2:6).
January 20 of YR2	11 - I told you so (5:7) captured 50 acres of land from 15 - Random (2:6).
January 20 of YR2	19 - One more snooze (5:7) captured 27 acres of land from 6 - Nighthollow (2:6).
January 20 of YR2	11 - I told you so (5:7) captured 12 acres of land from 18 - The Kipling Poem (2:6).
January 20 of YR2	18 - Blow My Fish Balls (5:7) captured 42 acres of land from 3 - no more petrol (2:6).
January 20 of YR2	18 - Blow My Fish Balls (5:7) captured 36 acres of land from 3 - no more petrol (2:6).
January 20 of YR2	2 - New Credit Card in a Bookstore (5:7) captured 10 acres of land from 18 - The Kipling Poem (2:6).
January 20 of YR2	4 - Line Stepping (5:7) captured 55 acres of land from 4 - Offsome (2:6).
January 20 of YR2	4 - Line Stepping (5:7) captured 34 acres of land from 5 - Most common (2:6).
January 20 of YR2	4 - Line Stepping (5:7) captured 28 acres of land from 5 - Most common (2:6).
January 21 of YR2	4 - Offsome (2:6) invaded 14 - attacking a bigger kingdom (5:7) and captured 44 acres of land.
January 21 of YR2	4 - Offsome (2:6) invaded 14 - attacking a bigger kingdom (5:7) and captured 39 acres of land.
January 21 of YR2	4 - Offsome (2:6) invaded 14 - attacking a bigger kingdom (5:7) and captured 20 acres of land.
January 21 of YR2	10 - Red Apple (2:6) invaded 7 - Playing Utopia (5:7) and captured 70 acres of land.
January 21 of YR2	17 - Surfing a Tsunami (5:7) captured 19 acres of land from 1 - Test of Time (2:6).
January 21 of YR2	10 - Red Apple (2:6) invaded 7 - Playing Utopia (5:7) and captured 57 acres of land.
January 21 of YR2	17 - Surfing a Tsunami (5:7) captured 21 acres of land from 2 - Entry Team (2:6).
January 23 of YR2	3 - Razor across my throat (5:7) captured 28 acres of land from 3 - no more petrol (2:6).
January 24 of YR2	12 - Self-Taught Proctologist (2:6) invaded 2 - New Credit Card in a Bookstore (5:7) and captured 60 acres of land.
January 24 of YR2	12 - Self-Taught Proctologist (2:6) invaded 2 - New Credit Card in a Bookstore (5:7) and captured 46 acres of land.
January 24 of YR2	12 - Self-Taught Proctologist (2:6) invaded 2 - New Credit Card in a Bookstore (5:7) and captured 36 acres of land.
January 24 of YR2	12 - Self-Taught Proctologist (2:6) invaded 4 - Line Stepping (5:7) and captured 40 acres of land.
January 24 of YR2	15 - Saying Yes (5:7) captured 68 acres of land from 15 - Random (2:6).
January 24 of YR2	15 - Saying Yes (5:7) invaded 8 - Blood into lead (2:6) and razed 53 acres of land.
January 24 of YR2	15 - Saying Yes (5:7) invaded 11 - Lord 4A Day (2:6) and razed 54 acres of land.
January 24 of YR2	15 - Saying Yes (5:7) invaded 11 - Lord 4A Day (2:6) and razed 48 acres of land.
January 24 of YR2	1 - That is what you said (5:7) captured 68 acres of land from 9 - Heart o Pain (2:6).
February 1 of YR2	20 - Apple Intelligent (5:7) captured 81 acres of land from 14 - Maldek (2:6).
February 1 of YR2	20 - Apple Intelligent (5:7) captured 10 acres of land from 11 - Lord 4A Day (2:6).
February 1 of YR2	7 - Into the Sun (2:6) invaded 13 - Mixing Rum and Tequila (5:7) and captured 40 acres of land.
February 1 of YR2	7 - Into the Sun (2:6) invaded 13 - Mixing Rum and Tequila (5:7) and captured 30 acres of land.
February 1 of YR2	7 - Into the Sun (2:6) invaded 13 - Mixing Rum and Tequila (5:7) and captured 23 acres of land.
February 1 of YR2	7 - Into the Sun (2:6) invaded 13 - Mixing Rum and Tequila (5:7) and captured 20 acres of land.
February 1 of YR2	3 - no more petrol (2:6) invaded 20 - Apple Intelligent (5:7) and captured 78 acres of land.
February 1 of YR2	3 - no more petrol (2:6) invaded 20 - Apple Intelligent (5:7) and captured 63 acres of land.
February 1 of YR2	3 - no more petrol (2:6) invaded 20 - Apple Intelligent (5:7) and captured 52 acres of land.
February 2 of YR2	13 - Mixing Rum and Tequila (5:7) captured 18 acres of land from 15 - Random (2:6).
February 2 of YR2	9 - Yes That Makes You Look Fat (5:7) captured 51 acres of land from 12 - Self-Taught Proctologist (2:6).
February 2 of YR2	9 - Yes That Makes You Look Fat (5:7) captured 42 acres of land from 12 - Self-Taught Proctologist (2:6).
February 2 of YR2	8 - Lighting a Fire at Gas Station (5:7) captured 38 acres of land from 15 - Random (2:6).
February 2 of YR2	8 - Lighting a Fire at Gas Station (5:7) captured 36 acres of land from 6 - Nighthollow (2:6).
February 2 of YR2	8 - Lighting a Fire at Gas Station (5:7) invaded 11 - Lord 4A Day (2:6) and razed 63 acres of land.
February 3 of YR2	19 - One more snooze (5:7) captured 48 acres of land from 9 - Heart o Pain (2:6).
February 3 of YR2	4 - Line Stepping (5:7) captured 74 acres of land from 7 - Into the Sun (2:6).
February 3 of YR2	4 - Line Stepping (5:7) captured 82 acres of land from 12 - Self-Taught Proctologist (2:6).
February 3 of YR2	4 - Line Stepping (5:7) captured 50 acres of land from 7 - Into the Sun (2:6).
February 3 of YR2	4 - Line Stepping (5:7) captured 15 acres of land from 11 - Lord 4A Day (2:6).
February 3 of YR2	7 - Playing Utopia (5:7) captured 97 acres of land from 23 - GCode (2:6).
February 3 of YR2	7 - Playing Utopia (5:7) captured 42 acres of land from 12 - Self-Taught Proctologist (2:6).
February 3 of YR2	7 - Playing Utopia (5:7) captured 21 acres of land from 7 - Into the Sun (2:6).
February 3 of YR2	6 - Giving a toddler a Sharpie (5:7) captured 42 acres of land from 3 - no more petrol (2:6).
February 3 of YR2	19 - One more snooze (5:7) captured 31 acres of land from 6 - Nighthollow (2:6).
February 4 of YR2	Our kingdom has cancelled the dragon project to Unnamed kingdom (2:6).
February 4 of YR2	Unnamed kingdom (2:6) has withdrawn from war. Our people rejoice at our victory!
February 4 of YR2	Our kingdom is now in a post-war period which will expire on June 5 of YR2.
February 13 of YR2	We have started developing a ritual! (Benediction)!
February 23 of YR2	Truth is Treason (4:4) has broken their ceasefire agreement with us!