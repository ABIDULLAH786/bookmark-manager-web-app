export function apiError(status: number, message: string, errors?: any) {
  return Response.json(
    {
      success: false,
      message,
      errors: errors || null,
    },
    { status }
  );
}
