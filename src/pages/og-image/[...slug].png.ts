import RobotoMonoBold from "@/assets/roboto-mono-700.ttf";
import RobotoMono from "@/assets/roboto-mono-regular.ttf";
import { getAllPosts } from "@/data/post";
import { siteConfig } from "@/site.config";
import { getFormattedDate } from "@/utils/date";
import { Resvg } from "@resvg/resvg-js";
import type { APIContext, InferGetStaticPropsType } from "astro";
import satori, { type SatoriOptions } from "satori";
import { html } from "satori-html";

const ogOptions: SatoriOptions = {
	// debug: true,
	fonts: [
		{
			data: Buffer.from(RobotoMono),
			name: "Roboto Mono",
			style: "normal",
			weight: 400,
		},
		{
			data: Buffer.from(RobotoMonoBold),
			name: "Roboto Mono",
			style: "normal",
			weight: 700,
		},
	],
	height: 630,
	width: 1200,
};

const markup = (title: string, pubDate: string) =>
	html`<div tw="flex flex-col w-full h-full bg-[#1d1f21] text-[#c9cacc]">
		<div tw="flex flex-col flex-1 w-full p-10 justify-center">
			<p tw="text-2xl mb-6">${pubDate}</p>
			<h1 tw="text-6xl font-bold leading-snug text-white">${title}</h1>
		</div>
		<div tw="flex items-center justify-between w-full p-10 border-t border-[#2bbc89] text-xl">
			<div tw="flex items-center">
				<svg height="60" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 580">
					<defs>
						<filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
							<feDropShadow
								dx="10"
								dy="10"
								stdDeviation="8"
								flood-color="black"
								flood-opacity="0.3"
							></feDropShadow>
						</filter>
					</defs>
					<g filter="url(#shadow)" transform="scale(-1,1) translate(-512,0)">
						<path
							d="M237.4 462.7c-49.1-28.2-52.3-30.2-52.8-32.2-2.1-8.4-66.6-349.1-66.2-350 0.3-0.9 58.7-35.4 68.2-40.3 1.8-1 6.6 1.4 36.5 18.7 23.7 13.6 34.8 20.6 35.5 22.2 0.6 1.3 3.8 16.5 7 33.6 3.3 17.2 6.2 31.3 6.5 31.3 0.4 0 12-6.6 25.8-14.6l25.2-14.7 26.7 15.4c38.8 22.3 43.3 25 43.8 26.3 0.4 1-61.6 249.3-67.1 269.1l-1.4 5.1-34.3 19.8c-18.9 11-34.6 20.1-34.9 20.2-0.3 0.2-8.7-4.3-18.5-9.9z"
							fill="#B04304"
						></path>
						<path
							d="M286.2 333c18-71.2 32.7-130.3 32.7-131.4 0-1.6-6.2-5.6-30-19.3-16.6-9.5-30.3-17.2-30.5-17-0.1 0.2-7.5 29.3-16.4 64.7-8.8 35.4-16.5 65.2-17.1 66.3-1.4 2.7-5 1.9-6-1.2-0.5-1.4-8.1-40.5-16.9-87-8.9-46.5-16.5-84.9-16.9-85.3-0.4-0.4-13.6-8.2-29.2-17.2-17.8-10.3-28.5-15.9-28.7-15.1-0.4 1.8 63.6 336.8 64.5 337.7 1.9 1.9 59.9 34.8 60.8 34.5 0.6-0.1 15.7-58.5 33.7-129.7z"
							fill="#FF5D01"
						></path>
						<path
							d="M291.7 444.3c15-8.6 27.5-16.4 27.7-17.2 0.3-0.8 15.4-60.7 33.7-133 20.5-81.4 32.8-132 32.2-132.7-0.4-0.8-14.5-9.2-31.2-18.9-25.9-14.9-30.8-17.4-32.6-16.6-1.2 0.6-13.1 7.4-26.4 15.1-13.3 7.8-25.1 14.1-26.2 14.1-1.1 0-2.3-1-2.8-2.2-0.4-1.3-3.6-17.1-7.1-35.3-3.4-18.1-6.5-33.3-6.8-33.6-0.4-0.4-14.9-8.9-32.2-18.9-23.1-13.3-31.9-17.9-33-17.3-0.8 0.5-14.2 8.3-29.8 17.3-22.3 12.9-28 16.6-27 17.5 0.7 0.7 14 8.5 29.6 17.5 15.5 8.9 29.2 17 30.3 17.9 1.7 1.4 4.2 13.2 16.9 79.6 8.3 42.9 15 78.5 15 79 0.2 3.2 3.2-7.9 16.5-60.7 11.7-46.5 15.2-58.9 16.5-59.3 1.8-0.6 66.5 35.8 70.4 39.6 1.9 1.7 1.2 4.4-30.8 131.6-18 71.4-33 130.7-33.3 131.7-0.8 2.7-0.4 2.6 30.4-15.2z"
							fill="#53C68C"
						></path>
					</g>
				</svg>
				<p tw="ml-3 font-semibold">${siteConfig.title}</p>
			</div>
			<p>by ${siteConfig.author}</p>
		</div>
	</div>`;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export async function GET(context: APIContext) {
	const { pubDate, title } = context.props as Props;

	const postDate = getFormattedDate(pubDate, {
		month: "long",
		weekday: "long",
	});
	const svg = await satori(markup(title, postDate), ogOptions);
	const png = new Resvg(svg).render().asPng();
	return new Response(png, {
		headers: {
			"Cache-Control": "public, max-age=31536000, immutable",
			"Content-Type": "image/png",
		},
	});
}

export async function getStaticPaths() {
	const posts = await getAllPosts();
	return posts
		.filter(({ data }) => !data.ogImage)
		.map((post) => ({
			params: { slug: post.id },
			props: {
				pubDate: post.data.updatedDate ?? post.data.publishDate,
				title: post.data.title,
			},
		}));
}
