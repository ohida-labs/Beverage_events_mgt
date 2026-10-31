import { useFetcher } from "react-router";
import { useEffect } from "react";

interface Distributor {
  user_id: string;
  first_name: string;
  email?: string;
  phone_number?: string;
}
export function AssignNewDistributor() {
  const fetcher = useFetcher();

  useEffect(() => {
    fetcher.load("/admin/users?role=distribution_staff");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const users = (fetcher.data?.users as Distributor[]) ?? [];

  return (
    <fetcher.Form method="post" className="space-y-2">
      <input type="hidden" name="action" value="assign" />

      <select name="handled_by" className="w-fit" id="handled_by">
        <option value="">Select personnel</option>
        {users.map((user) => (
          <option key={user.user_id} value={user.user_id}>
            <div className="flex flex-col gap-3">
              <p className="block">{user.first_name} </p>
              <p className="text-xs text-muted">
                ({user.phone_number ?? user.email})
              </p>
            </div>
          </option>
        ))}
      </select>

      {fetcher.state === "loading" && <p>Loading personnel...</p>}

      <button type="submit" className="submit_button w-fit">
        Assign distribution staff
      </button>
    </fetcher.Form>
  );
}
