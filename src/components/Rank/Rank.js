import React from "react";

const Rank = ({name, entries}) => {
  return (
    <div>
      <div className='white f3'>
       {` ${name} , so far you have sent us ...`}
      </div>
      <div className='white f1'>
          {` ${entries} photos `}
      </div>
    </div>
  );
};

export default Rank;
