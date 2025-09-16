import { decryptSaveFile } from "./decrypter.js";
import { renderResults } from "./render.js";

// Adds button functionality that will open the steam database of gamefile saves for silksong
document.getElementById("fileDownload").addEventListener("click", () => {
	window.open(
		"https://store.steampowered.com/account/remotestorageapp/?appid=1030300",
		"_blank",
	);
});

const div = document.getElementById("fileInput");
const input = document.createElement("input");
input.type = "file";
div.appendChild(input);
input.addEventListener("change", handleFileUpload);

let selectedAct = 3;
let saveJson;

const buttonContainer = document.getElementById("button-container");
for (let i = 1; i <= 3; i++) {
	const button = document.createElement("button");
	button.textContent = `Act ${i}`;
	button.classList.add("button-style");
	buttonContainer.appendChild(button);
	button.addEventListener("click", () => {
		selectedAct = i;
		if (saveJson) {
			renderResults(saveJson, selectedAct);
		}
	});
}

async function handleFileUpload(event) {
	const file = event.target.files[0];
	if (!file) return;

	const rawSave = await file.arrayBuffer();
	saveJson = await decryptSaveFile(rawSave);
	renderResults(saveJson, selectedAct);
}
