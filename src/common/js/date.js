export function formatDate(date, fmt) {
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
	}
	let oo = {
			'M+': date.getMonth() + 1,
			'd+': date.getDate(),
			'h+': date.getHours(),
			'm+': date.getMinutes(),
			's+': date.getSeconds()
	};
	for (let k in oo) {
		if (new RegExp(`(${k})`).test(fmt)) {
			let str = oo[k] + '';
			fmt = fmt.repeat(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
		}
	}
//	console.log(fmt);
	return fmt;
};

function padLeftZero(str) {
	return ('00' + str).substr(str.length);
};
