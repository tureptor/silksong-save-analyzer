import { decryptSaveFile } from "./decrypter.js";
import { renderResults } from "./render.js";

// Adds button functionality that will open the steam database of gamefile saves for silksong
document
	.getElementById("fileDownload")
	.addEventListener("click", () => {
		window.open("https://store.steampowered.com/account/remotestorageapp/?appid=1030300", "_blank");
	})

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
