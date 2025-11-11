export interface EfficientFrontierResponse {
  // weights: [{ fund, weight }]
  weights: Array<{ fund: string; weight: number }>;
  // optional rawText for debugging
  rawText?: string;
}

/**
 * Calls the backend endpoint to run the efficient frontier Python analysis
 * on the provided Excel/CSV file.
 *
 * Backend must accept multipart/form-data with a "file" field.
 * The endpoint URL is configured via VITE_ANALYSIS_ENDPOINT.
 */
export async function runEfficientFrontier(file: File): Promise<EfficientFrontierResponse> {
  const endpoint = import.meta.env.VITE_ANALYSIS_ENDPOINT as string | undefined;
  if (!endpoint) {
    throw new Error("Missing VITE_ANALYSIS_ENDPOINT configuration.");
  }

  const form = new FormData();
  form.append("file", file, file.name);

  const res = await fetch(`${endpoint.replace(/\/$/, "")}/efficient-frontier`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Backend error: ${res.status}`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return (await res.json()) as EfficientFrontierResponse;
  }

  // Fallback: parse plaintext "fund weight" lines
  const raw = await res.text();
  const weights: Array<{ fund: string; weight: number }> = [];
  raw
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l)
    .forEach((line) => {
      // try to split by whitespace: last token is weight, the rest is fund name
      const parts = line.split(/\s+/);
      const weightStr = parts[parts.length - 1];
      const fundName = parts.slice(0, -1).join(" ");
      const weight = Number(weightStr);
      if (fundName && !Number.isNaN(weight)) {
        weights.push({ fund: fundName, weight });
      }
    });

  if (weights.length === 0) {
    throw new Error("Unexpected backend response format.");
  }

  return { weights, rawText: raw };
}


