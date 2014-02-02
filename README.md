Timeless
========

Timeless is a Javascript library for easy dealing with dates when the timestamp is irrelevant and/or might get in the way of your calculations. The timestamp is eliminated as a variable by setting the time in to "0:00:00.0000".  
E.g. the *Date* instances `Sun Feb 02 2014 10:38:48 GMT+0100 (CET)` and `Sun Feb 02 2014 23:04:10 GMT+0100 (CET)` will be equal to each other when they are turned into instances of Timeless but the *Date* instances `Sun Feb 02 2014 23:30:00 GMT+0100 (CET)` and `Mon Feb 03 2014 00:30:00 GMT+0100 (CET)` will be a whole day apart in Timeless.

The library also offers a simpler, more intuitive and less verbose syntax than the native *Date* object for working with dates as well as providing methods to work with weeks.

Timeless is inspired by the Joda DateTime library for Java and particularly the *DateMidnight* class and as such share many features and method names with it.

Instances of Timeless are "immutable", meaning that once they have been created they cannot be altered. Instead, they provide modifier methods that return a new instance based on the original instance and the input. Thanks to this they are also chainable which makes it very straight-forward to get an instance with the desired date.  
E.g. `new Timeless("Sun Feb 02 2014").withDayOfMonth(28).plusYears(2);` will return an instance containing the date `Fri Feb 28 2016`.

## API ##

### Creating instances of Timeless ###

#### `new Timeless();` ####

This creates an instance with the current date.

#### `new Timeless(date);` ####

Creates an instance with the date specified by *date*. *date* can be a Timeless instance or anything the *Date* constructor accepts, i.e. a *Date* instance, an integer representing the milliseconds of the date, a date string etc.

#### `new Timeless(year, monthOfYear, dayOfMonth);` ####

Creates an instance with the year, month of year and month of day specified by *year*, *monthOfYear* and *dayOfMonth* respectively. Unlike the native *Date* object, *monthOfYear* has base 1, meaning that 1 represents January, 2 represents February and so on.
If *dayOfMonth* is higher than the last day of the month specified by *monthOfYear*, it will overflow to the next month. E.g. `new Timeless(2014, 2, 31);` will return the date `Mon Mar 03 2014`. This will only work if *dayOfMonth* doesn't exceed 31, which is the maximum number of days for any month.

### Methods on Timeless instances ###

#### Getters ####

##### `.year();` #####

Returns an integer representing the year in the date.

##### `.monthOfYEar();` #####

Returns an integer representing the month of the year in the date with base 1. E.g. `new Timeless().monthOfYear() == 2` means the month of the instance is February.

##### `.dayOfMonth();` #####

Returns an integer representing the day of the month in the date.

##### `.dayOfYear();` #####

Returns an integer representing the day of the year in the date.

##### `.dayOfWeek();` #####

Returns an integer representing the day of the week in the date where 1 represents Monday and 7 represents Sunday.

##### `.weekOfYear();` #####

Returns the week no. of the year in the date.

##### `.millis();`, `.milliseconds();` #####

Returns the milliseconds of the the date. The same as `getTime()` on the native *Date* object. The timestamp of all Timeless instances is "0:00:00.0000". 

##### `.lastDayOfMonth();` #####

Returns the number of days in the month.

##### `.lastDayOfYear();` #####

Returns the number of days in the year.

##### `.toString();`, `.toLocaleString();`, `.toDateString();`, `.toLocaleDateString();` #####

The functionality of these methods are identical to their function on the *Date* object. 

#### Modifiers ####

All modifier methods throw an `IllegalArgumentException` if the argument is not a number.

##### `.withYear(year);` #####

Returns a new instance with the year specified by *year* while the monthOfYear and dayOfMonth will be preserved. If the dayOfMonth of the original instance is higher than the lastDayOfMonth in the new instance, the dayOfMonth will be set to lastDayOfMonth. E.g. `new Timeless("Mon Feb 29 2016").withYear(2014);` will return `Fri Feb 28 2014`.

##### `.withMonthOfYear(month);` #####

Returns a new instance with the monthOfYear specified by *month* while the year and dayOfMonth will be preserved. If the dayOfMonth of the original instance is higher than the lastDayOfMonth in the new instance, the dayOfMonth will be set to lastDayOfMonth. E.g. `new Timeless("Fri Jan 31 2014").withMonthOfYear(2);` will return `Fri Feb 28 2014`.

Throws an `OutOfRangeException` if *month* is less than 1 or greater than 12.

##### `.withDayOfMonth(day);` #####

Returns a new instance with the dayOfMonth specified by *day* while the year and monthOfYear will be preserved.

Throws an `OutOfRangeException` if *day* is less than 1 or greater than lastDayOfMonth.

