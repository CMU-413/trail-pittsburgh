# Insert Parks Data

This SQL script populates the `Park` table with 13 parks currently managed by Trail Pittsburgh.

## Data Source

The park data used in this script was pulled directly from the [Trail Pittsburgh](https://www.trailpittsburgh.org/) website. It reflects the current list of trail systems and parks under the stewardship of Trail Pittsburgh as of the time of import.

Each park record includes:

- `name`: The official name of the park or trail system  
- `county`: The county in which the park resides  
- `is_active`: A boolean value indicating whether the park is currently active and managed

## SQL Script

```sql
INSERT INTO "public"."Park" (name, county, is_active)
VALUES
    ('Alameda Park', 'Butler County', true),
    ('Bavington - Hillman State Park', 'Washington', true),
    ('Boyce Park', 'Allegheny County', true),
    ('Deer Lakes Park', 'Allegheny County', true),
    ('Frick Park', 'Allegheny County', true),
    ('Hartwood Acres', 'Allegheny County', true),
    ('Moraine State Park', 'Butler County', true),
    ('North Park', 'Allegheny County', true),
    ('Oakmont Trails', 'Allegheny County', true),
    ('Riverview Park', 'Allegheny County', true),
    ('Settlers Cabin Park', 'Allegheny County', true),
    ('South Park', 'Allegheny County', true),
    ('White Oak Park', 'Allegheny', true);
```


## Notes

- This script should be run **after resetting the `Park` table** if you are reloading clean data.
- The `is_active` column will be active by default assuming that all parks are currently being used.