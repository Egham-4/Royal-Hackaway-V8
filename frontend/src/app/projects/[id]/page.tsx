export default function ProjectPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>Project {params.id} Analysis</h1>
      {/* Add your project-specific content here */}
    </div>
  );
}
