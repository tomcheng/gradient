import styled from "styled-components";

const FONT_SIZES = {
  1: 32,
  2: 24
};

const LINE_HEIGHTS = {
  1: 40,
  2: 32
};

const Title = styled.div`
  font-size: ${props => FONT_SIZES[props.level || 1]}px;
  line-height: ${props => LINE_HEIGHTS[props.level || 1]}px;
  margin-bottom: 15px;
`;

export default Title;
