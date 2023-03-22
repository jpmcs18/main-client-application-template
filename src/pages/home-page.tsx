import { BrowserRouter, NavLink, Route, Switch } from 'react-router-dom';
import {
  useAuthorize,
  useSetMessage,
  useUpdateAuthorize,
  useUserProfile,
} from '../custom-hooks/authorize-provider';
import LoginPage from './login-page';
import UserPage from './user-page';

import { useMemo, useState } from 'react';
import { ICON } from '../constant';
import { Routes } from '../routes';
import ConcernPage from './concern-page';
import ManageProfile from './modals/manage-profile';
import RolePage from './role-page';
import TicketPage from './ticket-page';
import ClassificationPage from './classification-page';
import PersonnelPage from './personnel-page';
import OfficePage from './office-page';
import Dashboard from './dashboard';
import SummaryPage from './summary-page';
import ConcernMonitoringPage from './concern-monitoring-page';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faSignOutAlt,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export default function HomePage() {
  const [showProfile, setShowProfile] = useState(false);
  const authorize = useAuthorize();
  const profile = useUserProfile();
  const updateAuthorize = useUpdateAuthorize();
  const setMessage = useSetMessage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menus: {
    head: string;
    navs: { route: string | undefined; name: string | undefined }[];
  }[] = useMemo(
    () => [
      ...(profile?.admin
        ? [
            {
              head: 'Transactions',
              navs: [
                {
                  route: Routes.ConcernMonitoring,
                  name: 'Concerns Monitoring',
                },
                {
                  route: Routes.Concern,
                  name: 'Concerns',
                },
                {
                  route: Routes.Ticket,
                  name: 'Tickets',
                },
                {
                  route: Routes.Summary,
                  name: 'Summary',
                },
              ],
            },
            {
              head: 'Maintenances',
              navs: [
                {
                  route: Routes.User,
                  name: 'Users',
                },
                {
                  route: Routes.Personnel,
                  name: 'Personnels',
                },
                {
                  route: Routes.Role,
                  name: 'Roles',
                },
                {
                  route: Routes.Classification,
                  name: 'Classifications',
                },
                {
                  route: Routes.Office,
                  name: 'Offices',
                },
              ],
            },
          ]
        : [
            {
              head: 'Transactions',
              navs: [
                ...(profile?.distinctModules
                  ?.filter((x) => x.header === 'Transaction')
                  .map((x) => {
                    return { route: x.route, name: x.description };
                  }) ?? []),
              ],
            },
            {
              head: 'Maintenances',
              navs: [
                ...(profile?.distinctModules
                  ?.filter((x) => x.header === 'Maintenance')
                  .map((x) => {
                    return { route: x.route, name: x.description };
                  }) ?? []),
              ],
            },
          ]),
    ],
    [profile?.admin, profile?.distinctModules]
  );
  function logoutUser() {
    setMessage({
      message: 'Continue to logout?',
      action: 'YESNO',
      onOk: () => {
        updateAuthorize(false);
        setShowProfile(false);
      },
    });
  }
  return (
    <div>
      {authorize ? (
        <BrowserRouter>
          <header>
            <nav>
              <div className='menu-container'>
                <button
                  className='nav-menu menu-mobile-bars mobile-features'
                  onClick={() => {
                    setIsMenuOpen((x) => !x);
                  }}>
                  <FontAwesomeIcon icon={faBars as IconProp} />
                </button>
                <NavLink to={Routes.Home} exact className='nav-icon'>
                  {ICON}
                </NavLink>
                <div className='nav-menu-container'>
                  <button
                    className='nav-menu desktop-features'
                    onClick={() => setIsMenuOpen(() => true)}>
                    Menus
                  </button>
                  <div className='menu-container'>
                    <div className={'menus ' + (isMenuOpen ? 'menu-open' : '')}>
                      <div className='menu-items'>
                        <button
                          className={
                            'btn-menu-close ' + (isMenuOpen ? 'close-show' : '')
                          }
                          onClick={() => setIsMenuOpen(() => false)}>
                          <FontAwesomeIcon icon={faTimes as IconProp} />
                          <span> Close</span>
                        </button>
                      </div>
                      <div className='menu-items'>
                        <label
                          className='user-name nav-menu mobile-features'
                          onClick={() => {
                            setIsMenuOpen(() => false);
                            setShowProfile(true);
                          }}>
                          <div
                            className={
                              'title-name ' +
                              (profile?.isAvailable ? 'user-available' : '')
                            }>
                            {profile?.personnel?.name}
                          </div>
                          <div className='sub-name'>
                            <span>
                              {profile?.personnel?.office?.abbreviation ??
                                profile?.personnel?.office?.description}
                            </span>
                            <span className='classification-text'>
                              {!!profile?.personnel?.personnelClassification
                                ?.length &&
                                `(${profile?.personnel?.personnelClassification
                                  ?.map((x) => x.classification?.description)
                                  .join(' | ')})`}
                            </span>
                          </div>
                        </label>
                      </div>
                      {menus
                        .filter((x) => x.navs.length > 0)
                        .map((menu) => (
                          <div className='menu-items' key={menu.head}>
                            <div className='head'>{menu.head}</div>
                            <div className='navs'>
                              {menu.navs.map((nav) => (
                                <div key={nav.route}>
                                  <NavLink
                                    onClick={() => setIsMenuOpen(() => false)}
                                    to={nav.route ?? ''}
                                    exact
                                    className='nav-menu'>
                                    {nav.name}
                                  </NavLink>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
              <div
                onClick={() => setIsMenuOpen(() => false)}
                className={
                  'menu-blocker ' + (isMenuOpen ? 'menu-blocker-show' : '')
                }></div>
              <div className='menu-container'>
                <label
                  className='user-name nav-menu desktop-features'
                  onClick={() => setShowProfile(true)}>
                  <div
                    className={
                      'title-name ' +
                      (profile?.isAvailable ? 'user-available' : '')
                    }>
                    {profile?.personnel?.name}
                  </div>
                  <div className='sub-name'>
                    <span>
                      {profile?.personnel?.office?.abbreviation ??
                        profile?.personnel?.office?.description}
                    </span>
                    <span className='classification-text'>
                      {!!profile?.personnel?.personnelClassification?.length &&
                        `(${profile?.personnel?.personnelClassification
                          ?.map((x) => x.classification?.description)
                          .join(' | ')})`}
                    </span>
                  </div>
                </label>
                <label onClick={logoutUser} className='nav-menu'>
                  <FontAwesomeIcon
                    icon={faSignOutAlt as IconProp}
                    className='mobile-features'
                  />
                  <span className='desktop-features'>Logout</span>
                </label>
              </div>
            </nav>
          </header>
          <Switch>
            <Route path={Routes.Home} exact component={Dashboard} />
            {(profile?.distinctModules?.filter(
              (x) => x.route === Routes.User
            )?.[0]?.id ||
              profile?.admin) && (
              <Route path={Routes.User} exact component={UserPage} />
            )}
            {(profile?.distinctModules?.filter(
              (x) => x.route === Routes.Role
            )?.[0]?.id ||
              profile?.admin) && (
              <Route path={Routes.Role} exact component={RolePage} />
            )}
            {(profile?.distinctModules?.filter(
              (x) => x.route === Routes.Concern
            )?.[0]?.id ||
              profile?.admin) && (
              <Route path={Routes.Concern} exact component={ConcernPage} />
            )}
            {(profile?.distinctModules?.filter(
              (x) => x.route === Routes.ConcernMonitoring
            )?.[0]?.id ||
              profile?.admin) && (
              <Route
                path={Routes.ConcernMonitoring}
                exact
                component={ConcernMonitoringPage}
              />
            )}
            {(profile?.distinctModules?.filter(
              (x) => x.route === Routes.Ticket
            )?.[0]?.id ||
              profile?.admin) && (
              <Route path={Routes.Ticket} exact component={TicketPage} />
            )}
            {(profile?.distinctModules?.filter(
              (x) => x.route === Routes.Classification
            )?.[0]?.id ||
              profile?.admin) && (
              <Route
                path={Routes.Classification}
                exact
                component={ClassificationPage}
              />
            )}
            {(profile?.distinctModules?.filter(
              (x) => x.route === Routes.Personnel
            )?.[0]?.id ||
              profile?.admin) && (
              <Route path={Routes.Personnel} exact component={PersonnelPage} />
            )}
            {(profile?.distinctModules?.filter(
              (x) => x.route === Routes.Office
            )?.[0]?.id ||
              profile?.admin) && (
              <Route path={Routes.Office} exact component={OfficePage} />
            )}
            {(profile?.distinctModules?.filter(
              (x) => x.route === Routes.Summary
            )?.[0]?.id ||
              profile?.admin) && (
              <Route path={Routes.Summary} exact component={SummaryPage} />
            )}
          </Switch>
          <div>
            {showProfile && (
              <ManageProfile onClose={() => setShowProfile(false)} />
            )}
          </div>
        </BrowserRouter>
      ) : (
        <LoginPage />
      )}
    </div>
  );
}
