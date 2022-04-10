import { useState } from "react";
import styled from "styled-components";

export const Circle = styled.div`
  background: ${(props) => props.color};
  border-radius: 50%;
  width: 12px;
  height: 12px;
  margin-right: 10px;
`;

const TableBase = styled.table`
  border-collapse: collapse;
  background: white;
  font-size: 0.9em;
  font-family: sans-serif;
  width: 100%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
`;

export const TR = styled.tr`
  text-align: left;
`;

export const THEAD = styled.thead`
  background-color: blue;
  color: #ffffff;
  text-align: left;
`;

export const TBODY = styled.tbody`
  color: black;
`;

export const TH = styled.th`
  padding: 12px 15px;
`;

export const TD = styled.td`
  padding: 12px 15px;
`;

export const TableWrapper = styled.div`
  margin: 16px 0 0;
  overflow-y: scroll;
`;

type TableProps = {
  headings: string[];
  rows: any;
};

const FilterPanel = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
  flex-direction: row;
  > * {
    margin-right: 10px;
  }
  flex-wrap: wrap;
`;

const FilterPill = styled.div<{ active: boolean }>`
  position: relative;
  border: 1px solid blue;
  background: ${(props) => (props.active ? "blue" : "white")};
  padding: 8px 16px;
  color: ${(props) => (props.active ? "white" : "blue")};
  border-radius: 10px;
  font-size: 14px;
  margin-bottom: 8px;

  &:hover {
    background: blue;
    color: white;
    display: block;
  }
`;

type FilterDropdownProps = {
  visible: boolean;
};

const FilterDropdown = styled.div<FilterDropdownProps>`
  display: ${(props) => (props.visible ? "block" : "none")};
  border: 1px solid blue;
  border-radius: 10px;
  position: absolute;
  background-color: #f9f9f9;
  padding: 8px 16px;
  min-width: 200px;
  left: 0px;
  top: 40px;
  color: blue;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
`;

const FilterOption = styled.div<{ selected: boolean }>`
  display: flex;
  flex-direction: row;
  font-weight: ${(props) => (props.selected ? "bold" : "normal")};
  padding: 4px 8px;
  align-items: center;
`;

type FilterConfig = {
  key: string;
  value: any;
};

type FilterSetup = {
  key: string;
  options: any[];
};

export function FilterBar(props: any) {
  const { filterSetup, addFilter, filters } = props;
  const [visible, setVisible] = useState(undefined);
  return (
    <FilterPanel>
      {filterSetup.map((setup: FilterSetup) => (
        <Filter
          setFilters={addFilter}
          value={setup.key}
          options={setup.options}
          filters={filters}
          visible={visible}
          setVisible={setVisible}
        />
      ))}
    </FilterPanel>
  );
}

export function Filter(props: any) {
  const { value, options, setFilters, filters, visible, setVisible } = props;

  const selectedFilters = filters.filter((f: FilterConfig) => f.key === value);

  return (
    <FilterPill
      onClick={() =>
        visible === value ? setVisible(undefined) : setVisible(value)
      }
      active={selectedFilters.length > 0}
    >
      {`${value}  ${
        selectedFilters.length > 0 ? `(${selectedFilters.length})` : ""
      }`}
      <FilterDropdown visible={visible === value}>
        {options.map((option: any) => {
          const selected = filters.find(
            (f: FilterConfig) => f.key === value && f.value === option
          );

          return (
            <FilterOption
              selected={selected}
              onClick={() => setFilters(value, option)}
            >
              <Circle color={selected ? "blue" : "transparent"} />
              {option}
            </FilterOption>
          );
        })}
      </FilterDropdown>
    </FilterPill>
  );
}

export function Table(props: TableProps) {
  const { headings } = props;

  const [filters, setFilters] = useState<Array<FilterConfig>>([]);
  const addFilter = (key: string, value: any) => {
    if (filters.find((f) => f.key === key && f.value === value)) {
      console.log("removing");
      console.log({ key, value });
      setFilters(filters.filter((f) => !(f.key === key && f.value === value)));
    } else {
      console.log("adding");
      console.log({ key, value });
      setFilters([...filters, { key, value }]);
    }
  };

  const filteredRows = props.rows.filter((row: any) => {
    return (
      filters.length === 0 ||
      filters.some((filter: any) => {
        return row[filter.key] === filter.value;
      })
    );
  });

  const uniques = (value: any, index: number, self: any) => {
    return (
      self.indexOf(value) === index &&
      value !== "" &&
      value !== null &&
      value !== undefined
    );
  };

  const filterSetup = headings.map((heading: string) => {
    return {
      key: heading,
      options: props.rows.map((row: any) => row[heading]).filter(uniques),
    } as FilterSetup;
  });
  console.log(filterSetup);

  return (
    <>
      <FilterBar
        filterSetup={filterSetup}
        addFilter={addFilter}
        filters={filters}
      />
      <TableWrapper>
        <TableBase {...props}>
          <THEAD>
            <TR>
              {headings.map((heading, index) => (
                <TH key={index}>{heading.toUpperCase()}</TH>
              ))}
            </TR>
          </THEAD>
          <TBODY>
            {filteredRows.map((row: any, index: number) => (
              <TR key={index}>
                {headings.map((heading, index) => (
                  <TD key={index}>{row[heading]}</TD>
                ))}
              </TR>
            ))}
          </TBODY>
        </TableBase>
      </TableWrapper>
    </>
  );
}
