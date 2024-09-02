import { Plugin } from "obsidian";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface KeePassPluginSettings {}

const DEFAULT_SETTINGS: KeePassPluginSettings = {};

export default class KeePassPlugin extends Plugin {
	settings: KeePassPluginSettings;

	async onload() {
		await this.loadSettings();

		this.addRibbonIcon('vault', 'Open KeePass', () => {
			this.OpenKeePass(null);
		});

		this.addCommand({
			id: "open-keepass",
			name: "Open KeePass",
			callback: () => {
				this.OpenKeePass(null);
			},
		});


	}

	OpenKeePass(path: string | null) {
		
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
