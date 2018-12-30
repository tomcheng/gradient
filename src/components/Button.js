import styled from "styled-components";

const Button = styled.div`
  display: inline-block;
  position: relative;
  border: 0;
  font-size: 18px;
  cursor: pointer;
  padding: 10px 15px;
  background-color: #fff;
  color: #345069;
  border-radius: 3px;
  user-select: none;
`;

export const OutlineButton = styled(Button)`
  color: #fff;
  background-color: #1a88b6;
`;

export default Button;