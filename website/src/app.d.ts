
// src/app.d.ts
import PocketBase from "pocketbase";

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
    interface Locals {
      pb: PocketBase
  }
    // interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
