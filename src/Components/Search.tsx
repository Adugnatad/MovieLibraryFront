import React from "react";

const Search = ({ search, handleSearch }: any) => {
  return (
    <div className="search-header ">
      <input
        type="text"
        className="search-bar bg-blue-100 "
        placeholder="Search"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <button className="search-button">Search</button>
    </div>
  );
};

export default Search;
