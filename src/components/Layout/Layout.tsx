'use client';

import React, { ReactNode } from 'react';
import styled from 'styled-components';
import HeroBanner from './HeroBanner';

interface LayoutProps {
  children: ReactNode;
}

const Container = styled.div`
  max-width: 1128px;
  width: 100%;
  margin: 0 auto;
  padding: 0 24px;
  box-sizing: border-box;
`;

const Main = styled.main`
  padding: 48px 0;
  background-color: ${props => props.theme.colors.background.secondary};
  min-height: 100vh;
  transition: background-color ${props => props.theme.transition.default};
`;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const title = "Robots.txt Generator";
  const description = "Generate a robots.txt file for your website with ease. This tool builds robots.txt parameters that allow Google Analytics to measure Custom Campaigns, so you can see exactly what's working.";

  return (
    <>
      <HeroBanner title={title} description={description} />
      <Main>
        <Container>
          {children}
        </Container>
      </Main>
    </>
  );
};

export default Layout; 