##### `.withDayOfYear(day);` #####

Returns a new instance with the dayOfYear specified by *day* while the year will be preserved.

Throws an `OutOfRangeException` if *day* is less than 1 or greater than lastDayOfYear (365 or 366).

##### `.withDayOfWeek(day);` #####

Returns a new instance with the dayOfWeek specified by *day*.

Throws an `OutOfRangeException` if *day* is less than 1 or greater than 7.

##### `.withWeekOfYear(week);` #####

Returns a new instance with the weekOfYear specified by *week* while year and dayOfWeek will be preserved.

Throws an `OutOfRangeException` if *week* is less than 1 or greater than 53.

##### `.plusYears(years);` #####

Returns a new instance with *years* added while monthOfYear and dayOfMonth will be preserved. *years* can be a negative value to subtract years. If the dayOfMonth of the original instance is higher than the lastDayOfMonth in the new instance, the dayOfMonth will be set to lastDayOfMonth. E.g. `new Timeless("Mon Feb 29 2016").plusYears(2);` will return `Wed Feb 28 2018`.

##### `.plusMonths(months);` #####

Returns a new instance with *months* added while dayOfMonth will be preserved. *month* can be a negative value to subtract months. If the dayOfMonth of the original instance is higher than the lastDayOfMonth in the new instance, the dayOfMonth will be set to lastDayOfMonth. E.g. `new Timeless("Fri Jan 31 2014").plusMonths(1);` will return `Fri Feb 28 2014`.

##### `.plusDays(days);` #####

Returns a new instance with *days* added. *days* can be a negative value to subtract days.

##### `.plusWeeks(weeks);` #####

Returns a new instance with *weeks* added while dayOfWeek will be preserved. *weeks* can be a negative value to subtract weeks. This is in practice identical to calling `.plusDays(weeks * 7)`.

#### Comparator methods ####

All comparator methods take an argument that must be either a Timeless instance, a *Date* instance, an integer representing the milliseconds of a date or a date string.

##### `.diff(diffDate);` #####

Returns the number of days that differs between the instance date and *diffDate*. The return is positive if *diffDate* is later than the instance date and negative otherwise.

##### `.monthDiff(diffDate);` #####

Returns the number of months that differs between the instance date and *diffDate*. The return is positive if *diffDate* is later than the instance date and negative otherwise. 

The method only looks at the year and monthOfYear and doesn't care about the dayOfMonth. E.g. `new Timeless("Fri Jan 31 2014").monthDiff("Sun Feb 2 2014");` will return 1 but `new Timeless("Sun Feb 2 2014").monthDiff("Fri Feb 28 2014");` will return 0.

##### `.eq(compareDate);` #####

Returns true if *compareDate* is the same day as the instance date, otherwise false.

##### `.lt(compareDate);` #####

Returns true if the instance date is earlier than *compareDate*, otherwise false.

##### `.gt(compareDate);` #####

Returns true if the instance date is later than *compareDate*, otherwise false.

##### `.lte(compareDate);` #####

Returns true if the instance date is the same date as OR earlier than *compareDate*, otherwise false.

##### `.gte(compareDate);` #####

Returns true if the instace date is the same date as OR later than *compareDate*, otherwise false.

### As a utility ###

Timeless can also be used as a utility instead of creating instance objects. All utility methods take one or two arguments that must be either a Timeless instance, a *Date* instance, an integer representing the milliseconds of a date or a date string. None of the methods modify the objects that are passed in.

##### `Timeless.year(date);` #####

Returns an integer representing the year in *date*.

##### `Timeless.monthOfYear(date);` #####

Returns an integer representing the month of the year in *date* with base 1.

##### `Timeless.dayOfMonth(date);` #####

Returns an integer representing the day of the month in *date*.

##### `Timeless.dayOfYear(date);` #####

Returns an integer representing the day of the year in *date*.

##### `Timeless.dayOfWeek(date);` #####

Returns an integer representing the day of the week in *date*.

##### `Timeless.weekOfYear(date);` #####

Returns the week no. of the year in *date*.

##### `Timeless.lastDayOfMonth(date);` #####

Returns the number of days in the month in *date*.

##### `Timeless.lastDayOfYear(date);` #####

Returns the number of days in the year in *date*.

##### `Timeless.diff(date, diffDate);` #####

Returns the number of days that differs between *date* and *diffDate*. The return is positive if *diffDate* is later than *date* and negative otherwise.

##### `Timeless.monthDiff(date, diffDate);` #####

Returns the number of months that differs between *date* and *diffDate* (see `.monthDiff(dateDiff);`).

##### `Timeless.today();` #####

Returns the milliseconds representing todays date at midnight.
