import { collectables, isItemUnlockedInPlayerSave } from "./dictionary.js";

/**
 * Render the collectables tables
 * @param {Object} playerSave - player save JSON
 */
export function renderResults(playerSave, selectedAct) {
	const container = document.getElementById("results-container"); // defined in index.html

	// TODO - preprocess collectables to add on "isUnlocked" field instead of redundant usage of isItemUnlockedInPlayerSave

	let totalCompletionPercentage = 0;

	let headingSuffix = "";

	container.innerHTML = collectables
		.map((category) => {
			// TODO -> have live switching of act categories after the file is uploaded
			const availableItems = category.items.filter(
				(item) => selectedAct >= item.whichAct,
			);
			// compute acquired items for this category
			const acquiredItems = availableItems.filter((item) =>
				isItemUnlockedInPlayerSave(item.parsingInfo, playerSave),
			);
			if (category.necessity === "main") {
				const catCompletionPercentage = category.formula(acquiredItems);
				const maxCatCompletionPercentage = category.formula(category.items);
				const categoryCompleted =
					catCompletionPercentage === maxCatCompletionPercentage;
				totalCompletionPercentage += catCompletionPercentage;
				headingSuffix = `<span class=${categoryCompleted ? "completedCategory" : "partialCategory"}>[${catCompletionPercentage}/${maxCatCompletionPercentage}%]</span>`;
			} else {
				headingSuffix = `<span class=${categoryCompleted ? "completedCategory" : "partialCategory"}>[${acquiredItems.length}/${category.items.length}]</span>`;
			}

			return `
    <div class="category">
        <h3>${category.name} ${headingSuffix}</h3>
        <p class="category-tooltip">${category.tooltip}</p>
		<details>
        	<summary>Show table</summary>
			<table>
			<thead>
				<tr>
				<th>Acquired</th>
				<th>Name</th>
				<th>Act</th>
				<th>Prerequisites</th>
				<th>Location</th>
				</tr>
			</thead>
			<tbody>
				${availableItems
					.map(
						(item) => `
				<tr>
					<td>${isItemUnlockedInPlayerSave(item.parsingInfo, playerSave) ? "✅" : "❌"}</td>
					<td>${item.name}</td>
					<td>${item.whichAct}</td>
					<td ${item.prereqs.length > 0 ? "class='spoiler'" : ""}>${item.prereqs.join(", ")}</td>
					<td class="spoiler">${item.location}</td>
				</tr>
				`,
					)
					.join("")}
			</tbody>
			</table>
		</details>
    </div>
	<br>
    `;
		})
		.join("");

	function collapseAll() {
		let collapsibles = document.getElementsByClassName("collapsible");
		Array.from(collapsibles).forEach((e) => {
		e.removeAttribute("open");
		});
	}
	const buttonCollapse = document.createElement("button");
	buttonCollapse.textContent = "Collapse All";
	buttonCollapse.onclick = collapseAll;
	container.prepend(buttonCollapse);

	function expandAll() {
		let collapsibles = document.getElementsByClassName("collapsible");
		Array.from(collapsibles).forEach((e) => {
		e.setAttribute("open", "");
		});
	}
	const buttonExpand = document.createElement("button");
	buttonExpand.textContent = "Expand All";
	buttonExpand.onclick = expandAll;
	container.prepend(buttonExpand);

	const completionPercentageHeader = document.createElement("h2");
	completionPercentageHeader.innerHTML = `Overall completion: ${totalCompletionPercentage}%`;
	container.prepend(completionPercentageHeader);
}
