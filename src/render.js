import { collectables, isItemUnlockedInPlayerSave } from "./dictionary.js";

/**
 * Render the collectables tables
 * @param {Object} playerSave - player save JSON
 */
export function renderResults(playerSave) {
	const container = document.getElementById("results-container"); // defined in index.html

	// TODO - preprocess collectables to add on "isUnlocked" field instead of redundant usage of isItemUnlockedInPlayerSave

	let totalCompletionPercentage = 0;

	let headingSuffix = "";

	container.innerHTML = collectables
		.map((category) => {
			// compute acquired items for this category
			const acquiredItems = category.items.filter((item) =>
				isItemUnlockedInPlayerSave(item.parsingInfo, playerSave),
			);
			if (category.necessity === "main") {
				const catCompletionPercentage = category.formula(acquiredItems);
				const maxCatCompletionPercentage = category.formula(category.items);
				totalCompletionPercentage += catCompletionPercentage;
				headingSuffix = `[${catCompletionPercentage}/${maxCatCompletionPercentage}%]`;
			} else {
				headingSuffix = `[${acquiredItems.length}/${category.items.length}]`;
			}

			// TODO - use category formula

			return `
      <div class="category">
        <h3>${category.name} ${headingSuffix}</h3>
        <p class="category-tooltip">${category.tooltip}</p>
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
            ${category.items
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
      </div>
    `;
		})
		.join("");
	console.log(`Expected completion: ${totalCompletionPercentage}`);
	console.log(
		`Actual completion: ${playerSave.playerData.completionPercentage}`,
	);
}
