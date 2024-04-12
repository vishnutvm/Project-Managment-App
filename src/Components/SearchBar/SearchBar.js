import React from "react";
import {Input,Space} from "antd"

function SearchBar() {
    const { Search } = Input;
    const onSearch = (value, _e, info) => console.log(info?.source, value);
  return (
    <div>
      <Space direction="vertical">
        <Search
          placeholder="input search text"
          onSearch={onSearch}
          style={{
            width: 200,
          }}
        />
      </Space>
    </div>
  );
}

export default SearchBar;
