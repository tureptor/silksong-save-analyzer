/**
 * @typedef {Object} FlagParsingInfo
 * @property {"flag"} type
 * @property {string} internalId - name of flag
 */

/**
 * @typedef {Object} QuestParsingInfo
 * @property {"quest"} type
 * @property {string} internalId - name of quest
 */

/**
 * @typedef {Object} SceneDataParsingInfo
 * @property {"sceneData"} type
 * @property {[string, string]} internalId - tuple: [sceneLoc, ID]
 */

/**
 * @typedef {Object} ToolParsingInfo
 * @property {"tool"} type
 * @property {string} internalId - name of tool
 */

/**
 * @typedef {Object} UpgradableToolParsingInfo
 * @property {"upgradeabletool"} type
 * @property {[string]} internalId - names of tool variants
 */

/**
 * @typedef {Object} CrestParsingInfo
 * @property {"crest"} type
 * @property {string} internalId - name of crest
 */

/**
 * @typedef {Object} CollectableParsingInfo
 * @property {"collectable"} type
 * @property {string} internalId - name of collectable
 */

/**
 * @typedef {FlagParsingInfo | QuestParsingInfo | SceneDataParsingInfo | ToolParsingInfo | UpgradableToolParsingInfo | CrestParsingInfo} ParsingInfo
 */

/**
 * @typedef {Object} CategoryItem
 * @property {string} name - display name, e.g. "Mask Shard 1"
 * @property {1 | 2 | 3} whichAct - earliest act you can acquire it
 * @property {string[]} prereqs - required abilities or conditions
 * @property {string} location - description of how to get it
 * @property {ParsingInfo} parsingInfo - internal parsing information
 */

/**
 * @typedef {"main"|"essential"} NecessityType - main directly counts, essential is indirectly needed for main
 */

/**
 * @typedef {Object} CollectableCategory
 * @property {string} name - name of the category
 * @property {NecessityType} necessity - how the category contributes to completion
 * @property {string} tooltip - description for the category
 * @property {(acquiredItems: CategoryItem[]) => number} [formula] - calculates completion % for this category, only for necessity === "main"
 * @property {CategoryItem[]} items - items in this category
 */

/**
 * @param {ParsingInfo} itemParsingInfo
 * @param {Object} saveData
 * @returns {boolean}
 */
export function isItemUnlockedInPlayerSave(itemParsingInfo, saveData) {
	const playerData = saveData.playerData ?? {};
	const sceneData = saveData.sceneData?.persistentBools?.serializedList ?? [];

	const typeHandlers = {
		flag: (flagName) => !!playerData[flagName],

		tempintflag: ([flagName, reqValue]) => {
			return !!playerData[flagName] && playerData[flagName] >= reqValue;
		},

		quest: (questName) => {
			const questEntry = playerData.QuestCompletionData?.savedData?.find(
				(x) => x.Name === questName,
			);

			return questEntry?.Data?.IsCompleted ?? false;
		},

		sceneData: ([sceneName, Id]) => {
			const scene = sceneData.find(
				(x) => x.SceneName === sceneName && x.ID === Id,
			);
			return scene?.Value ?? false;
		},

		tool: (toolName) => {
			const toolEntry = playerData.Tools?.savedData?.find(
				(x) => x.Name === toolName,
			);
			return (
				!!toolEntry && toolEntry.Data.IsUnlocked && !toolEntry.Data.IsHidden
			);
		},

		upgradabletool: (listOfVariantNames) => {
			return listOfVariantNames.some((variantName) =>
				typeHandlers.tool(variantName),
			);
		},

		crest: (crestName) => {
			const crestEntry = playerData.ToolEquips?.savedData?.find(
				(x) => x.Name === crestName,
			);
			return !!crestEntry && crestEntry.Data.IsUnlocked;
		},

		collectable: (itemName) => {
			const collectableEntry = playerData.Collectables?.savedData?.find(
				(x) => x.Name === itemName,
			);
			return !!collectableEntry && collectableEntry.Data.Amount > 0;
		},
	};

	const handler = typeHandlers[itemParsingInfo.type];
	if (!handler)
		throw new Error(`Unknown ParsingInfo type:${itemParsingInfo.type}`);

	return handler(itemParsingInfo.internalId);
}

