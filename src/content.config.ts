import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

function removeDupsAndLowerCase(array: string[]) {
	return [...new Set(array.map((str) => str.toLowerCase()))];
}

const baseSchema = z.object({
	title: z.string().max(60),
});

const post = defineCollection({
	loader: glob({ base: "./src/content/post", pattern: "**/*.{md,mdx}" }),
	schema: ({ image }) =>
		baseSchema.extend({
			description: z.string(),
			coverImage: z
				.object({
					alt: z.string(),
					src: image(),
				})
				.optional(),
			draft: z.boolean().default(false),
			ogImage: z.string().optional(),
			tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
			publishDate: z
				.string()
				.or(z.date())
				.transform((val) => new Date(val)),
			stats: z.string().optional(),
			updatedDate: z
				.string()
				.optional()
				.transform((str) => (str ? new Date(str) : undefined)),
		}),
});

const note = defineCollection({
	loader: glob({ base: "./src/content/note", pattern: "**/*.{md,mdx}" }),
	schema: baseSchema.extend({
		description: z.string().optional(),
		publishDate: z
			.string()
			.datetime({ offset: true }) // Ensures ISO 8601 format with offsets allowed (e.g. "2024-01-01T00:00:00Z" and "2024-01-01T00:00:00+02:00")
			.transform((val) => new Date(val)),
	}),
});

const project = defineCollection({
	loader: glob({ base: "./src/content/project", pattern: "**/*.{md,mdx}" }),
	schema: baseSchema.extend({
		description: z.string(),
		year: z.string(),
		status: z
			.enum(["completed", "in-progress", "planned"])
			.default("completed"),
		logo: z.string(), // emoji or icon name
		background: z
			.enum([
				"gradient-blue",
				"gradient-purple",
				"gradient-green",
				"gradient-orange",
				"gradient-pink",
				"solid-blue",
				"solid-green",
				"solid-purple",
				"solid-orange",
				"solid-pink",
				"solid-yellow",
			])
			.default("gradient-blue"),
		tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
		metrics: z
			.array(
				z.object({
					icon: z.string(),
					value: z.string(),
					label: z.string(),
				}),
			)
			.optional(),
		link: z.string().url().optional(),
		github: z.string().url().optional(),
		demo: z.string().url().optional(),
	}),
});

export const collections = { post, note, project };
