import useQueryParams from "./CustomParams";
import { useEffect, useState } from "react";

export default function SearchInput(
  props: React.ComponentPropsWithoutRef<"input">,
) {
  const [inputContent, setInputContent] = useState("");
  const { queryParams, setQueryParams } = useQueryParams();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setQueryParams({
        search: "",
      });
    }

    setInputContent(() => {
      return e.target.value;
    });
  };

  //After 2 seconds set search to input
  useEffect(() => {
    if (!inputContent.trim() || !inputContent) return;

    if (queryParams.get("search") && queryParams.get("search") === inputContent)
      return;

    const updateParam = setTimeout(() => {
      setQueryParams({
        search: inputContent,
      });
    }, 1200);

    return () => clearTimeout(updateParam);
  }, [inputContent, setQueryParams, queryParams]);
  return <input value={inputContent} onChange={handleChange} {...props} />;
}
