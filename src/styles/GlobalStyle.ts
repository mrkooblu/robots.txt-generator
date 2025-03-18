import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html,
  body {
    font-family: ${props => props.theme.fonts.family.primary};
    font-weight: ${props => props.theme.fonts.weights.regular};
    font-size: ${props => props.theme.heading.body.fontSize};
    line-height: ${props => props.theme.heading.body.lineHeight};
    color: ${props => props.theme.colors.text.primary};
    background-color: ${props => props.theme.colors.background.primary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background-color ${props => props.theme.transition.default}, color ${props => props.theme.transition.default};
  }

  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    transition: ${props => props.theme.transition.default};
    
    &:hover {
      text-decoration: underline;
    }
  }

  button, input, select, textarea {
    font-family: ${props => props.theme.fonts.family.primary};
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    
    &:disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    color: ${props => props.theme.colors.text.primary};
    transition: color ${props => props.theme.transition.default};
  }

  h1 {
    font-weight: ${props => props.theme.heading.h1.fontWeight};
    font-size: ${props => props.theme.heading.h1.fontSize};
    line-height: ${props => props.theme.heading.h1.lineHeight};
    margin-bottom: ${props => props.theme.spacing.md};
  }

  h2 {
    font-weight: ${props => props.theme.heading.h2.fontWeight};
    font-size: ${props => props.theme.heading.h2.fontSize};
    line-height: ${props => props.theme.heading.h2.lineHeight};
    margin-bottom: ${props => props.theme.spacing.md};
  }

  h3 {
    font-weight: ${props => props.theme.heading.h3.fontWeight};
    font-size: ${props => props.theme.heading.h3.fontSize};
    line-height: ${props => props.theme.heading.h3.lineHeight};
    margin-bottom: ${props => props.theme.spacing.sm};
  }

  h4 {
    font-weight: ${props => props.theme.heading.h4.fontWeight};
    font-size: ${props => props.theme.heading.h4.fontSize};
    line-height: ${props => props.theme.heading.h4.lineHeight};
    margin-bottom: ${props => props.theme.spacing.sm};
  }

  p {
    margin-bottom: ${props => props.theme.spacing.md};
    color: ${props => props.theme.colors.text.secondary};
  }

  .container {
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 ${props => props.theme.spacing.md};
  }

  /* Tab styles */
  .tab {
    font-weight: ${props => props.theme.fonts.weights.medium};
  }

  /* Button styles */
  .btn {
    font-weight: ${props => props.theme.fonts.weights.semibold};
  }
`;

export default GlobalStyle; 