const GAS_URL = process.env.NEXT_PUBLIC_GAS_URL;

type GasError = {
  error?: string;
  message?: string;
};

export async function callGAS<T>(payload: object): Promise<T> {
  if (!GAS_URL) {
    throw new Error("Chua cau hinh NEXT_PUBLIC_GAS_URL.");
  }

  // Call through Next.js API route (server-side) to avoid CORS issues
  const response = await fetch("/api/employee", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const result = (await response.json()) as T & GasError;

  if (!response.ok || result.error) {
    throw new Error(result.message || result.error || "Khong the ket noi Apps Script.");
  }

  return result;
}