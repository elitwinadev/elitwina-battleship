import React from "react";
import styled from "styled-components";
import { flex, position } from "../styles/Mixins";

const Footer = () => {

    return (
        <FooterWrapper>
           created by:
        </FooterWrapper>
    )
};

export default Footer;

const FooterWrapper = styled.div`
  ${flex('center', false)};
  flex-direction: row;
  ${position('absolute', '110%', '0', '0', '0')};
  color: white;
  font-size: 1.4rem;
  margin-left: 1%;
`;
