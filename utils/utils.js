function getCourseCodes(timeTableText) {
	let courseCodeRe = /-([a-zA-Z]{3}\d{3,4})-/g
	var courseCodeMatch;
	let courseCodes = []
	do {
		courseCodeMatch = courseCodeRe.exec(timeTableText);
		if (courseCodeMatch)
		courseCodes.push(courseCodeMatch[1])

	} while (courseCodeMatch);
	return courseCodes;
}