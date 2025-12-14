/// <reference path="../.astro/types.d.ts" />

declare namespace App {
	interface Locals {
		user: (import("better-auth").User & { avatar?: string | null; role?: import("../types").UserRole }) | null;
        session: import("better-auth").Session | null;
        isAdmin: boolean;
		lang?: string;
		t?: (key: string, lang?: string) => string;
	}
}
