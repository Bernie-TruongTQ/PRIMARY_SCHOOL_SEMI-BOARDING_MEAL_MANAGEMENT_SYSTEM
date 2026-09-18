import { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Hamburger from 'hamburger-react';

import AppMobileMenu from '../AppMobileMenu';
import { setEnableClosedSidebar } from '../../reducers/ThemeOptions';

export default function HeaderLogo() {
  const enableClosedSidebar = useSelector((state) => state.ThemeOptions.enableClosedSidebar);
  const dispatch = useDispatch();

  const toggleEnableClosedSidebar = () => {
    dispatch(setEnableClosedSidebar(!enableClosedSidebar));
  };

  return (
    <Fragment>
      <div className="app-header__logo">
        <div className="d-flex align-items-center gap-2 ps-1 app-header-brand">
          <span style={{ fontSize: '20px' }}>🍱</span>
          {!enableClosedSidebar && (
            <span className="fw-bold text-dark fs-6 brand-text" style={{ letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
              Tiểu Học Bán Trú
            </span>
          )}
        </div>
        <div className="header__pane ms-auto">
          <div onClick={toggleEnableClosedSidebar}>
            <Hamburger
              toggled={enableClosedSidebar}
              toggle={toggleEnableClosedSidebar}
              size={26}
              color="#6c757d"
            />
          </div>
        </div>
      </div>
      <AppMobileMenu />
    </Fragment>
  );
}
