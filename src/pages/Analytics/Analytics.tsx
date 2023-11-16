import { useState } from "react";
import "./Analytics.scss";
import useSWR from "swr";
import { DataTable } from "@/components/ui/data-table";
import { analyticsColumns } from "./components/analyticsColumns";
import { Analytic, DataWithPagination } from "@/types";
import { analyticsApis, getDataWithPagination } from "@/api";
import OutlinedButton from "@/elements/outlinedButton";
import SearchElement from "@/elements/search";
import filterUpLogo from "@/assets/filterIcon.svg";
import dayjs, { Dayjs } from "dayjs";
import { DateRange } from "@mui/x-date-pickers-pro";
import DateRangePickerWithButtonField from "@/components/ui/calendar/calendar";
import Loading from "@/components/Loading";

const Analytics = () => {
  const [value, setValue] = useState<DateRange<Dayjs>>([null, null]);
  // const [show, setShow] = useState(false);

  const [pageNum, setPageNum] = useState(1);
  const [minActionDate, setMinActionDate] = useState(dayjs(1997).toISOString());
  const [maxActionDate, setMaxActionDate] = useState(dayjs().toISOString());
  const {
    data: analyticsData,
    isLoading,
    error,
  } = useSWR<DataWithPagination<Analytic[]>>(
    analyticsApis.search({
      pageNum,
      pageSize: 10,
      minActionDate,
      maxActionDate,
    }),
    getDataWithPagination
  );

  const handleDateSelect = (newValue: DateRange<Dayjs>) => {
    if (newValue[0] !== null && newValue[1] !== null) {
      setMinActionDate(newValue?.[0].toISOString());
      setMaxActionDate(newValue?.[1].toISOString());
    }
    setValue(newValue);
  };

  const [sort, setSort] = useState(false);
  const handleFilterClick = () => {
    setSort(!sort);
  };
  const handleOptionClick = () => {};

  return (
    <div>
      <div className="headerTitle">Аналитика</div>
      <div className="subHeader">
        <SearchElement />
        <div style={{ display: "flex" }}>
          {/* <OutlinedButton
            icon={calendarLogo}
            text={"Выберите даты"}
            onClick={handleDateSelect}
          /> */}

          <DateRangePickerWithButtonField
            value={value}
            onChange={(newValue) => handleDateSelect(newValue)}
          />
          {/* {show ? <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateRangeCalendar
              calendars={1}
              value={value}
              onChange={(newValue) => setValue(newValue)}
            />
          </LocalizationProvider> : null} */}

          <div style={{ position: "relative" }}>
            <OutlinedButton
              icon={filterUpLogo}
              text={"Фильтры"}
              onClick={handleFilterClick}
            />
            {sort && (
              <div className="sort-options-analytics">
                <ul>
                  <li onClick={() => handleOptionClick()}>По времени</li>
                  <li onClick={() => handleOptionClick()}>
                    По модели автомобиля
                  </li>
                  <li onClick={() => handleOptionClick()}>По IP</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      {isLoading ? (
        <Loading />
      ) : error ? (
        <>Error</>
      ) : (
        analyticsData?.data && (
          <DataTable
            rowLink=""
            pageNum={pageNum}
            setPageNum={setPageNum}
            pagination={analyticsData.pagination}
            data={analyticsData?.data}
            columns={analyticsColumns}
          />
        )
      )}
    </div>
  );
};

export default Analytics;
