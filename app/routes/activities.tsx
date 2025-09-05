import type { Route } from "./+types/activities";

import { ActivityForm } from "~/components/activity-form";
import { ActivityList } from "~/components/activity-list";

export async function loader() {
  return {};
}

export default function Activities() {
  return (
    <div className="flex flex-col gap-y-4">
      <ActivityForm onActivityAdded={() => {}} />
      <ActivityList activities={[]} onActivityDeleted={() => {}} />
    </div>
  );
}
