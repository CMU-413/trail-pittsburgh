# Insert Trails Data

This SQL script is used to populate the `Trail` table with the full set of trails managed by Trail Pittsburgh across the 13 parks listed in the `Park` table.

## Data Source

Trail information was pulled directly from the [Trail Pittsburgh](https://www.trailpittsburgh.org/) website. Each park listed by Trail Pittsburgh contains a curated list of trail segments or named trail features. This dataset captures those associations.


## How the SQL Insert Works

Each trail is associated with a `park_id` which corresponds to the ID of a record in the `Park` table. The `INSERT` statement includes the following columns:

- `park_id`: Foreign key reference to the `Park` table
- `name`: The trail’s name
- `is_active`: Marks the trail as currently maintained and valid
- `is_open`: Indicates the trail is open for use (could be toggled for maintenance or weather conditions)

> **Important**: This list is in the correct order assuming the `Park` table was populated without gaps and in its default sequence. The `park_id` values are as follows:

1. Alameda Park  
2. Bavington – Hillman State Park  
3. Boyce Park  
4. Deer Lakes Park  
5. Frick Park  
6. Hartwood Acres  
7. Moraine State Park  
8. North Park  
9. Oakmont Trails  
10. Riverview Park  
11. Settlers Cabin Park  
12. South Park  
13. White Oak Park

## Notes

- This script should be run **after resetting the `Park` and `Trail` table** if you are reloading clean data.
- The `is_active` and `is_open` columns will be active by default assuming that all parks are currently being used.


## SQL Script to Insert All Trails

```sql
INSERT INTO "public"."Trail" (park_id, name, is_active, is_open)
VALUES
    (1, 'Wandering Trail Fragment', true, true),
    (1, 'Janis Jumpline', true, true),
    (1, 'Jesse''s Girl Skinny', true, true),
    (1, 'Country Club', true, true),
    (1, 'Flying Squirrel', true, true),
    (1, 'Twisted Sister', true, true),
    (1, 'Graveyard Shift', true, true),
    (1, 'Movin'' On Up', true, true),
    (1, 'Big Green Smile', true, true),
    (1, 'Big Green Smile/Fore and Aft Loop', true, true),
    (1, 'Turn Down for What (TD4W)', true, true),
    (1, 'Mick Jaggers', true, true),
    (1, 'Go With the Flow', true, true),
    (1, 'Yinz G.O.Y.S.', true, true),
    (1, 'Alien Armpit', true, true),

    (2, 'Knowleton Trails', true, true),
    (2, 'Bavington - Five Points Trails', true, true),
    (2, 'Time Trial Loop', true, true),
    (2, 'Switchback Trail', true, true),
    (2, 'Short N Sweet Trail (510)', true, true),
    (2, 'The Run Up', true, true),
    (2, 'Connector Trail (370)', true, true),
    (2, 'Haul Trail', true, true),
    (2, 'Airport West Trail', true, true),
    (2, 'Van Gorder Trail', true, true),
    (2, 'Abby''s Trail', true, true),
    (2, 'Figure 8 Trail (500)', true, true),
    (2, 'Pine Race Track', true, true),
    (2, 'Old Airport Trail', true, true),
    (2, 'Trail 390', true, true),

    (3, 'Ski Lodge Loop - Yellow Blaze', true, true),
    (3, 'White Blaze Blue Dot', true, true),
    (3, 'White Blaze', true, true),
    (3, 'Yellow Blaze Red Dot', true, true),
    (3, 'Lost Boy - White Blaze Black Dot', true, true),
    (3, 'Switchback Trail', true, true),
    (3, 'Indian Hill Backside', true, true),
    (3, 'Outer Trail - Gravel Road', true, true),
    (3, 'Blue Blaze Red Dot', true, true),
    (3, 'Blue Blaze', true, true),
    (3, 'Blue Blaze Yellow Dot', true, true),
    (3, 'White Blaze Red Dot', true, true),
    (3, 'Green Blazed Trail', true, true),
    (3, 'Ski Slopes Trail', true, true),
    (3, 'Cherry Lane Trail - Green Blaze Red Dot', true, true),(4, 'Deer Lakes Park', true, true),

    (4, 'Purple Loop', true, true),
    (4, 'White Trail', true, true),
    (4, 'Orange Loop', true, true),
    (4, 'Blue Blaze Trail', true, true),
    (4, 'Orange Blue Dot Connector', true, true),
    (4, 'WP Connector', true, true),
    (4, 'Green Black Dot Trail', true, true),
    (4, 'Green White Dot Connector', true, true),
    (4, 'Green Red Dot Trail', true, true),
    (4, 'Red Blaze Trail', true, true),
    (4, 'Service Road Connector', true, true),
    (4, 'Purple White Connector', true, true),
    (4, 'Purple Loop Connector', true, true),
    (4, 'Purple White Dot Connector', true, true),(5, '#19 Southeast Loop', true, true),

    (5, 'Frick Park Singletrack', true, true),
    (5, 'Downward Dog', true, true),
    (5, 'Solstice Trail', true, true),
    (5, 'Great Allegheny Passage (GAP)', true, true),
    (5, 'Iron Gate', true, true),
    (5, '276', true, true),
    (5, 'Downhill Drop', true, true),
    (5, 'Lowercoaster Trail', true, true),
    (5, 'Steve Faloon Memorial Trail', true, true),
    (5, 'Upper Concrete Block', true, true),
    (5, 'Bradema', true, true),
    (5, 'Roller Coaster', true, true),
    (5, 'Firelane Trail', true, true),
    (5, 'Nine Mile Run Trail', true, true),
    (5, 'Homewood Trail', true, true),


    (6, 'White Loop', true, true),
    (6, 'Purple Loop', true, true),
    (6, '#8 White Loop Connector', true, true),
    (6, 'Red Loop', true, true),
    (6, 'Blue Loop', true, true),
    (6, 'Perfectly Good #3', true, true),
    (6, 'Orange Loop', true, true),
    (6, '#18 Southeast Loop', true, true),
    (6, 'Purple Loop Connector #13', true, true),
    (6, 'Zig Zag #12', true, true),
    (6, 'Green Loop', true, true),
    (6, 'Yellow Loop', true, true),
    (6, 'Blue Northeast Connector/Extension', true, true),
    (6, 'Stable Connector', true, true),

    (7, 'Moraine As Beginner As it Gets Ride', true, true),
    (7, 'Moraine Full Meal Deal', true, true),
    (7, 'Janis Jumpline', true, true),
    (7, 'Powerline to Alexander Ridge Parking', true, true),
    (7, 'Downhill Trail', true, true),
    (7, 'Country Club', true, true),
    (7, 'Flying Squirrel', true, true),
    (7, 'Moraine Bike Trail', true, true),
    (7, 'Turn Down for What (TD4W)', true, true),
    (7, 'Western Powerline to Lake', true, true),
    (7, 'Eastern Powerline to Lake', true, true),
    (7, 'Top of the Ridge', true, true),
    (7, 'Return to Sender', true, true),
    (7, 'Dirt Dealer', true, true),
    (7, 'Southern Peninsula', true, true),

    (8, 'Fun Route - Good for Beginners', true, true),
    (8, 'North Park Outer Loop with V8', true, true),
    (8, 'North Park Beginner Pool Loop', true, true),
    (8, 'Denny''s Trail', true, true),
    (8, 'North Ridge Loop', true, true),
    (8, 'North Park Freeride Area Skills Park', true, true),
    (8, 'The Dr J Freeride Trail', true, true),
    (8, 'White with Red Dot', true, true),
    (8, 'Koto Buki Trail', true, true),
    (8, '#19 Southeast Loop', true, true),
    (8, 'North Ridge (Red/Blue Dot)', true, true),
    (8, 'Sand Mound Trail (White Blaze with Brown Dot)', true, true),
    (8, 'White Loop', true, true),
    (8, 'Pump Track', true, true),
    (8, 'Backside of Golf Course - Orange Blaze', true, true),

    (9, 'Memorial Trail', true, true),
    (9, 'Eagle Rocks Trail', true, true),
    (9, 'Pine Loam Trail', true, true),
    (9, 'Dark Hollow Run Trail', true, true),
    (9, 'Fairways Trail', true, true),
    (9, 'Gas Well Loop', true, true),
    (9, 'Plum Creek Slide Trail', true, true),
    (9, 'Memorial Trail Aux', true, true),
    (9, 'Spring Trail', true, true),
    (9, 'Memorial Trail Switchback', true, true),
    (9, 'Plum Creek Trail to Dark Hollow Meadow', true, true),
    (9, 'Reggae Trail', true, true),
    (9, 'Gas well stairs', true, true),
    (9, 'Rock Trail', true, true),
    (9, 'Root Trail', true, true),

    (10, 'Riverview Descent', true, true),
    (10, 'Kilbuck Trail', true, true),
    (10, 'Bob Harvey Trail', true, true),
    (10, 'Highwood Trail', true, true),
    (10, 'Overlook Trail', true, true),
    (10, 'Wissahickon Trail', true, true),
    (10, 'Archery Trail', true, true),
    (10, 'Snowflake Trail', true, true),
    (10, 'Snyder''s Point Loop Trail', true, true),
    (10, 'Deer Hollow Trail to Shortcut Trail Singletrack', true, true),
    (10, 'Marshall Trail', true, true),
    (10, 'Bridle Trail', true, true),
    (10, 'Vinnie Hill Trail', true, true),
    (10, 'Old Zoo Trail (Lower)', true, true),
    (10, 'Old Kilbuck Road', true, true),

    (11, 'Settlers Cabin', true, true),
    (11, 'Settlers Peak', true, true),
    (11, 'Panhandle Trail', true, true),
    (11, 'Red Trail', true, true),
    (11, 'Blue Loop', true, true),
    (11, 'Lake Loop', true, true),
    (11, 'Old Greer Road Trail', true, true),
    (11, 'Red Connector', true, true),
    (11, 'Purple Loop', true, true),
    (11, 'Fish Hook', true, true),
    (11, 'Playground', true, true),
    (11, 'Mother''s Hill', true, true),
    (11, 'Blue-Green Connector', true, true),

    (12, 'South Park Big Loop', true, true),
    (12, 'Montour Trail: Library to Bethel Park Section', true, true),
    (12, 'Montour Trail: Steward Road - Gill Hall Road', true, true),
    (12, 'Alternate Trail', true, true),
    (12, 'Upper Trail', true, true),
    (12, 'Jump Trail', true, true),
    (12, 'Lower Creek Trail', true, true),
    (12, 'Main Trail', true, true),
    (12, 'Montour Trail: Peters Creek Road Section', true, true),
    (12, 'Warm-up Loop', true, true),
    (12, 'The Drain', true, true),
    (12, 'Fair Grounds Trail', true, true),
    (12, 'Sleepy Hollow Trail', true, true),
    (12, 'Buffalo Ridge Trail', true, true),
    (12, 'South Park Flow Trail', true, true),

    (13, 'White Oak Park Tour', true, true),
    (13, 'Stewart''s Trail', true, true),
    (13, 'Green Trail (Rainbow Gardens)', true, true),
    (13, 'Red Trail (Jack Rabbit)', true, true),
    (13, 'Orange Trail', true, true),
    (13, 'Yellow Trail', true, true),
    (13, 'White Trail (Kemp)', true, true),
    (13, 'Mowed Connector Trail', true, true),
    (13, 'Connector Trail', true, true),
    (13, 'Connector 1', true, true),
    (13, 'Alternate Trail', true, true),
    (13, 'Connector 2', true, true),
    (13, 'Connector 3', true, true);
```