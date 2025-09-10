export async function decryptSaveFile(rawSave) {
	// Strip padding
	const trimmed = new Uint8Array(rawSave.slice(25, rawSave.byteLength - 1));

	// Convert to string
	const base64Str = uint8ArrayToString(trimmed);

	// Decrypt
	const decrypted = decryptAES(base64Str);

	return JSON.parse(decrypted);
}

// Convert Uint8Array to string for Base64 decoding
function uint8ArrayToString(bytes) {
	let str = "";
	for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i]);
	return str;
}

// Decryption using CryptoJS
function decryptAES(base64Str) {
	// Parse Base64 to CryptoJS WordArray
	const cipherWords = CryptoJS.enc.Base64.parse(base64Str);

	// Hardcoded key - extracted from game binaries
	const key = CryptoJS.enc.Utf8.parse("UKu52ePUBwetZ9wNX88o54dnfKRu0T1l");

	// Decrypt
	const decrypted = CryptoJS.AES.decrypt({ ciphertext: cipherWords }, key, {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7,
	});

	// Convert WordArray to UTF-8 string
	const decryptedStr = CryptoJS.enc.Utf8.stringify(decrypted);

	return decryptedStr;
}
