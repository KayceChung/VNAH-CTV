const GAS_URL = process.env.NEXT_PUBLIC_GAS_URL;

type GasError = {
  error?: string;
  message?: string;
};

export async function callGAS<T>(payload: object): Promise<T> {
  if (!GAS_URL) {
    throw new Error("Chua cau hinh NEXT_PUBLIC_GAS_URL.");
  }

  const response = await fetch(GAS_URL, {
    method: "POST",
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const result = (await response.json()) as T & GasError;

  if (!response.ok || result.error) {
    throw new Error(result.message || result.error || "Khong the ket noi Apps Script.");
  }

  return result;
}