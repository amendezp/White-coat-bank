import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "survey-data.json");
const ADMIN_KEY = process.env.SURVEY_ADMIN_KEY;

async function readData() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeData(data: unknown[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const data = await readData();
  data.push(body);
  await writeData(data);
  return NextResponse.json({ ok: true });
}

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!ADMIN_KEY || key !== ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await readData();

  const format = req.nextUrl.searchParams.get("format");
  if (format === "csv") {
    const headers = [
      "email",
      "careerStage",
      "currentCards",
      "topProducts",
      "dreamFeature",
      "submittedAt",
    ];
    const rows = data.map((d: Record<string, unknown>) =>
      headers
        .map((h) => {
          const val = d[h];
          if (Array.isArray(val)) return `"${val.join("; ")}"`;
          return `"${String(val || "").replace(/"/g, '""')}"`;
        })
        .join(","),
    );
    const csv = [headers.join(","), ...rows].join("\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=survey-responses.csv",
      },
    });
  }

  return NextResponse.json(data);
}
