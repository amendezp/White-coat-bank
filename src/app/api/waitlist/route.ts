import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "waitlist-data.json");
const ADMIN_KEY = process.env.SURVEY_ADMIN_KEY;

interface WaitlistEntry {
  email: string;
  joinedAt: string;
  referralCode: string;
  referredBy: string | null;
}

function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

async function readData(): Promise<WaitlistEntry[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeData(data: WaitlistEntry[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function POST(req: NextRequest) {
  const { email, referredBy } = await req.json();

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json(
      { error: "Invalid email" },
      { status: 400 },
    );
  }

  const normalized = email.toLowerCase().trim();
  const data = await readData();

  // Duplicate check
  const existing = data.find((d) => d.email === normalized);
  if (existing) {
    return NextResponse.json({
      ok: true,
      position: data.indexOf(existing) + 1,
      referralCode: existing.referralCode,
      duplicate: true,
    });
  }

  const referralCode = generateReferralCode();
  data.push({
    email: normalized,
    joinedAt: new Date().toISOString(),
    referralCode,
    referredBy: referredBy || null,
  });

  await writeData(data);

  return NextResponse.json({
    ok: true,
    position: data.length,
    referralCode,
    duplicate: false,
  });
}

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  const data = await readData();

  // Authenticated: return full data
  if (key) {
    if (!ADMIN_KEY || key !== ADMIN_KEY) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const format = req.nextUrl.searchParams.get("format");
    if (format === "csv") {
      const headers = [
        "email",
        "joinedAt",
        "referralCode",
        "referredBy",
      ];
      const rows = data.map((d) =>
        headers
          .map((h) => {
            const val = d[h as keyof WaitlistEntry];
            return `"${String(val ?? "").replace(/"/g, '""')}"`;
          })
          .join(","),
      );
      const csv = [headers.join(","), ...rows].join("\n");
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition":
            "attachment; filename=waitlist.csv",
        },
      });
    }

    return NextResponse.json(data);
  }

  // Public: just return count
  return NextResponse.json({ count: data.length });
}
