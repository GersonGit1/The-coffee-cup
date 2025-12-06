export async function GET() {
  return Response.json({
    databaseUrl: process.env.DATABASE_URL || 'NO ENV FOUND',
  });
}
