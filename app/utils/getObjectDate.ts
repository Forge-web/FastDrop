export default (date: string) => {
	const getListDateAndTime = date.split('T');
	const getListTimeAndUTC = getListDateAndTime[1]?.split('+');


	if (getListTimeAndUTC===undefined) return;
	

	const dateResult = getListDateAndTime[0];

	const timeResult = getListTimeAndUTC[0]?.split('.')[0];
	
	const UTCResult = getListTimeAndUTC[1];

	return {
		date: dateResult,
		time: timeResult,
		utc: UTCResult
	}
}