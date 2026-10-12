/*
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons"; */

import useQueryParams from "./CustomParams";

export default function PaginateButton({
  total_item_length,
}: {
  total_item_length: number;
}) {
  const { queryParams, setQueryParams } = useQueryParams();

  const page = Number(queryParams.get("page")) || 1;
  const limit = Number(queryParams.get("limit")) || 30;

  return (
    <div
      className="flex border border-gray-200 
    rounded-lg overflow-hidden"
    >
      <button
        onClick={() => {
          if (!page || Number(page) <= 1) return;

          setQueryParams({
            page: Number(page) - 1,
          });
        }}
        className="px-3  py-2 hover:bg-gray-100"
      >
        {/*   <FontAwesomeIcon icon={faChevronLeft} /> */}
      </button>
      <span className="text-base px-3 py-2">{page}</span>
      <button
        onClick={() => {
          if (total_item_length < limit) return;
          if (page === 1) {
            setQueryParams({
              page: 2,
            });
            return;
          }

          setQueryParams({
            page: Number(page) + 1,
          });
        }}
        disabled={total_item_length <= page * limit}
        className="px-3 py-2  disabled:bg-muted/10 disabled:text-text-muted hover:bg-gray-100"
      >
        {/* <FontAwesomeIcon icon={faChevronRight} /> */}
      </button>
    </div>
  );
}
