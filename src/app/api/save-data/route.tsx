// pages/api/saveEntry.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/app/utils/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const data = req.body;

    try {
      const { error } = await supabase.from("userTable").insert(data);
      if (error) throw error;

      res.status(200).json({ message: "Data saved successfully!" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
