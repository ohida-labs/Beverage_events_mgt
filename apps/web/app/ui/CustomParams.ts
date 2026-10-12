//Set url param for filtering data;
import { useSearchParams, useNavigate, useLocation } from "react-router";
//Set search params
export default function useQueryParams() {
  const router = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const [searchParams] = useSearchParams();

  const URLsearchParams = new URLSearchParams(searchParams?.toString());

  function setQueryParams(p: {
    page?: number;
    limit?: number;
    sort?: string;
    search?: string;
  }) {
    Object.entries(p).forEach(([key, value]) => {
      if (key === "search" && value === URLsearchParams.get("search")) return;
      if (value === undefined || value === null) {
        URLsearchParams.delete(key);
      } else {
        URLsearchParams.set(key, String(value));
      }
    });

    const search = URLsearchParams.toString();
    const query = search ? `?${search}` : "";
    router(`${pathname}${query}`, { replace: true });
  }

  return { queryParams: searchParams, setQueryParams };
}
