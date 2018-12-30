import React, { Fragment } from "react";
import styled from "styled-components";

const Dot = styled.div`
  background-color: #666;
  border-radius: 50%;
  width: 4px;
  height: 4px;
  & + & {
    margin-left: 6px;
  }
`;

const Ellipsis = () => (
  <Fragment>
    <Dot />
    <Dot />
    <Dot />
  </Fragment>
);

export default Ellipsis;
