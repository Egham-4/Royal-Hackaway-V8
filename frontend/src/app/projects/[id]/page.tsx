export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // Await the entire params object

  return (
    <div>
      <h1>Project {id} Analysis</h1>
    </div>
  );
}
