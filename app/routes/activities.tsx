import { useQuery } from "convex/react";

import { ActivityForm } from "~/components/activity-form";
import { ActivityList } from "~/components/activity-list";
import { api } from "../../convex/_generated/api";

export async function loader() {
  return {};
}

export default function Activities() {
  const activities = useQuery(api.activities.get);

  return (
    <div className="flex flex-col gap-y-4">
      <ActivityForm />
      <ActivityList activities={activities} />
    </div>
  );
}
