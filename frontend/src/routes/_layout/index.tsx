import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/')({
  component: Home,
});

function Home() {
  return (
    <div>
      <h1>Hola, Build CV</h1>
    </div>
  );
}
