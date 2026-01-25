import { invoke } from "@tauri-apps/api/core";

export class ApiKeyManager {
  // save API Key to secure storage
  static async save(apiKey: string): Promise<void> {
    try {
      await invoke("save_api_key", { apiKey });
    } catch (error) {
      console.error("Failed to save API key: ", error);
      throw new Error("Failed to save API key securely");
    }
  }

  // load API key from secure storage
  static async load(): Promise<string | null> {
    try {
      const apiKey = await invoke<string>("load_api_key");
      return apiKey;
    } catch (error) {
      return null;
    }
  }

  // delete API key from secure storage
  static async delete(): Promise<void> {
    try {
      await invoke("delete_api_key");
    } catch (error) {
      console.error("Failed to delete API key: ", error);
      throw new Error("Failed to delete API key.");
    }
  }

  // check if API key exists in secure storage
  static async exists(): Promise<boolean> {
    try {
      return await invoke<boolean>("has_api_key");
    } catch (error) {
      return false;
    }
  }
}
