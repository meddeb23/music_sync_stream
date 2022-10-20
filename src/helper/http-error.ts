export default function makeHttpError(status: number, errorMessage: string) {
  return {
    headers: {
      "Content-Type": "application/json",
    },
    status,
    data: {
      success: false,
      error: errorMessage,
    },
  };
}
