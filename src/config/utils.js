const decode = input => {
	var output = "";
	var chr1, chr2, chr3;
	var enc1, enc2, enc3, enc4;
	var i = 0;

	input = input.replace(/[^A-Za-z0-9+/=]/g, "");
	const _keyStr =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

	while (i < input.length) {
		enc1 = _keyStr.indexOf(input.charAt(i++));
		enc2 = _keyStr.indexOf(input.charAt(i++));
		enc3 = _keyStr.indexOf(input.charAt(i++));
		enc4 = _keyStr.indexOf(input.charAt(i++));

		chr1 = (enc1 << 2) | (enc2 >> 4);
		chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
		chr3 = ((enc3 & 3) << 6) | enc4;

		output = output + String.fromCharCode(chr1);

		if (enc3 !== 64) {
			output = output + String.fromCharCode(chr2);
		}
		if (enc4 !== 64) {
			output = output + String.fromCharCode(chr3);
		}
	}
	output = _utf8_decode(output);
	return output;
};

const _utf8_decode = string => {
	string = string.replace(/\r\n/g, "\n");
	var utftext = "";
	for (var n = 0; n < string.length; n++) {
		var c = string.charCodeAt(n);
		if (c < 128) {
			utftext += String.fromCharCode(c);
		} else if (c > 127 && c < 2048) {
			utftext += String.fromCharCode((c >> 6) | 192);
			utftext += String.fromCharCode((c & 63) | 128);
		} else {
			utftext += String.fromCharCode((c >> 12) | 224);
			utftext += String.fromCharCode(((c >> 6) & 63) | 128);
			utftext += String.fromCharCode((c & 63) | 128);
		}
	}

	return utftext;
};

export { decode };
