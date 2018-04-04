export function saveToLocal(id, key, value) {
	console.log(value);
	let seller = window.localStorage.__seller__;
	if (!seller) {
		seller = {};
		seller[id] = {};
	} else {
		seller = JSON.parse(seller);
		if (!seller[id]) {
			seller[id] = {};
		}
	}
	seller[id][key] = value;
	console.log(seller[id][key]);
	window.localStorage.__seller__ = JSON.stringify(seller);
};
export function loadFromLocal(id, key, def) {
	let seller = window.localStorage.__seller__;
	if (!seller) {
		return def;
	}
	seller = JSON.parse(seller)[id];
	if (!seller) {
		return def;
	}
	console.log(seller);
	let ret = seller[key];
	console.log(ret);
	return ret || def;
};
