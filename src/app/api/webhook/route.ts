import httpSignature from "http-signature";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { BOLD_COMMERCE_SHARED_SECRET } = process.env;

  if (!BOLD_COMMERCE_SHARED_SECRET) {
    // return res.status(500).json({ error: "Shared secret not found" });
    return new Response("Shared secret not found", { status: 500 });
  }

  try {
    console.log(req, "REQUEST");
    const body = await req.json();
    console.log(body, "BODY");
    // Avoid failing validation if date header contains `request-target`.
    // const tempURL = req.url;
    // req.url = req.originalUrl
    // const parsed = httpSignature.parse(req);
    // req.url = tempURL;

    // Verify that the request originated from Bold Checkout.
    // if (httpSignature.verifyHMAC(parsed, BOLD_COMMERCE_SHARED_SECRET)) {
    //   console.log(req.body);
    // } else {
    //   return new Response("", { status: 401 });
    // }
  } catch (error) {
    return new Response("", { status: 401 });
  }

  //   return NextResponse.json({ message: 's', })
}
