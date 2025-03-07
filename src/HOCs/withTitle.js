import React from 'react';
import { Helmet } from 'react-helmet';

/**
 * @function withTitle
 * @param {*} Component
 * @param {*} options
 * @description Setup page title
 * @returns React Component with title
 */
const withTitle = (Component, options = {}) => (props) => {
  const { title, titleComponent: CustomComponent } = options;
  let Title = null;

  if (CustomComponent) {
    Title = () => <CustomComponent />;
  } else if (title) {
    Title = () => (
      <Helmet>
        <meta charSet="utf-8" />
        <title>{title}</title>
      </Helmet>
    );
  }

  return (
    <>
      {Title ? <Title /> : null}
      <Component {...props} />
    </>
  );
};

export default withTitle;
