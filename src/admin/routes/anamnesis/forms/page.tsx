import { RouteConfig } from "@medusajs/admin";
import { DocumentText, Eye, Pencil, Trash } from "@medusajs/icons";
import { useAdminCustomDelete, useAdminCustomQuery } from "medusa-react";
import React, { useEffect, useRef, useState } from "react";
import Toolbar from "../../../../components/toolbar";
import { objectToQueryString } from "../../../../utils/query_params_parser";
import useTimedState from "../../../../utils/use_timed_state";
import { createPathRequest } from "../../../../utils/utils";
import { useTable } from "react-table";

const FormsPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [formsCount, setFormsCount] = useState({ take: 12, skip: 0 });
  const [filtersSort, setFiltersSort] = useState({});

  const { data, isLoading } = useAdminCustomQuery(
    "/anamnesis/forms?" +
      objectToQueryString({
        select: ["id", "title", "description", "created_at"],
        take: formsCount.take,
        skip: formsCount.skip,
        ...filtersSort,
      }),
    [""]
  );

  const [forms, setForms] = useState([]);

  const [formsLoadState, setFormsLoadState] = useTimedState(null, 7000);
  const previousNumberForms = useRef(0);

  useEffect(() => {
    if (JSON.stringify(filtersSort) != "{}") {
      setFormsCount((fc) => ({ ...fc, skip: 0 }));
      setForms([]);
      previousNumberForms.current = 0;
    }
  }, [JSON.stringify(filtersSort)]);

  useEffect(() => {
    if (data) {
      if (data?.error) {
        if (previousNumberForms.current == 0) {
          setError(data.error);
        } else {
          setError(null);
          setFormsLoadState("Unable to load more forms: " + data.error);
        }
      } else if (data?.forms) {
        setError(null);
        setForms((forms) => [...forms, ...data.forms]);

        if (!data.forms.length && forms.length) {
          setFormsLoadState("There are no more forms left");
        }
      } else {
        setError("An error occurred while fetching the forms");
      }
    }
  }, [data]);

  function loadMoreForms() {
    setFormsCount((fc) => ({ ...fc, skip: forms.length }));
  }

  const [formIdDelete, setFormIdDelete] = useState<string>("");
  const [deleteError, setDeleteError] = useTimedState(null, 5000);
  const [deleteSuccess, setDeleteSuccess] = useTimedState(null, 5000);
  const customDelete = useAdminCustomDelete(
    createPathRequest(formIdDelete),
    []
  );
  const mutateDelete = customDelete.mutate;

  useEffect(() => {
    if (formIdDelete) {
      deleteForm();
    }
  }, [formIdDelete]);

  async function deleteForm() {
    mutateDelete(void 0, {
      onSuccess: successDelete,
      onError: errorDelete,
    });
  }

  function successDelete() {
    setForms((forms) => forms.filter((f) => f.id !== formIdDelete));
    setDeleteSuccess("Form deleted successfully");
    setDeleteError(null);
  }

  function errorDelete() {
    setDeleteSuccess(null);
    setDeleteError("An error occurred while deleting the form");
  }

  const ActionButtons = ({ row, setFormIdDelete }) => (
    <div className="flex space-x-2">
      <button
        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => alert(`Viewing ${row.original.title}`)}
      >
        <Eye className="w-5 h-5" />
      </button>
      <button
        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => alert(`Editing ${row.original.title}`)}
      >
        <Pencil className="w-5 h-5" />
      </button>
      <button
        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => setFormIdDelete(row.original.id)}
      >
        <Trash className="w-5 h-5" />
      </button>
    </div>
  );

  // Define columns for the table
  const columns = React.useMemo(
    () => [
      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Creation Date",
        accessor: "created_at",
      },
      {
        Header: "Actions",
        Cell: ({ row }) => ActionButtons({ row, setFormIdDelete }),
      },
    ],
    []
  );

  // Use the useTable hook
  const tableInstance = useTable({ columns, data: forms });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <div className="flex flex-col gap-5 items-center break-words relative mb-12">
      <Toolbar setFiltersSort={setFiltersSort} />
      {deleteError || deleteSuccess ? (
        <div className="flex justify-center">
          {deleteError ? (
            <p className="text-center max-w-lg font-medium text-red-500">
              {deleteError}
            </p>
          ) : (
            ""
          )}
          {deleteSuccess ? (
            <p className="text-center max-w-lg font-medium text-blue-500">
              {deleteSuccess}
            </p>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
      {isLoading && !forms.length ? (
        <p className="text-center max-w-sm mt-4 font-medium">Loading...</p>
      ) : !error ? (
        forms && forms.length ? (
          <div className="w-full">
            <table {...getTableProps()} className="w-full border">
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps()}
                        className="border px-4 py-2"
                      >
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} className="border">
                      {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
                          className="border px-4 py-2"
                        >
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="max-w-sm w-full text-center mt-4 font-medium">
            No forms found
          </p>
        )
      ) : (
        <p
          className={`${
            typeof error === "object" ? "text-start" : "text-center"
          } max-w-sm text-red-500 mt-4 font-medium`}
        >
          {typeof error === "object" ? JSON.stringify(error) : error}
        </p>
      )}
    </div>
  );
};

export const config: RouteConfig = {
  link: {
    label: "Anamnesis Forms",
    icon: DocumentText,
  },
};

export default FormsPage;
