import { decryptSaveFile } from "./decrypter.js";
import { renderResults } from "./render.js";

document
	.getElementById("fileInput")
	.addEventListener("change", handleFileUpload);

async function handleFileUpload(event) {
	const file = event.target.files[0];
	if (!file) return;

	const rawSave = await file.arrayBuffer();
	const saveJson = await decryptSaveFile(rawSave);
	renderResults(saveJson);
}
