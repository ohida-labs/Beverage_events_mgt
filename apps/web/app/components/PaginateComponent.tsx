import useQueryParams from "../ui/CustomParams";
import PaginateButton from "../ui/paginateButton";
import { SelectActionButton } from "../ui/select";

export default function TotalPagination() {
  const { queryParams, setQueryParams } = useQueryParams();

  return (
    <div className="flex items-center justify-between mt-6">
      <p className="text-sm text-gray-600">
        Total <span className="font-semibold">45</span>
      </p>
      <article className="flex items-center gap-4">
        <SelectActionButton
          title={queryParams?.get("limit") ?? "30"}
          logo_right={true}
          //logo_style="text-black"
          //logo={faChevronDown}
        >
          <li>
            <button
              onClick={() =>
                setQueryParams({
                  limit: 30,
                })
              }
            >
              30
            </button>
          </li>
          <li>
            <button
              onClick={() =>
                setQueryParams({
                  limit: 50,
                })
              }
            >
              50
            </button>
          </li>
          <li>
            <button
              onClick={() =>
                setQueryParams({
                  limit: 100,
                })
              }
            >
              100
            </button>
          </li>
        </SelectActionButton>
        <PaginateButton total_item_length={900} />
      </article>
    </div>
  );
}
