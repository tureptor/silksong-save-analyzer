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
 * @typedef {FlagParsingInfo | QuestParsingInfo | SceneDataParsingInfo} ParsingInfo
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
		flag: (info) => !!playerData[info.internalId],

		quest: (info) => {
			const questEntry = playerData.QuestCompletionData?.savedData?.find(
				(x) => x.Name === info.internalId,
			);

			return questEntry?.Data?.IsCompleted ?? false;
		},

		sceneData: (info) => {
			const [sceneName, Id] = info.internalId;
			const scene = sceneData.find(
				(x) => x.SceneName === sceneName && x.ID === Id,
			);
			return scene?.Value ?? false;
		},
	};

	const handler = typeHandlers[itemParsingInfo.type];
	if (!handler) throw new Error("Unknown ParsingInfo type");

	return handler(itemParsingInfo);
}

/**
 * @type {Record<string, CollectableCategory>}
 */
export const collectables = [
	{
		name: "maskShards",
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
				prereqs: ["dash"],
				location: "Wormways???",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Crawl_02", "Heart Piece"],
				},
			},
			{
				name: "Mask Shard 3",
				whichAct: 1,
				prereqs: ["featherfall"],
				location: "far fields near Shakra?",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Bone_East_20", "Heart Piece"],
				},
			},
			{
				name: "Mask Shard 4",
				whichAct: 1,
				prereqs: ["featherfall"],
				location: "shellwood?",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Shellwood_14", "Heart Piece"],
				},
			},
			{
				name: "Mask Shard 5",
				whichAct: 1,
				prereqs: ["walljump"],
				location: "west deep docks?",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Dock_08", "Heart Piece"],
				},
			},
			{
				name: "Mask Shard 6",
				whichAct: 1,
				prereqs: ["needolin"],
				location: "Weavenest Atla?",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Weave_05b", "Heart Piece"],
				},
			},
			{
				name: "Mask Shard 7",
				whichAct: 1,
				prereqs: [],
				location: "Savage Beastfly quest",
				parsingInfo: {
					type: "quest",
					internalId: "Beastfly Hunt",
				},
			},
			{
				name: "Mask Shard 8",
				whichAct: 2,
				prereqs: [],
				location: "between choral chambers/cogwork core?",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Song_09", "Heart Piece"],
				},
			},
			{
				name: "Mask Shard 9",
				whichAct: 2,
				prereqs: [],
				location: "Whispering vaults?",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Library_05", "Heart Piece"],
				},
			},
			{
				name: "Mask Shard 10",
				whichAct: 2,
				prereqs: ["clawline"],
				location: "Bilewater?",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Shadow_13", "Heart Piece"],
				},
			},
			{
				name: "Mask Shard 11",
				whichAct: 2,
				prereqs: ["clawline"],
				location: "top of skull cavern?",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Bone_East_LavaChallenge", "Heart Piece (1)"],
				},
			},
			{
				name: "Mask Shard 12",
				whichAct: 2,
				prereqs: ["clawline"],
				location: "top of slab?",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Slab_17", "Heart Piece"],
				},
			},
			{
				name: "Mask Shard 13",
				whichAct: 2,
				prereqs: ["doublejump"],
				location: "left of mount fay?",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Peak_04c", "Heart Piece"],
				},
			},
			{
				name: "Mask Shard 14",
				whichAct: 2,
				prereqs: ["doublejump"],
				location: "right of wisp thicket?",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Wisp_07", "Heart Piece"],
				},
			},
			{
				name: "Mask Shard 15",
				whichAct: 2,
				prereqs: ["doublejump"],
				location: "Jubilana?",
				parsingInfo: {
					type: "flag",
					internalId: "MerchantEnclaveShellFragment",
				},
			},
			{
				name: "Mask Shard 17",
				whichAct: 3,
				prereqs: [],
				location: "Fastest in Pharloom quest",
				parsingInfo: {
					type: "quest",
					internalId: "Sprintmaster Race",
				},
			},
			{
				name: "Mask Shard 18",
				whichAct: 3,
				prereqs: [],
				location: "Hidden Hunter quest",
				parsingInfo: {
					type: "quest",
					internalId: "Ant Trapper",
				},
			},
			{
				name: "Mask Shard 19",
				whichAct: 3,
				prereqs: [],
				location: "Dark hearts quest",
				parsingInfo: {
					type: "quest",
					internalId: "Destroy Thread Cores",
				},
			},
			{
				name: "Mask Shard 20",
				whichAct: 3,
				prereqs: ["superjump"],
				location: "Left of blasted steps?",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Coral_19b", "Heart Piece"],
				},
			},
			{
				name: "Mask Shard 16",
				whichAct: 3,
				prereqs: ["superjump"],
				location: "brightvein?",
				parsingInfo: {
					type: "sceneData",
					internalId: ["Peak_06", "Heart Piece"],
				},
			},
		],
	},
];
