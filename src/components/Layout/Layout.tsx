'use client';

import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface LayoutProps {
  children: ReactNode;
}

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 24px;
`;

const HeaderContent = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-family: 'Manrope', sans-serif;
  font-size: ${props => props.theme.heading.h1.fontSize};
  line-height: ${props => props.theme.heading.h1.lineHeight};
  font-weight: ${props => props.theme.heading.h1.fontWeight};
  margin: 0 0 16px;
  color: ${props => props.theme.colors.text.primary};
`;

const Subtitle = styled.p`
  font-size: ${props => props.theme.heading.body.fontSize};
  line-height: ${props => props.theme.heading.body.lineHeight};
  max-width: 800px;
  margin: 0;
  color: ${props => props.theme.colors.text.secondary};
`;

const Main = styled.main`
  padding: 48px 0;
  background-color: ${props => props.theme.colors.background.secondary};
  min-height: 100vh;
  transition: background-color ${props => props.theme.transition.default};
`;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Main>
        <Container>
          <HeaderContent>
            <Title>Robots.txt Generator</Title>
            <Subtitle>
              Generate a robots.txt file for your website with ease. This tool builds robots.txt parameters that allow Google Analytics to measure Custom Campaigns, so you can see exactly what's working.
            </Subtitle>
          </HeaderContent>
          {children}
        </Container>
      </Main>
    </>
  );
};

export default Layout; 