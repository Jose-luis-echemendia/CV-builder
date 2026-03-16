import { createFileRoute } from '@tanstack/react-router';
import {Hero} from '@/components/Common/Hero';
export const Route = createFileRoute('/_layout/')({
  component: Home,
});

function Home() {
  return (
    <div>
      <Hero/>
    </div>
  );
}
