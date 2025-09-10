import { collectables, isItemUnlockedInPlayerSave } from "./dictionary.js";

/**
 * Render the collectables tables
 * @param {string} containerId - id of the container div
 * @param {Object} playerSave - player save JSON
 */
export function renderResults(playerSave) {
	const container = document.getElementById("results-container"); // defined in index.html

	// TODO - preprocess collectables to add on "isUnlocked" field instead of redundant usage of isItemUnlockedInPlayerSave

	container.innerHTML = collectables
		.map((category) => {
			// compute acquired items for this category
			const acquiredItems = category.items.filter((item) =>
				isItemUnlockedInPlayerSave(item.parsingInfo, playerSave),
			);

			// TODO - use category formula

			return `
      <div class="category">
        <h2 title="${category.tooltip}">${category.name}</h2>
        <div class="category-total">Collected ${acquiredItems.length} / ${category.items.length}</div>
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
                <td ${item.prereqs.length > 0 ? "class='spoiler'" : ""}><span>${item.prereqs.join(", ")}</span></td>
                <td class="spoiler"><span>${item.location}</span></td>
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
}
