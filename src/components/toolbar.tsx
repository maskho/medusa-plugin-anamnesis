import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const Toolbar = (props) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [contentMenu, setContentMenu] = useState<"filter" | "sort" | null>(
    null
  );

  const sortTypes = useRef([
    {
      label: "Ascending",
      value: "ASC",
    },
    {
      label: "Descending",
      value: "DESC",
    },
  ]);
  const columns = useRef([
    {
      label: "Title",
      value: "title",
    },
    {
      label: "Description",
      value: "description",
    },
    {
      label: "Creation date",
      value: "created_at",
    },
  ]);
  const filterOperations = useRef([
    {
      label: "=",
      value: "Equal",
    },
    {
      label: ">",
      value: "MoreThan",
    },
    {
      label: "<",
      value: "LessThan",
    },
    {
      label: ">=",
      value: "MoreThanOrEqual",
    },
    {
      label: "<=",
      value: "LessThanOrEqual",
    },
    {
      label: "Like",
      value: "Like",
    },
    {
      label: "ILike",
      value: "ILike",
    },
  ]);

  const [sort, setSort] = useState({
    order_by: null,
    field: null,
  });
  // This two function are needed because the Select component doesn't accept custom functions
  const changeOrderBy = (value) =>
    setSort((sort) => {
      return { ...sort, order_by: value };
    });
  const changeField = (value) =>
    setSort((sort) => {
      return { ...sort, field: value };
    });
  useEffect(() => {
    if (sort.order_by && sort.field) {
      props.setFiltersSort((filter_sort) => {
        return {
          ...filter_sort,
          order: {
            [sort.field]: sort["order_by"],
          },
        };
      });
    }
  }, [JSON.stringify(sort)]);

  const [filters, setFilters] = useState([]);
  const next_filter_id = useRef(1);
  function newFilter() {
    setFilters((filters) => {
      return [
        ...filters,
        {
          id: next_filter_id.current,
          field: "",
          operation: "",
          value: "",
        },
      ];
    });
  }
  useEffect(() => {
    next_filter_id.current += 1;
  }, [filters.length]);
  function setValueFilter(input_value) {
    const [value, id, type] = input_value.split("---");
    setFilters((filters_element) =>
      filters_element.map((filter) =>
        filter.id == id
          ? { ...filter, [type == "columns" ? "field" : "operation"]: value }
          : filter
      )
    );
  }
  const [inputTimeout, setInputTimeout] = useState<NodeJS.Timeout | null>(null);
  function setInputValueFilter(event) {
    if (inputTimeout) {
      clearTimeout(inputTimeout);
    }

    const newTimeout = setTimeout(() => {
      setFilters((filters_element) =>
        filters_element.map((filter) =>
          filter.id == event.target.dataset.id
            ? { ...filter, value: event.target.value }
            : filter
        )
      );
    }, 1500);

    setInputTimeout(newTimeout);
  }
  function setDeleteFilter(event) {
    setFilters((filters) => {
      return filters.filter((filter) => filter.id != event.target.dataset.id);
    });
  }
  useEffect(() => {
    const where_object = {};

    for (let filter of filters) {
      if (filter.field && filter.operation && filter.value) {
        let value_to_add;
        if (filter.operation != "Equal") {
          value_to_add = {
            find_operator: filter.operation,
            value: filter.value,
          };
        } else {
          value_to_add = filter.value;
        }
        if (where_object[filter.field]) {
          if (Array.isArray(where_object[filter.field])) {
            where_object[filter.field] = [
              ...where_object[filter.field],
              value_to_add,
            ];
          } else {
            where_object[filter.field] = [
              where_object[filter.field],
              value_to_add,
            ];
          }
        } else {
          where_object[filter.field] = value_to_add;
        }
      }
    }
    props.setFiltersSort((filters_sort) => {
      return {
        ...filters_sort,
        where: where_object,
      };
    });
  }, [JSON.stringify(filters)]);

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex justify-between items-center w-full">
        <Link to="/a/form-editor">
          <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed">
            New form
          </button>

          {/* <Button variant="primary">
            <ArchiveBox />
            New article
          </Button> */}
        </Link>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-black bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              if (contentMenu == "sort") {
                setShowMenu(false);
                setContentMenu(null);
              } else {
                setShowMenu(true);
                setContentMenu("sort");
              }
            }}
          >
            Sort by
          </button>
          {/* <Button
            onClick={() => {
              if (contentMenu == "sort") {
                setShowMenu(false);
                setContentMenu(null);
              } else {
                setShowMenu(true);
                setContentMenu("sort");
              }
            }}
            variant="secondary"
          >
            <TrianglesMini />
            Sort by
          </Button> */}
          <button
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-black bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              if (contentMenu == "filter") {
                setShowMenu(false);
                setContentMenu(null);
              } else {
                setShowMenu(true);
                setContentMenu("filter");
              }
            }}
          >
            Filter
          </button>
          {/* <Button
            onClick={() => {
              if (contentMenu == "filter") {
                setShowMenu(false);
                setContentMenu(null);
              } else {
                setShowMenu(true);
                setContentMenu("filter");
              }
            }}
            variant="secondary"
          >
            <Funnel />
            Filter
          </Button> */}
        </div>
      </div>
      {showMenu ? (
        <div className="shadow-elevation-card-rest bg-ui-bg-base w-full rounded-lg px-8 pb-8 pt-6 flex justify-center">
          {contentMenu == "filter" ? (
            <div className="flex flex-col gap-2.5 w-full">
              <p className="text-xl font-semibold">Filter</p>
              <div className="flex flex-col gap-2">
                {/* <Button onClick={newFilter} size="small" className="px-3">
                  Add a filter
                </Button> */}
                <button
                  onClick={newFilter}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add a filter
                </button>
                <div className="flex flex-col gap-2">
                  {filters.map((filter) => {
                    return (
                      <div
                        key={filter.id}
                        className="flex items-center gap-4 w-full"
                      >
                        <div className="grid grid-cols-5 gap-4 w-full">
                          <div className="col-span-2">
                            <select
                              className="block w-full px-4 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              onChange={(e) => setValueFilter(e.target.value)}
                            >
                              <option value="" disabled selected>
                                Select a column to filter
                              </option>
                              {columns.current.map((item) => (
                                <option
                                  key={item.value}
                                  value={`${item.value}---${filter.id}---columns`}
                                >
                                  {item.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-span-1">
                            <select
                              className="block w-full px-4 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              onChange={(e) => setValueFilter(e.target.value)}
                            >
                              <option value="" disabled selected>
                                Operation
                              </option>
                              {filterOperations.current.map((item) => (
                                <option
                                  key={item.value}
                                  value={`${item.value}---${filter.id}---operation`}
                                >
                                  {item.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-span-2">
                            <input
                              onChange={setInputValueFilter}
                              data-id={filter.id}
                              className="caret-ui-fg-base bg-ui-bg-field hover:bg-ui-bg-field-hover shadow-borders-base placeholder-ui-fg-muted text-ui-fg-base transition-fg relative w-full appearance-none rounded-md outline-none focus-visible:shadow-borders-interactive-with-active disabled:text-ui-fg-disabled disabled:!bg-ui-bg-disabled disabled:placeholder-ui-fg-disabled disabled:cursor-not-allowed aria-[invalid=true]:!shadow-borders-error invalid:!shadow-borders-error [&amp;::--webkit-search-cancel-button]:hidden [&amp;::-webkit-search-cancel-button]:hidden [&amp;::-webkit-search-decoration]:hidden txt-compact-small h-8 px-2 py-1.5"
                              placeholder="Value to filter"
                            ></input>
                          </div>
                        </div>
                        {/* <Button
                          onClick={setDeleteFilter}
                          data-id={filter.id}
                          variant="danger"
                          className="p-1"
                        >
                          <Trash />
                        </Button> */}
                        <button
                          className="shadow-buttons-colored shadow-buttons-danger text-ui-fg-on-color bg-ui-button-danger after:button-danger-gradient hover:bg-ui-button-danger-hover hover:after:button-danger-hover-gradient active:bg-ui-button-danger-pressed active:after:button-danger-pressed-gradient focus-visible:shadow-buttons-danger-focus p-1 rounded-md"
                          onClick={setDeleteFilter}
                          data-id={filter.id}
                        >
                          Delete
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 w-full">
              <p className="text-xl font-semibold">Sort by</p>
              <div className="flex gap-4 items-center">
                <select
                  className="block w-full px-4 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onChange={(e) => changeField(e.target.value)}
                >
                  <option value="" disabled selected>
                    Select a field to sort
                  </option>
                  {columns.current.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <select
                  className="block w-full px-4 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onChange={(e) => changeOrderBy(e.target.value)}
                >
                  <option value="" disabled selected>
                    Select an order to sort
                  </option>
                  {sortTypes.current.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Toolbar;