/**
 * @type {Record<string, CollectableCategory>}
 */
export const collectables = [
	{
		name: "Mask Shards",
		necessity: "main",
		tooltip: "Mask shards can increase your max HP. Each 4 shards count as 1%",
		formula: (acquiredItems) => Math.floor(acquiredItems.length / 4),
		items: [
			{
				name: "Mask Shard 1",
				whichAct: 1,
				prereqs: [],
				location: "Purchased from bonebottom merchant",
				parsingInfo: {
					type: "flag",
					internalId: "PurchasedBonebottomHeartPiece",
				},
			},
			{
				name: "Mask Shard 2",
				whichAct: 1,
				prereqs: ["Swift Step"],
				location:
					"Behind a breakable wall near the simple key slot (unverified)",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Crawl_02", "Heart Piece"],
				},
			},
			{
				name: "Mask Shard 3",
				whichAct: 1,
				prereqs: ["Drifter's cloak"],
				location: "North-west of the Seamstress (unverified)",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Bone_East_20", "Heart Piece"],
				},
			},
			{
				name: "Mask Shard 4",
				whichAct: 1,
				prereqs: ["Drifter's cloak"],
				location:
					"Shellwood - at the end of a platforming challenge behind a breakable wall",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Shellwood_14", "Heart Piece"],
				},
			},
			{
				name: "Mask Shard 5",
				whichAct: 1,
				prereqs: ["Wall Cling"],
				location: "Deep docks, very close to the Marrow entrance (unverified)",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Dock_08", "Heart Piece"],
				},
			},
			{
				name: "Mask Shard 6",
				whichAct: 1,
				prereqs: ["Needolin"],
				location:
					"In a room behind a breakable wall on the east side of Weavenest Atla (unverified)",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Weave_05b", "Heart Piece"],
				},
			},
			{
				name: "Mask Shard 7",
				whichAct: 1,
				prereqs: [],
				location:
					"Reward for the Savage Beastfly quest obtainable in Bellhart (unverified)",
				parsingInfo: {
					type: "quest",
					internalId: "Beastfly Hunt",
				},
			},
			{
				name: "Mask Shard 8",
				whichAct: 2,
				prereqs: [],
				location:
					"Leftmost part of Cogwork core behind an challenge room (unverified)",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Song_09", "Heart Piece"],
				},
			},
			{
				name: "Mask Shard 9",
				whichAct: 2,
				prereqs: [],
				location:
					"Whispering Vaults. At the top of a room. The movable box must be hit from beneath from another room behind a breakable ceiling (unverified)",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Library_05", "Heart Piece"],
				},
			},
			{
				name: "Mask Shard 10",
				whichAct: 2,
				prereqs: ["Clawline"],
				location:
					"Bilewater. At the end of two long horizontal corridors (unverified)",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Shadow_13", "Heart Piece"],
				},
			},
			{
				name: "Mask Shard 11",
				whichAct: 2,
				prereqs: ["Clawline"],
				location:
					"At the top of Skull Cavern, which is in the southeast of Far Fields (unverified)",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Bone_East_LavaChallenge", "Heart Piece (1)"],
				},
			},
			{
				name: "Mask Shard 12",
				whichAct: 2,
				prereqs: ["Clawline"],
				location:
					"The Slab - at the end of a platforming challenge which is behind a lock which needs the Key of Apostate (unverified)",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Slab_17", "Heart Piece"],
				},
			},
			{
				name: "Mask Shard 13",
				whichAct: 2,
				prereqs: ["Faydown Cloak"],
				location: "Left of the southwest bench in Mount Fay (unverified)",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Peak_04c", "Heart Piece"],
				},
			},
			{
				name: "Mask Shard 14",
				whichAct: 2,
				prereqs: ["Faydown Cloak"],
				location: "East part of the Wisp Thicket (unverified)",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Wisp_07", "Heart Piece"],
				},
			},
			{
				name: "Mask Shard 15",
				whichAct: 2,
				prereqs: ["Faydown Cloak"],
				location:
					"Purchased from Jubilana after saving her as part of the The Lost Merchant quest (unverified)",
				parsingInfo: {
					type: "flag",
					internalId: "MerchantEnclaveShellFragment",
				},
			},
			{
				name: "Mask Shard 16",
				whichAct: 2,
				prereqs: ["Faydown Cloak"],
				location:
					"Bottom-left of blasted steps near the world border. Requires you to reach a certain platform via a jump while dashing -> Clawline -> double jump. (unverified)",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Coral_19b", "Heart Piece"],
				},
			},
			{
				name: "Mask Shard 17",
				whichAct: 3,
				prereqs: [],
				location: "Reward for the Fastest in Pharloom quest (unverified)",
				parsingInfo: {
					type: "quest",
					internalId: "Sprintmaster Race",
				},
			},
			{
				name: "Mask Shard 18",
				whichAct: 3,
				prereqs: [],
				location: "Reward for the Hidden Hunter quest (unverified)",
				parsingInfo: {
					type: "quest",
					internalId: "Ant Trapper",
				},
			},
			{
				name: "Mask Shard 19",
				whichAct: 3,
				prereqs: [],
				location: "Reward for the Dark Hearts quest (unverified)",
				parsingInfo: {
					type: "quest",
					internalId: "Destroy Thread Cores",
				},
			},
			{
				name: "Mask Shard 20",
				whichAct: 3,
				prereqs: ["Silk Soar"],
				location:
					"Inside Brightvein, which is near the middle of Mount Fay and requires a super jump into a hidden ceiling passage. (unverified)",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Peak_06", "Heart Piece"],
				},
			},
		],
	},
	{
		name: "Spool Fragments",
		necessity: "main",
		tooltip:
			"Spool fragments can increase your max silk. Each 2 shards count as 1%",
		formula: (acquiredItems) => Math.floor(acquiredItems.length / 2),
		items: [
			{
				name: "Spool Fragment 1",
				whichAct: 1,
				prereqs: [],
				location: "Above bonebottom settlement",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Bone_11b", "Silk Spool"],
				},
			},
			{
				name: "Spool Fragment 2",
				whichAct: 1,
				prereqs: [],
				location: "Left part of Deep docks (unverified)",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Dock_03c", "Silk Spool"],
				},
			},
			{
				name: "Spool Fragment 3",
				whichAct: 1,
				prereqs: [],
				location:
					"Fleamaster reward - will always show as unobtained for now, while I figure out the save file flag.",
				parsingInfo: {
					type: "flag",
					internalId: "fleaRewardPlaceholderTODO",
				},
			},
			{
				name: "Spool Fragment 4",
				whichAct: 1,
				prereqs: ["Cling Grip"],
				location:
					"Greymoor - at the top of the room just right of the Bell bench (unverified)",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Greymoor_02", "Silk Spool"],
				},
			},
			{
				name: "Spool Fragment 5",
				whichAct: 1,
				prereqs: ["Cling Grip"],
				location:
					"Middle-left of the Slab. In one of the outdoor rooms which have the cold effect from Mount Fay (unverified)",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Peak_01", "Silk Spool"],
				},
			},
			{
				name: "Spool Fragment 6",
				whichAct: 1,
				prereqs: ["Cling Grip"],
				location: "Weavenest Atla (unverified)",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Weave_11", "Silk Spool"],
				},
			},
			{
				name: "Spool Fragment 7",
				whichAct: 1,
				prereqs: ["Needolin"],
				location: "Purchased from Bellhart merchant (unverified)",
				parsingInfo: {
					type: "flag",
					internalId: "PurchasedBelltownSpoolSegment",
				},
			},
			{
				name: "Spool Fragment 8",
				whichAct: 2,
				prereqs: [],
				location: "Bottom-right of Cogwork Core (unverified)",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Cog_07", "Silk Spool"],
				},
			},
			{
				name: "Spool Fragment 9",
				whichAct: 2,
				prereqs: [],
				location:
					"Maybe the one near east Underworks, accessible via a lift after Trobbio (unverified)",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Library_11b", "Silk Spool"],
				},
			},
			{
				name: "Spool Fragment 10",
				whichAct: 2,
				prereqs: [],
				location: "Top of the Grand Gate room (unverified)",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Song_19_entrance", "Silk Spool"],
				},
			},
			{
				name: "Spool Fragment 11",
				whichAct: 2,
				prereqs: [],
				location:
					"Underworks - Behind a challenge room nearby the Ventrica station (unverified)",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Under_10", "Silk Spool"],
				},
			},
			{
				name: "Spool Fragment 12",
				whichAct: 2,
				prereqs: [],
				location: "Whiteward - bottom of lift shaft (unverified)",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Ward_01", "Silk Spool"],
				},
			},
			{
				name: "Spool Fragment 13",
				whichAct: 2,
				prereqs: [],
				location: "Balm for The Wounded quest reward (unverified)",
				parsingInfo: {
					type: "quest",
					internalId: "Save Sherma",
				},
			},
			{
				name: "Spool Fragment 14",
				whichAct: 2,
				prereqs: ["Clawline"],
				location: "Top of the high halls (unverified)",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Hang_03_top", "Silk Spool"],
				},
			},

			{
				name: "Spool Fragment 15",
				whichAct: 2,
				prereqs: ["Clawline"],
				location:
					"Far east of Deep docks, near the lower Far fields entrance (unverified)",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Bone_East_13", "Silk Spool"],
				},
			},
			{
				name: "Spool Fragment 16",
				whichAct: 2,
				prereqs: ["Faydown Cloak"],
				location: "Left of Memorium (unverified)",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Arborium_09", "Silk Spool"],
				},
			},
			{
				name: "Spool Fragment 17",
				whichAct: 2,
				prereqs: ["Faydown Cloak"],
				location: "Purchased from Grindle in Blasted Steps (unverified)",
				parsingInfo: {
					type: "flag",
					internalId: "purchasedGrindleSpoolPiece",
				},
			},
			{
				name: "Spool Fragment 18",
				whichAct: 2,
				prereqs: ["Faydown Cloak"],
				location:
					"Purchased from Jubilana after saving her as part of the The Lost Merchant quest (unverified)",
				parsingInfo: {
					type: "flag",
					internalId: "MerchantEnclaveSpoolPiece",
				},
			},
		],
	},
	{
		name: "Skills",
		necessity: "main",
		tooltip: "Damaging skills which consume silk. Each skill counts as 1%",
		formula: (acquiredItems) => acquiredItems.length,
		items: [
			{
				name: "Silk Spear",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Silk Spear" },
			},
			{
				name: "Thread Sphere",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Thread Sphere" },
			},
			{
				name: "Parry",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Parry" },
			},
			{
				name: "Silk Bomb",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Silk Bomb" },
			},
			{
				name: "Silk Charge",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Silk Charge" },
			},
			{
				name: "Silk Boss Needle",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Silk Boss Needle" },
			},
		],
	},
	{
		name: "Tools",
		necessity: "main",
		tooltip:
			"Red, yellow, and blue tools. Each tool counts as 1%. Upgrading tools does not affect completion %.",
		formula: (acquiredItems) => acquiredItems.length,
		items: [
			{
				name: "Bone Necklace",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Bone Necklace" },
			},
			{
				name: "Compass",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Compass" },
			},

			{
				name: "Mosscreep Tool 1",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Mosscreep Tool 1" },
			},
			{
				name: "Straight Pin",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Straight Pin" },
			},
			{
				name: "Bell Bind",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Bell Bind" },
			},
			{
				name: "Tri Pin",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Tri Pin" },
			},

			{
				name: "Harpoon",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Harpoon" },
			},
			{
				name: "Dead Mans Purse",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Dead Mans Purse" },
			},
			{
				name: "Rosary Magnet",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Rosary Magnet" },
			},
			{
				name: "Lava Charm",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Lava Charm" },
			},
			{
				name: "Flea Brew",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Flea Brew" },
			},
			{
				name: "Barbed Wire",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Barbed Wire" },
			},
			{
				name: "Tack",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Tack" },
			},
			{
				name: "Pimpilo",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Pimpilo" },
			},
			{
				name: "Weavelight",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "White Ring" },
			},
			{
				name: "Flintstone",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Flintstone" },
			},
			{
				name: "Sprintmaster",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Sprintmaster" },
			},
			{
				name: "Screw Attack",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Screw Attack" },
			},
			{
				name: "Pollip Pouch",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Poison Pouch" },
			},
			{
				name: "Injector Band",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Quickbind" },
			},
			{
				name: "Plasmium Phial",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Lifeblood Syringe" },
			},
			{
				name: "Wallcling",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Wallcling" },
			},
			{
				name: "Memory Crystal",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Revenge Crystal" },
			},

			{
				name: "Thief Charm",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Thief Charm" },
			},
			{
				name: "Conch Drill",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Conch Drill" },
			},
			{
				name: "Quick Sling",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Quick Sling" },
			},
			{
				name: "Wisp Lantern",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Wisp Lantern" },
			},
			{
				name: "Cogwork Flier",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Cogwork Flier" },
			},
			{
				name: "Rosary Cannon",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Rosary Cannon" },
			},
			{
				name: "Maggot Charm",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Maggot Charm" },
			},
			{
				name: "Reserve Bind",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Reserve Bind" },
			},
			{
				name: "Weighted Anklet",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Weighted Anklet" },
			},

			{
				name: "Longneedle",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Longneedle" },
			},
			{
				name: "Shakra Ring",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Shakra Ring" },
			},
			{
				name: "Scuttlebrace",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Scuttlebrace" },
			},
			{
				name: "Fractured Mask",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Fractured Mask" },
			},
			{
				name: "Zap Imbuement",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Zap Imbuement" },
			},
			{
				name: "WebShot Forge",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "WebShot Forge" },
			},
			{
				name: "Sting Shard",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Sting Shard" },
			},
			{
				name: "Curveclaw/Curvesickle",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: {
					type: "upgradabletool",
					internalId: ["Curve Claws", "Curve Claws Upgraded"],
				},
			},
			{
				name: "Musician Charm",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Musician Charm" },
			},
			{
				name: "Spool Extender",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Spool Extender" },
			},
			{
				name: "Multibind",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Multibind" },
			},
			{
				name: "Pinstress Tool",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Pinstress Tool" },
			},
			{
				name: "Cogwork Saw",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Cogwork Saw" },
			},
			{
				name: "Thief Claw",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Thief Claw" },
			},
			{
				name: "Magnetite Dice",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Magnetite Dice" },
			},
			{
				name: "Brolly Spike",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Brolly Spike" },
			},
			{
				name: "Claw Mirror(s)",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: {
					type: "upgradabletool",
					internalId: ["Dazzle Bind", "Dazzle Bind Upgraded"],
				},
			},
			{
				name: "Lightning Rod",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Lightning Rod" },
			},
			{
				name: "Flea Charm",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tool", internalId: "Flea Charm" },
			},
		],
	},
	{
		name: "Needle upgrades",
		necessity: "main",
		tooltip: "Each needle upgrade counts as 1%.",
		formula: (acquiredItems) => acquiredItems.length,
		items: [
			{
				name: "upgrade 1",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tempintflag", internalId: ["nailUpgrades", 1] },
			},
			{
				name: "upgrade 2",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tempintflag", internalId: ["nailUpgrades", 2] },
			},
			{
				name: "upgrade 3",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tempintflag", internalId: ["nailUpgrades", 3] },
			},
			{
				name: "upgrade 4",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: { type: "tempintflag", internalId: ["nailUpgrades", 4] },
			},
		],
	},
	{
		name: "Crafting kit upgrades",
		necessity: "main",
		tooltip: "Each crafting kit upgrade counts as 1%.",
		formula: (acquiredItems) => acquiredItems.length,
		items: [
			{
				name: "upgrade 1",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: {
					type: "tempintflag",
					internalId: ["ToolKitUpgrades", 1],
				},
			},
			{
				name: "upgrade 2",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: {
					type: "tempintflag",
					internalId: ["ToolKitUpgrades", 2],
				},
			},
			{
				name: "upgrade 3",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: {
					type: "tempintflag",
					internalId: ["ToolKitUpgrades", 3],
				},
			},
			{
				name: "upgrade 4",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: {
					type: "tempintflag",
					internalId: ["ToolKitUpgrades", 4],
				},
			},
		],
	},
	{
		name: "Tool pouch upgrades",
		necessity: "main",
		tooltip: "Each tool pouch upgrade counts as 1%.",
		formula: (acquiredItems) => acquiredItems.length,
		items: [
			{
				name: "upgrade 1",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: {
					type: "tempintflag",
					internalId: ["ToolPouchUpgrades", 1],
				},
			},
			{
				name: "upgrade 2",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: {
					type: "tempintflag",
					internalId: ["ToolPouchUpgrades", 2],
				},
			},
			{
				name: "upgrade 3",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: {
					type: "tempintflag",
					internalId: ["ToolPouchUpgrades", 3],
				},
			},
			{
				name: "upgrade 4",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: {
					type: "tempintflag",
					internalId: ["ToolPouchUpgrades", 4],
				},
			},
		],
	},
	{
		name: "Crests",
		necessity: "main",
		tooltip: "Each crest (other than the base Hunter) counts as 1%.",
		formula: (acquiredItems) => acquiredItems.length - 1,
		items: [
			{
				name: "Hunter",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: {
					type: "crest",
					internalId: "Hunter",
				},
			},
			{
				name: "Wanderer",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: {
					type: "crest",
					internalId: "Wanderer",
				},
			},
			{
				name: "Reaper",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: {
					type: "crest",
					internalId: "Reaper",
				},
			},
			{
				name: "Beast",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: {
					type: "crest",
					internalId: "Warrior",
				},
			},
			{
				name: "Architect",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: {
					type: "crest",
					internalId: "Toolmaster",
				},
			},
			{
				name: "Witch",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: {
					type: "crest",
					internalId: "Witch",
				},
			},
			{
				name: "Shaman",
				whichAct: 0,
				prereqs: [],
				location: "TODO",
				parsingInfo: {
					type: "crest",
					internalId: "Spell",
				},
			},
		],
	},
	{
		name: "Silk hearts",
		necessity: "main",
		tooltip: "Each silk heart counts as 1%.",
		formula: (acquiredItems) => acquiredItems.length,
		items: [
			{
				name: "Silk heart 1",
				whichAct: 1,
				prereqs: [],
				location: "After Bell Beast boss fight",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Memory_Silk_Heart_BellBeast", "glow_rim_Remasker"],
				},
			},
			{
				name: "Silk heart 2",
				whichAct: 2,
				prereqs: [],
				location: "Whiteward - the Unravelled boss fight",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Memory_Silk_Heart_WardBoss", "glow_rim_Remasker"],
				},
			},
			{
				name: "Silk heart 3",
				whichAct: 2,
				prereqs: [],
				location: "After Lace (cradle) bossfight",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Memory_Silk_Heart_LaceTower", "glow_rim_Remasker"],
				},
			},
		],
	},
	{
		name: "Abilities",
		necessity: "main",
		tooltip: "Each ability counts as 1%.",
		formula: (acquiredItems) => acquiredItems.length,
		items: [
			{
				name: "Swift step",
				whichAct: 1,
				prereqs: [],
				location: "TODO",
				parsingInfo: {
					type: "flag",
					internalId: "hasDash",
				},
			},
			{
				name: "Wall Cling",
				whichAct: 1,
				prereqs: [],
				location: "TODO",
				parsingInfo: {
					type: "flag",
					internalId: "hasWalljump",
				},
			},
			{
				name: "Needolin",
				whichAct: 1,
				prereqs: [],
				location: "TODO",
				parsingInfo: {
					type: "flag",
					internalId: "hasNeedolin",
				},
			},
			{
				name: "Clawline",
				whichAct: 2,
				prereqs: [],
				location: "TODO",
				parsingInfo: {
					type: "flag",
					internalId: "hasHarpoonDash",
				},
			},
			{
				name: "Needle Strike",
				whichAct: 2,
				prereqs: [],
				location: "TODO",
				parsingInfo: {
					type: "flag",
					internalId: "hasChargeSlash",
				},
			},
			{
				name: "Silksoar",
				whichAct: 3,
				prereqs: [],
				location: "TODO",
				parsingInfo: {
					type: "flag",
					internalId: "hasSuperJump",
				},
			},
			{
				name: "Sylphsong",
				whichAct: 3,
				prereqs: [],
				location: "TODO",
				parsingInfo: {
					type: "flag",
					internalId: "HasBoundCrestUpgrader",
				},
			},
		],
	},
	{
		name: "Miscellaneous",
		necessity: "main",
		tooltip: "Misc.",
		formula: (acquiredItems) => acquiredItems.length,
		items: [
			{
				name: "Everbloom",
				whichAct: 3,
				prereqs: [],
				location: "TODO",
				parsingInfo: {
					type: "collectable",
					internalId: "White Flower",
				},
			},
		],
	},
];
