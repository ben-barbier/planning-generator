# Planning Generator

Generate your school planning with courses dependencies and teachers vacations.

## Quickstart

To generate your planning you need to complete these 3 files with your data :

* `src/teachers.ts`
* `src/timeSlots.ts`
* `src/courses.csv` 

## courses.csv format

**Columns :**

1. Course ID
1. Matter
1. Teachers : List of teachers separated by '+'
1. Description
1. Preconditions : List of 'Course ID' separated by '+'
1. Date (optional) : Date on same format than timeSlots

**Example :**

```csv
ALGO-1;algo;bob;Description 1;;2019-05-13 AM
ALGO-2;algo;bob+alice;Description 2;ALGO-1;
ALGO-3;algo;bob;Description 3;ALGO-2;
WEB-1;web;alice;Description 4;ALGO-1;
WEB-2;web;alice;Description 5;WEB-1+ALGO-2;
WEB-3;web;alice;Description 6;WEB-2;
WEB-4;web;bob+alice;Description 7;WEB-3;2019-05-22 AM
WEB-5;web;alice;Description 8;WEB-4;
WEB-6;web;alice;Description 9;WEB-5;2019-05-24 PM
```

## Customization

To improve your planning selection, we can update the file `src/score.ts`
