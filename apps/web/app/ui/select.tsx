/*Custom Ui: Select DropDown */
//import { faChevronDown, faSearch } from "@fortawesome/free-solid-svg-icons";
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

interface SelectIncomingData {
  name: string;
  id: string;
}

type SelectFormProp = {
  title: string | number;
  items: SelectIncomingData[];
  field: string;
  className?: string;
  hasSearch?: string;
  onChangeValue: ({ field, data }: { field: string; data: string }) => void;
};

type SelectActionButtonProp = {
  title: string;
  className?: string;
  logo?: string;
  logo_right?: boolean;
  logo_style?: string;
  children?: React.ReactNode;
  tag?: string;
};

export function SelectForm({
  hasSearch = "",
  title,
  field,
  className,
  onChangeValue,
  items,
}: SelectFormProp) {
  const [datalist, setDataList] = useState<SelectIncomingData[] | null>([]);
  const [selectedData, setSelectedData] = useState<string | null>(null);
  const [selectorIsOpened, setSelectorIsOpened] = useState<boolean | null>(
    null,
  );
  const [inputValueSearch, setInputValueSearch] = useState<string | number>("");

  useEffect(() => {
    const once = () => {
      setDataList(items);
    };
    once();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`w-72 font-medium max-h-40 h-fit relative ${className}`}>
      <div
        className=" w-full p-2 flex bg-primary90  items-center justify-between border rounded"
        onClick={() => setSelectorIsOpened(!selectorIsOpened)}
      >
        <span>{selectedData ?? title}</span>
        {/* <span>
          <FontAwesomeIcon
            className={`transition-colors ${selectorIsOpened && "rotate-180"}`}
            icon={faChevronDown}
            fontSize={20}
          />
        </span>*/}
      </div>

      <ul
        className={`
         absolute w-full z-10 bg-gray-100 shadow-xl rounded 
         mt-2 h-0 overflow-y-auto transition 
         ${selectorIsOpened && "max-h-40 h-fit"}`}
      >
        {/* Search */}
        {hasSearch && (
          <div className="flex items-center px-2 sticky top-0 bg-white">
            {/*<span>
              <FontAwesomeIcon icon={faSearch} />
            </span>*/}

            <input
              className="p-2 outline-none"
              value={inputValueSearch}
              onChange={(e) =>
                setInputValueSearch(e.target.value.toLowerCase())
              }
              placeholder={hasSearch}
            />
          </div>
        )}

        {/* List Items */}
        {datalist && datalist?.length > 0 ? (
          datalist?.map((data, i) => (
            <li
              className={`p-2 text-desc hover:text-primary ${selectedData == data?.name && "text-primary"} ${/*!selectedData?.toLowerCase().startsWith(inputValueSearch) && "hidden"*/ ""}</ul>}`}
              onClick={() => {
                //select actual data;
                setSelectedData(data?.name);
                //Reset INPUT value
                setInputValueSearch("");
                //Close Modal
                setSelectorIsOpened(false);

                //Propagate Data to up;
                onChangeValue({
                  field,
                  data: data?.id,
                });
              }}
              key={i}
            >
              {data?.name}
            </li>
          ))
        ) : (
          <p>No Data yet</p>
        )}
      </ul>
    </div>
  );
}

//Manage Global Action Button
export function SelectActionButton({
  className,
  logo,
  title,
  logo_right = false,
  // logo_style,
  children,
  tag = "",
}: SelectActionButtonProp) {
  //Load current
  const [selectorIsOpened, setSelectorIsOpened] = useState<{
    opened: boolean;
    tag: string | null;
  }>({
    opened: false,
    tag: null,
  });

  const toggle = () => {
    setSelectorIsOpened((prev) => ({
      opened: !prev.opened,
      tag: tag,
    }));
  };

  const handleCloseEventForChild = (
    e: React.SyntheticEvent<HTMLUListElement>,
  ) => {
    if (e.currentTarget.closest("button")) {
      setSelectorIsOpened(() => ({
        opened: false,
        tag: "",
      }));
    }
  };

  return (
    <div className={`relative inline-block text-left`}>
      <button
        onClick={toggle}
        className={`flex items-center 
        justify-between hover:cursor-pointer  ${className} gap-2 px-3 py-2 transition`}
      >
        {/*<FontAwesomeIcon icon={logo} className={logo_style} />*/}
        {logo && !logo_right && <p>Logo</p>}
        <span>{title}</span>

        {/*<FontAwesomeIcon icon={logo} className={logo_style} />*/}
        {logo && logo_right && <p>Logo</p>}
      </button>

      <ul
        onClick={handleCloseEventForChild}
        className={`
          absolute right-0 mt-2 min-w-44 
          bg-white/80 py-2 space-y-2 w-fit origin-top-right
         border h-fit border-gray-200 rounded-md 
          [&_li]:hover:bg-gray-100 cursor-pointer [&_li]:px-2 overflow-hidden
          transition-all duration-200 ease-out z-20
          ${
            selectorIsOpened.opened && selectorIsOpened.tag === tag
              ? "opacity-100 scale-100"
              : "opacity-0 scale-0 pointer-events-none"
          }
        `}
      >
        {children}
      </ul>
    </div>
  );
}
