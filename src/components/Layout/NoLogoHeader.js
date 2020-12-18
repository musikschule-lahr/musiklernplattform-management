import React from 'react';
import PropTypes from 'prop-types';
import { useHistory, Link } from 'react-router-dom';
import { TextButton } from 'musiklernplattform-components';
import BackIcon from '@iconify/icons-ion/chevron-back';
import logo from '~/styles/logo-my-beta.svg';

const NoLogoHeader = ({
  heading, actionItems, showBackBtn, backBtnPath, backBtnText, hideLogo,
}) => {
  const history = useHistory();
  const backBtnHandler = () => {
    if (backBtnPath) {
      history.push(backBtnPath);
    } else {
      history.goBack();
    }
  };
  return (
    <div className="NoLogoHeader">
      <div className="NoLogoHeaderRow1">
        <div className={hideLogo ? 'NoLogoHeaderBackBtn noIcon' : 'NoLogoHeaderBackBtn'} style={{ }}>
          {showBackBtn
          && (
          <TextButton
            icon={BackIcon}
            onClickHandler={backBtnHandler}
            disabled={history.length === 0}
            title={backBtnText}
          />
          )}
        </div>

        <div
          className={hideLogo ? 'NoLogoHeaderLogo noIcon' : 'NoLogoHeaderLogo'}
          style={{
            minHeight: '100%',
            alignSelf: 'center',
          }}
        >
          {hideLogo ? (
            <div className="noIconHeading">
              <span>{heading || 'None yet'}</span>
            </div>
          ) : (
            <Link
              to="/"
              style={{
                display: 'inline-flex',
              }}
            >
              <img
                src={logo}
                style={{
                  width: '35vw',
                  minHeight: '3vh',
                  alignSelf: 'center',
                }}
                alt="App Beta"
              />
            </Link>
          )}

        </div>
        <div
          className={hideLogo ? 'NoLogoHeaderAction noIcon' : 'NoLogoHeaderAction'}
          style={!actionItems ? { } : {}}
        >
          {actionItems && actionItems}
        </div>
      </div>
      {!hideLogo && (
      <div className="NoLogoHeaderRow2">
        <div className="NoLogoHeaderHeading">
          <h1>{heading || 'None yet'}</h1>
        </div>
      </div>
      )}

    </div>
  );
};

NoLogoHeader.propTypes = {
  heading: PropTypes.string.isRequired,
  showBackBtn: PropTypes.bool,
  backBtnPath: PropTypes.string,
  backBtnText: PropTypes.string,
  actionItems: PropTypes.node,
  hideLogo: PropTypes.bool,

};
NoLogoHeader.defaultProps = {
  showBackBtn: true,
  backBtnPath: null,
  backBtnText: 'Zurück',
  actionItems: null,
  hideLogo: false,
};

export default NoLogoHeader;
