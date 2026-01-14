import { NextResponse } from "next/server";

const USERNAME = "masonliiu";
const CACHE_SECONDS = 60 * 60 * 6;

type ContributionDay = {
  date: string;
  count: number;
};

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "Missing GITHUB_TOKEN" },
      { status: 500 }
    );
  }

  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 365);

  const query = `
    query($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "masonliu-portfolio",
      },
      body: JSON.stringify({
        query,
        variables: {
          login: USERNAME,
          from: from.toISOString(),
          to: to.toISOString(),
        },
      }),
      next: { revalidate: CACHE_SECONDS },
    });

    if (!response.ok) {
      throw new Error("GitHub GraphQL request failed");
    }

    const data = (await response.json()) as {
      data?: {
        user?: {
          contributionsCollection?: {
            contributionCalendar?: {
              weeks?: Array<{
                contributionDays?: Array<{
                  date: string;
                  contributionCount: number;
                }>;
              }>;
            };
          };
        };
      };
    };

    const weeks =
      data.data?.user?.contributionsCollection?.contributionCalendar?.weeks ??
      [];

    const days: ContributionDay[] = weeks.flatMap((week) =>
      (week.contributionDays ?? []).map((day) => ({
        date: day.date,
        count: day.contributionCount,
      }))
    );

    return NextResponse.json(
      { days },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=600`,
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "GitHub contributions unavailable" },
      { status: 500 }
    );
  }
}
