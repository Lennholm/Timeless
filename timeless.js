;(function(){
	var period = {
		YEAR: {set: 'setFullYear'},
 		MONTH: {set: 'setMonth'},
 		DAY: {set: 'setDate'}
	}
	var mDay = 1000 * 60 * 60 * 24;
	var dispatch = ['toLocaleString', 'toLocaleDateString', 'toDateString', 'toString'];

	getLastDayOfMonth = function(date){
		var tDate = copyDate(date);
 		tDate.setDate(1);
 		tDate.setMonth(tDate.getMonth() + 1);
 		tDate.setDate(0);
 		return tDate.getDate();
 	}
 	getLastDayOfYear = function(date){
		var tDate = copyDate(date);
 		tDate.setDate(1);
 		tDate.setMonth(0);
 		tDate.setFullYear(tDate.getFullYear() + 1);
 		tDate.setDate(0);
 		return getDayOfYear(tDate);
 	}
 	getDayOfYear = function(date){
		var tDate = copyDate(date);
 		tDate.setDate(1);
 		tDate.setMonth(0);
 		tDate.setDate(0);
 		return Math.round(((date.millis || date.getTime).call(date) - tDate.getTime()) / mDay);
 	}
 	getDayOfWeek = function(date){
 		return copyDate(date).getDay() || 7;
 	}
 	getWeekOfYear = function(date){
 		var tDate = copyDate(date);
 		tDate.setDate(tDate.getDate() + 4 - getDayOfWeek(date))
 		return Math.ceil(((tDate - new Date(tDate.getFullYear(), 0, 1)) / mDay + 1) / 7);
 	}
 	diff = function(date, diffDate){
 		var tDate = copyDate(date);
		var tDiffDate = copyDate(diffDate);
		tDate.setHours(0, 0, 0, 0);
		tDiffDate.setHours(0, 0, 0, 0);
		return Math.round((tDiffDate.getTime() - tDate.getTime()) / mDay);
 	}
 	monthDiff = function(date, diffDate){
 		var tDate = copyDate(date);
		var tDiffDate = copyDate(diffDate);
 		return (tDiffDate.getFullYear() * 12 + tDiffDate.getMonth()) -
 			(tDate.getFullYear() * 12 + tDate.getMonth());
 	}


	Timeless = function(y, d, m){
		if (!(this instanceof Timeless))
			return new Timeless(y, d, m);
		var timeless;
		if (y === undefined)
 			timeless = new Date();
 		else if (typeof d === 'number')
 			timeless = new Date([y, d, m]);
 		else
 			timeless = copyDate(y);
 		timeless.setHours(0, 0, 0, 0);

 		var lastDayOfMonth = getLastDayOfMonth(timeless);
 		var lastDayOfYear = getLastDayOfYear(timeless);
 		var dayOfYear = getDayOfYear(timeless);
 		var weekOfYear = getWeekOfYear(timeless);
 		var dayOfWeek = getDayOfWeek(timeless);

 		this.withYear = function(year){
 			return withPeriod(timeless, period.YEAR, year);
 		}
 		this.withMonthOfYear = function(month){
 			if (month < 1 || month > 12)
 				throw new OutOfRangeException('monthOfYear out of range');
 			return withPeriod(timeless, period.MONTH, month - 1);
		}
 		this.withDayOfMonth = function(day){
 			if (day < 1 || day > lastDayOfMonth)
 				throw new OutOfRangeException('dayOfMonth out of range');
 			return withPeriod(timeless, period.DAY, day);
 		}
 		this.withDayOfYear = function(day){
 			if (day < 1 || day > lastDayOfYear)
 				throw new OutOfRangeException('dayOfYear out of range');
 			var tDate = new Date(timeless);
 			tDate.setDate(1);
 			tDate.setMonth(0);
 			return withPeriod(tDate, period.DAY, day);
 		}
 		this.withDayOfWeek = function(day){
 			if (day < 1 || day > 7)
 				throw new OutOfRangeException('dayOfWeek out of range');
 			return withPeriod(timeless, period.DAY, timeless.getDate() + (day - dayOfWeek));
 		}
 		this.withWeekOfYear = function(week){
 			if (week < 1 || week > 53)
 				throw new OutOfRangeException('weekOfYear out of range');
 			return withPeriod(timeless, period.DAY, timeless.getDate() + (week - weekOfYear) * 7);
 		}
 		this.plusYears = function(years){
 			return withPeriod(timeless, period.YEAR, timeless.getFullYear() + parseInt(years));
 		}
 		this.plusMonths = function(months){
 			return withPeriod(timeless, period.MONTH, timeless.getMonth() + parseInt(months));
 		}
 		this.plusDays = function(days){
 			return withPeriod(timeless, period.DAY, timeless.getDate() + parseInt(days));
 		}
 		this.plusWeeks = function(weeks){
 			return withPeriod(timeless, period.DAY, timeless.getDate() + parseInt(weeks) * 7);
 		}

 		this.lastDayOfMonth = function(){
 			return lastDayOfMonth;
 		}
 		this.lastDayOfYear = function(){
 			return lastDayOfYear;
 		}
 		this.year = function(){
 			return timeless.getFullYear();
 		}
 		this.monthOfYear = function(){
 			return timeless.getMonth() + 1;
 		}
 		this.dayOfMonth = function(){
 			return timeless.getDate();
 		}
 		this.dayOfYear = function(){
 			return dayOfYear;
 		}
 		this.weekOfYear = function(){
 			return weekOfYear;
 		}
 		this.dayOfWeek = function(){
 			return dayOfWeek;
 		}
 		this.millis = function(){
 			return timeless.getTime();
 		}
 		this.milliseconds = function(){
 			return this.millis();
 		}
 		this.diff = function(diffDate){
 			return diff(timeless, diffDate);
 		}
 		this.monthDiff = function(diffDate){
 			return monthDiff(timeless, diffDate);
 		}
 		for (var i = 0; i < dispatch.length; i++){
 			this[dispatch[i]] = (function(m){
 				return function(){
 					return timeless[m]();
 				}
 			})(dispatch[i]);
 		}
 		return this;
	}

	function withPeriod(date, uPeriod, value){
		if (isNaN(value))
			throw IllegalArgumentException('argument is not a number');
		var tDate = new Date(date);
 		if (uPeriod !== period.DAY){
	 		var currentDay = tDate.getDate();
 			tDate.setDate(1);
 			tDate[uPeriod.set](value);
 			value = Math.min(currentDay, Timeless.lastDayOfMonth(tDate));
 		}
 		tDate.setDate(value);
 		return new Timeless(tDate);
	}
	function copyDate(date){
		if (date instanceof Timeless)
			return new Date(date.millis());
		return new Date(date);
	}

	var Exception = function(n, m){
		return {
			name: n,
			message: m,
			toString: function(){return n + ': ' + m}
		}
	}
	var OutOfRangeException = function(m){
		return Exception('OutOfRangeException', m);
	}
	var IllegalArgumentException = function(m){
		return Exception('IllegalArgumentException', m);
	}

	Timeless.year = function(date){
		return (date.year || date.getFullYear).call(date);
	}
	Timeless.monthOfYear = function(date){
		return new Timeless(date).monthOfYear();
	}
	Timeless.dayOfMonth = function(date){
		return (date.dayOfMonth || date.getDate).call(date);
	}
	Timeless.lastDayOfMonth = getLastDayOfMonth;
	Timeless.lastDayOfYear = getLastDayOfYear;
	Timeless.dayOfYear = getDayOfYear;
	Timeless.dayOfWeek = getDayOfWeek;
	Timeless.weekOfYear = getWeekOfYear;
	Timeless.dayOfWeek = getDayOfWeek;
	Timeless.diff = diff;
	Timeless.monthDiff = monthDiff;
	Timeless.today = function(){
		return new Timeless().millis();
	}
})();
