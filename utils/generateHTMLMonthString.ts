// Generate Month String for HTML month input

export default function generateHTMLMonthString(date: Date = new Date()) {
	let month = (date.getMonth() + 1).toString();
	if (month.length === 1) month = 0 + month;
	let year = date.getFullYear().toString();

	return year + "-" + month;
}
