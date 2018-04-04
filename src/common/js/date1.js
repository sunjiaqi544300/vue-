export function formatDate (now) {
	var year = now.getYear();
	var month = now.getMonth() + 1;
	var ss = now.getDate();
	var hour = now.getHours();
	var minute = now.getMinutes();
	var second = now.getSeconds();
	return ('20' + year + '-' + month + '-' + ss + ' ' + hour + ':' + minute + ':' + second);
	};
